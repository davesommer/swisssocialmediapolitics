const AdminBro = require('admin-bro');
const AdminBroMongoose = require('@admin-bro/mongoose');
const AdminBroExpress = require('@admin-bro/express');
const bcrypt = require('bcrypt');

const Politician = require('../models/politician');
const User = require('../models/user');
const { model } = require('../models/politician');

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
