const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
require('dotenv').config();

// --- MIDDLEWARE ---
const { protect, host } = require('./middleware/authMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// --- MODELS ---
// const Spot = require('./models/Spot'); // Spots feature hata diya
const User = require('./models/User');
const HostProfile = require('./models/HostProfile');
const Booking = require('./models/Booking');
const Review = require('./models/Review');

// --- UTILS ---
const generateToken = require('./utils/generateToken');

// --- APP CONFIGURATION ---
const app = express();
const port = process.env.PORT || 5000;

// --- GLOBAL MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Body parser

// --- DATABASE CONNECTION ---
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected : ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB(); // Database se connect karein

// =================================================================
// --- USER CONTROLLERS ---
// =================================================================
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
      res.status(400); throw new Error('Please add all fields');
  }
  const userExists = await User.findOne({ email });
  if (userExists) { res.status(400); throw new Error('User already exists'); }
  const user = await User.create({ name, email, password });
  if (user) {
    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      token: generateToken(user._id),
    });
  } else { res.status(400); throw new Error('Invalid user data'); }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      phoneNumber: user.phoneNumber, token: generateToken(user._id),
    });
  } else { res.status(401); throw new Error('Invalid email or password'); }
});

const getUserProfile = asyncHandler(async (req, res) => {
  res.json({
    _id: req.user._id, name: req.user.name, email: req.user.email,
    phoneNumber: req.user.phoneNumber, role: req.user.role,
  });
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phoneNumber = req.body.phoneNumber !== undefined ? req.body.phoneNumber : user.phoneNumber;
    if (req.body.password) { user.password = req.body.password; }
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
      role: updatedUser.role, phoneNumber: updatedUser.phoneNumber,
      token: generateToken(updatedUser._id),
    });
  } else { res.status(404); throw new Error('User not found'); }
});

// =================================================================
// --- HOST CONTROLLERS ---
// =================================================================
const registerHost = asyncHandler(async (req, res) => {
    const { kitchenName, description, address, city, images, offersMeal, mealPrice, mealDescription, offersStay, stayPrice, stayDescription } = req.body;
    const user = req.user;
    if (!kitchenName || !description || !address || !city) {
        res.status(400); throw new Error('Please fill all required host details.');
    }
    if (user.role === 'host') { res.status(400); throw new Error('User is already a host'); }
    const hostProfile = await HostProfile.create({
        user: user._id, kitchenName, description, address, city, images,
        offersMeal, mealPrice: offersMeal ? mealPrice : 0, mealDescription: offersMeal ? mealDescription : '',
        offersStay, stayPrice: offersStay ? stayPrice : 0, stayDescription: offersStay ? stayDescription : ''
    });
    user.role = 'host';
    user.hostProfile = hostProfile._id;
    const updatedUser = await user.save();
    res.status(201).json({
        _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
        role: updatedUser.role, phoneNumber: updatedUser.phoneNumber,
        token: generateToken(updatedUser._id), hostProfile: hostProfile,
    });
});

const getHostProfile = asyncHandler(async (req, res) => {
  const profile = await HostProfile.findOne({ user: req.user._id });
  if (profile) { res.json(profile); }
  else { res.status(404); throw new Error('Host profile not found'); }
});

const updateHostProfile = asyncHandler(async (req, res) => {
  const profile = await HostProfile.findOne({ user: req.user._id });
  if (profile) {
    profile.kitchenName = req.body.kitchenName || profile.kitchenName;
    profile.description = req.body.description || profile.description;
    profile.address = req.body.address || profile.address;
    profile.city = req.body.city || profile.city;
    profile.images = req.body.images || profile.images;
    profile.offersMeal = req.body.offersMeal !== undefined ? req.body.offersMeal : profile.offersMeal;
    profile.mealPrice = req.body.mealPrice !== undefined ? req.body.mealPrice : profile.mealPrice;
    profile.mealDescription = req.body.mealDescription !== undefined ? req.body.mealDescription : profile.mealDescription;
    profile.offersStay = req.body.offersStay !== undefined ? req.body.offersStay : profile.offersStay;
    profile.stayPrice = req.body.stayPrice !== undefined ? req.body.stayPrice : profile.stayPrice;
    profile.stayDescription = req.body.stayDescription !== undefined ? req.body.stayDescription : profile.stayDescription;
    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } else { res.status(404); throw new Error('Host profile not found'); }
});

const getFeaturedHosts = asyncHandler(async (req, res) => {
  const hosts = await HostProfile.find({}).sort({ rating: -1 }).limit(4);
  res.json(hosts);
});

const searchHostsByCity = asyncHandler(async (req, res) => {
  const city = req.query.city;
  let hosts;
  if (city) {
    hosts = await HostProfile.find({ city: { $regex: city, $options: 'i' } });
  } else {
    hosts = await HostProfile.find({});
  }
  res.json(hosts);
});

const getHostById = asyncHandler(async (req, res) => {
  const profile = await HostProfile.findById(req.params.id);
  if (profile) { res.json(profile); }
  else { res.status(404); throw new Error('Host not found'); }
});

// =================================================================
// --- REVIEW CONTROLLERS ---
// =================================================================
const createHostReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const hostId = req.params.id;
  const hostProfile = await HostProfile.findById(hostId);
  if (!hostProfile) {
    res.status(404);
    throw new Error('Host not found');
  }
  // const alreadyReviewed = ... (duplicate review check hata diya)
  const review = new Review({
    host: hostId,
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });
  await review.save();
  const reviews = await Review.find({ host: hostId });
  hostProfile.numReviews = reviews.length;
  hostProfile.rating =
    reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
  await hostProfile.save();
  res.status(201).json({ message: 'Review added successfully' });
});

const getHostReviews = asyncHandler(async (req, res) => {
  const hostId = req.params.id;
  const reviews = await Review.find({ host: hostId }).sort({ createdAt: -1 });
  res.json(reviews);
});

// =================================================================
// --- BOOKING CONTROLLERS (YEH MISSING THE) ---
// =================================================================
const createBooking = asyncHandler(async (req, res) => {
  const {
    hostId, travelerName, travelerContact, checkInDate, checkOutDate,
    guestCount, stayDuration, bookedMeal, mealPrice, bookedStay, stayPrice, totalPrice
  } = req.body;

  if (!hostId || !checkInDate || !guestCount || totalPrice === undefined) {
      res.status(400); throw new Error('Missing required booking information.');
  }
  const host = await HostProfile.findById(hostId);
  if (!host) {
    res.status(404); throw new Error('Host not found');
  }
  const booking = new Booking({
    user: req.user._id, host: hostId, travelerName, travelerContact,
    checkInDate, checkOutDate: bookedStay ? checkOutDate : null,
    guestCount, stayDuration, bookedMeal, mealPrice, bookedStay, stayPrice, totalPrice,
    status: 'Pending',
  });
  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
});

const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('host', 'kitchenName city images')
    .sort({ createdAt: -1 });
  res.json(bookings);
});

const getHostBookings = asyncHandler(async (req, res) => {
  const hostProfile = await HostProfile.findOne({ user: req.user._id });
  if (!hostProfile) { res.status(404); throw new Error('Host profile not found for this user.'); }
  const bookings = await Booking.find({ host: hostProfile._id })
    .populate('user', 'name email phoneNumber')
    .sort({ createdAt: -1 });
  res.json(bookings);
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!status || (status !== 'Confirmed' && status !== 'Cancelled')) {
    res.status(400); throw new Error('Invalid status provided.');
  }
  const booking = await Booking.findById(req.params.id);
  if (!booking) { res.status(404); throw new Error('Booking not found'); }
  const hostProfile = await HostProfile.findOne({ user: req.user._id });
  if (!hostProfile || booking.host.toString() !== hostProfile._id.toString()) {
    res.status(401); throw new Error('User not authorized to update this booking');
  }
  if (booking.status !== 'Pending') {
    res.status(400); throw new Error(`Booking is already ${booking.status}`);
  }
  booking.status = status;
  const updatedBooking = await booking.save();
  res.json(updatedBooking);
});

const getHostPendingBookingCount = asyncHandler(async (req, res) => {
  const hostProfile = await HostProfile.findOne({ user: req.user._id });
  if (!hostProfile) { return res.json({ count: 0 }); }
  const count = await Booking.countDocuments({ host: hostProfile._id, status: 'Pending' });
  res.json({ count });
});

// =================================================================
// --- ROUTES ---
// =================================================================

app.get('/', (req, res) => { res.send('API is running...'); });

// User Routes
app.route('/api/users/register').post(registerUser);
app.route('/api/users/login').post(authUser);
app.route('/api/users/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

// Host Routes
app.route('/api/host/register').post(protect, registerHost);
app.route('/api/host/myprofile').get(protect, getHostProfile).put(protect, updateHostProfile);
app.route('/api/host/featured').get(getFeaturedHosts);
app.route('/api/host/search').get(searchHostsByCity);
app.route('/api/host/:id').get(getHostById);

// Review Routes
app.route('/api/hosts/:id/reviews')
  .get(getHostReviews) 
  .post(protect, createHostReview);

// Booking Routes
app.route('/api/bookings').post(protect, createBooking);
app.route('/api/bookings/mybookings').get(protect, getMyBookings);
app.route('/api/bookings/host').get(protect, host, getHostBookings);
app.route('/api/bookings/host/pending-count').get(protect, host, getHostPendingBookingCount);
app.route('/api/bookings/:id/status').put(protect, host, updateBookingStatus);

// =================================================================
// --- ERROR HANDLING MIDDLEWARE ---
// =================================================================
app.use(notFound);
app.use(errorHandler);

// =================================================================
// --- START THE SERVER ---
// =================================================================
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});