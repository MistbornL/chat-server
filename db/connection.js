const mongoose = require("mongoose");
const { log } = require("mercedlogger");
require("dotenv").config();

const option = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const { MONGODB_URI } = process.env;
mongoose.connect(MONGODB_URI, option).then(
  function () {
    log.green("Connected to Mongo");
  },
  function (err) {
    log.red("Error connecting to Mongo" + err);
  }
);

// EXPORT CONNECTION
module.exports = mongoose;
