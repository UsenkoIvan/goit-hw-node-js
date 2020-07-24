const express = require('express');
const mongoose = require('mongoose');

const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const connect = require('./db/connect');

const authUserRouter = require('./users/users.auth.router');
const contactRouter = require('./contacts/contacts.router');

const app = express();

const PORT = 3010;

app.use(express.json());

app.use('/api/auth/', authUserRouter);
app.use('/api/contacts/', contactRouter);

app.use(morgan('combined'));
app.use(cors());
app.use((err, req, res, next) => {
  const { message, status } = err;
  res.status(status || 500).send(message);
});

connect();

app.listen(PORT, () => console.log(`Server is runing on port ${PORT}`));
