const mongoose = require("mongoose");

const LevelsSchema = new mongoose.Schema({
  userID: { type: String },
  guildID: { type: String },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 0 }
});

module.exports = mongoose.model('Levels', LevelsSchema);