const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  totalBeds: {
    type: Number,
    required: true
  },
  availableBeds: {
    type: Number,
    required: true
  },
  specialties: [String],
  isAyushmanEmpaneled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

hospitalSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

hospitalSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Hospital', hospitalSchema);