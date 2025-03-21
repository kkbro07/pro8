const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const bidderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  teamName: { type: String, required: true },
  approved: { type: Boolean, default: false },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }], // Array of player IDs
});

bidderSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

bidderSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Bidder', bidderSchema);
