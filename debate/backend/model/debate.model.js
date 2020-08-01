const mongoose = require("mongoose");
const moment = require("moment");

let debateSchema = mongoose.Schema(
  {
    userId: { type: String },
    topicName: { type: String },
    debateDate: { type: String },
    debateTime: { type: String },
    createdDate: { type: Date, default: moment() },
    updatedDate: { type: Date },
    status: { type: String, default: "pending" },
    debateStatus: { type: String },
    language: { type: String },
    opnion: { type: String },
    winner: {
      userId: { type: String },
      point: { type: Number },
    },
  },
  {
    collection: "debate",
  }
);

module.exports = new mongoose.model("debate", debateSchema);
