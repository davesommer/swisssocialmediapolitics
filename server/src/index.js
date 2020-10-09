const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

require('dotenv').config();

const { bro, adminRouter } = require('./api/admin');
const politicians = require('./api/politicians');

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(bro.options.rootPath, adminRouter);

app.use(morgan('common'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
  });
});

app.use('/api/politicians', politicians);

const port = process.env.PORT || 1337;
app.listen(port, () => {
  // eslint-disable-next-line
  console.log(`listening on http://localhost:${port}`);
});
