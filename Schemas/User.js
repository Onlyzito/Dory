const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  idU: { type: String },
  idS: { type: String },
  coins: { type: Number, default: 0 },
  daily: { type: Number, default: 0 },
  Exp: {
    xp: { type: Number, default: 1 },
    level: { type: Number, default: 1 },
    nextLevel: { type: Number, default: 100 },
    id: { type: String, default: "null" },
    user: { type: String, default: "null" },
  },
  vip: {
    hasVip: { type: Boolean, default: false },
    date: { type: Number, default: 0 },
  },
  marry: {
    time: { type: Number, default: 0 },
    user: { type: String, default: "null" },
    has: { type: Boolean, default: false },
  },
  reps: {
    size: { type: Number, default: 0 },
    size2: { type: Number, default: 0 },
    lastRep: { type: String, default: "null" },
    lastSend: { type: String, default: "null" },
    time: { type: Number, default: 0 },
  },
});

const User = mongoose.model("Users", userSchema);
module.exports = User;