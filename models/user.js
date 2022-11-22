const { Schema, model } = require("../db/connection");
var dateObj = new Date();
var month = dateObj.getUTCMonth() + 1; //months from 1-12
var day = dateObj.getUTCDate();
var year = dateObj.getUTCFullYear();

var newDate = year + "/" + month + "/" + day;
const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  status: { type: String, required: true, default: "Active" },
  dateLastAuthorization: { type: Date },
  dateRegister: { type: Date, default: newDate },
  theme: { type: String, required: true, default: "light" },
});

// User model
const User = model("User", UserSchema);

module.exports = User;
