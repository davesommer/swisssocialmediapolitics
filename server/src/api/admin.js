const AdminBro = require('admin-bro');
const AdminBroMongoose = require('@admin-bro/mongoose');
const AdminBroExpress = require('@admin-bro/express');
const bcrypt = require('bcrypt');

const Politician = require('../models/politician');
const User = require('../models/user');
const Party = require('../models/party');

User.countDocuments({ role: 'admin' }, async (err, count) => {
  if (count === 0) {
    const user = new User();
    user.name = process.env.NAME;
    user.email = process.env.EMAIL;
    user.encryptedPassword = await bcrypt.hash(process.env.PASSWORD, 10);
    user.role = process.env.ROLE;
    user.save();
  }
});

AdminBro.registerAdapter(AdminBroMongoose);

const canModifyUsers = ({ currentAdmin }) =>
  // eslint-disable-next-line
  currentAdmin && currentAdmin.role === 'admin';

const AdminBroOptions = {
  resources: [
    {
      resource: User,
      options: {
        properties: {
          encryptedPassword: {
            isVisible: false,
          },
          password: {
            type: 'string',
            isVisible: {
              list: false,
              edit: true,
              filter: false,
              show: false,
            },
          },
        },
        actions: {
          new: {
            before: async (request) => {
              if (request.payload.password) {
                request.payload = {
                  ...request.payload,
                  encryptedPassword: await bcrypt.hash(
                    request.payload.password,
                    // eslint-disable-next-line
                    10
                  ),
                  password: undefined,
                };
              }
              return request;
            },
            isAccessible: canModifyUsers,
          },
          edit: { isAccessible: canModifyUsers },
          delete: { isAccessible: canModifyUsers },
        },
      },
    },
    {
      resource: Politician,
    },
    {
      resource: Party,
    },
  ],
  rootPath: '/admin',
};
const adminBro = new AdminBro(AdminBroOptions);
const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email });
    if (user) {
      const matched = await bcrypt.compare(password, user.encryptedPassword);
      if (matched) {
        return user;
      }
    }
    return false;
  },
  cookiePassword: 'some-secret-password-used-to-secure-cookie',
});

module.exports = {
  bro: adminBro,
  adminRouter: router,
};
