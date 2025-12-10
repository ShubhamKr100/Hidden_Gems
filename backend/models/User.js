// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Har user ka email alag hona chahiye
  },
  password: {
    type: String,
    required: true,
  },
  // --- YEH FIELDS HUM BAAD MEIN USE KARENGE ---

  phoneNumber: { // <-- YEH NAYA FIELD ADD KAREIN
    type: String,
  }, 
  
  role: {
    type: String,
    enum: ['traveler', 'host'], // Role sirf in dono mein se ek ho sakta hai
    default: 'traveler',
  },
  isVerifiedHost: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true, // CreatedAt aur UpdatedAt time automatically add ho jayega
});

// Password match karne ke liye method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Naya user save hone se pehle password ko hash (encrypt) karein
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;