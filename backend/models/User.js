// // models/User.js

// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const crypto = require('crypto'); // <-- Built-in node module for random tokens



// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true, // Har user ka email alag hona chahiye
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   // --- YEH FIELDS HUM BAAD MEIN USE KARENGE ---

//   phoneNumber: { // <-- YEH NAYA FIELD ADD KAREIN
//     type: String,
//   }, 
  
//   role: {
//     type: String,
//     enum: ['traveler', 'host'], // Role sirf in dono mein se ek ho sakta hai
//     default: 'traveler',
//   },
//   isVerifiedHost: {
//     type: Boolean,
//     default: false,
//   },

//   // 👇 YEH 2 NAYE FIELDS ADD KAREIN (Forgot Password ke liye)
//   resetPasswordToken: String,
//   resetPasswordExpire: Date,

// }, {
//   timestamps: true, // CreatedAt aur UpdatedAt time automatically add ho jayega
// });

// // Password match karne ke liye method
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };



// // 👇 NAYA METHOD: Reset token generate karne ke liye
// userSchema.methods.getResetPasswordToken = function () {
//   // 1. Generate token
//   const resetToken = crypto.randomBytes(20).toString('hex');

//   // 2. Hash token and set to resetPasswordToken field in DB
//   this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

//   // 3. Set expiration time (15 Minutes)
//   this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

//   return resetToken;
// };



// // Naya user save hone se pehle password ko hash (encrypt) karein
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// const User = mongoose.model('User', userSchema);
// module.exports = User;

// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto'); // Built-in Node.js module for secure token generation

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  phoneNumber: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['user', 'traveler', 'host'], // Sabhi possible roles support karne ke liye
    default: 'traveler',
  },
  isVerifiedHost: {
    type: Boolean,
    default: false,
  },
  hostProfile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HostProfile', // Host banne par uske profile se link karne ke liye
  },
  
  // --- FORGOT PASSWORD FIELDS ---
  resetPasswordToken: String,
  resetPasswordExpire: Date,

}, {
  timestamps: true, // Automatically manages createdAt and updatedAt
});

// ==========================================
// 1. Password Hash (Encryption) Middleware
// ==========================================
// Database me save hone se pehle password ko encrypt karta hai
userSchema.pre('save', async function (next) {
  // Agar password modify nahi hua hai (jaise sirf name ya phone update hua ho), toh skip karo
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ==========================================
// 2. Match Password Method
// ==========================================
// Login ke waqt user ke entered password ko database ke encrypted password se compare karta hai
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ==========================================
// 3. Generate Reset Password Token Method
// ==========================================
// Forgot password ke liye secure random token banata hai aur expiry set karta hai
userSchema.methods.getResetPasswordToken = function () {
  // 1. Generate unhashed 20-byte random hex token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // 2. Hash token using SHA-256 and save it to the database schema field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // 3. Set expiration time to 15 minutes from now
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  // 4. Return unhashed token (Ye email ke via user ko bheja jayega)
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;