const mongoose = require("mongoose");
const moment = require("moment");

let newUserSchema = mongoose.Schema({
  verified: { type: Boolean, default: false },
  userName: { type: String },
  email: { type: String },
  password: { type: String },
  contactNo: { type: String },
  profilePic: { type: String },
  usertype: { type: String },
  verificationCode: { type: String },
  birthDate: { type: String },
  createdDate: { type: Date, default: moment() },
  updatedDate: { type: Date },
  status: { type: String, default: "active" },
});

module.exports = new mongoose.model("user", newUserSchema);
