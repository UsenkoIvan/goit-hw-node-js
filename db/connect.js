const mongoose = require('mongoose');

const connect = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      },
      console.log('Database connection successful'),
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connect;
