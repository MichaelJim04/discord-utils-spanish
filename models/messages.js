const mongoose = require("mongoose");

const MessagesSchema = new mongoose.Schema({
  userID: { type: String },
  guildID: { type: String },
  messages: { type: Number, default: 0 },
});

module.exports = mongoose.model('Messages', MessagesSchema);
