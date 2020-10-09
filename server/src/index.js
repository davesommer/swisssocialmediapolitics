const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const politicians = require('./api/politicians');

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

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
  console.log(`listening on http://localhost:${port}`);
});
