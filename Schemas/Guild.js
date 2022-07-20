const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let guildSchema = new Schema({
  idS: { type: String },
  logs: {
    channel: { type: String, default: "null" },
    status: { type: Boolean, default: false },
  },
  logspuni: {
    channel: { type: String, default: "null" },
    status: { type: Boolean, default: false },
  },
  setrank: {
    channel: { type: String, default: "null" },
    status: { type: Boolean, default: false },
  },
  antifake: {
    status: { type: Boolean, default: false },
    days: { type: Number, default: 0 },
  },


});

let Guild = mongoose.model("Guilds", guildSchema);
module.exports = Guild;