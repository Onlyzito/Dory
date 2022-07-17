const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let userSchema = new Schema({
  idU: { type: String },
  idS: { type: String },
  Exp: {
    xp: { type: Number, default: 1 },
    level: { type: Number, default: 1 },
    nextLevel: { type: Number, default: 100 },
    id: { type: String, default: "null" },
    user: { type: String, default: "null" },
  },
});

const User = mongoose.model("Users", userSchema);
module.exports = User;