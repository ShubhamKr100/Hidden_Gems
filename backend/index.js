// // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// // require('dotenv').config(); // Sabse upar load karein
// // const express = require('express');
// // const cors = require('cors');
// // const mongoose = require('mongoose');
// // const asyncHandler = require('express-async-handler');
// // const { GoogleGenerativeAI } = require("@google/generative-ai");

// // // --- MIDDLEWARE IMPORTS ---
// // // Make sure these files exist in your backend folder
// // const { protect, host } = require('./middleware/authMiddleware');
// // const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// // // --- MODEL IMPORTS ---
// // const User = require('./models/User');
// // const HostProfile = require('./models/HostProfile');
// // const Booking = require('./models/Booking');
// // const Review = require('./models/Review');

// // // --- UTILS ---
// // const generateToken = require('./utils/generateToken');

// // // --- APP CONFIGURATION ---
// // const app = express();
// // const port = process.env.PORT || 5000;

// // // --- GLOBAL MIDDLEWARE ---
// // app.use(cors());
// // app.use(express.json());

// // // --- DATABASE CONNECTION ---
// // const connectDB = async () => {
// //   try {
// //     const conn = await mongoose.connect(process.env.MONGO_URI);
// //     console.log(`MongoDB Connected : ${conn.connection.host}`);
// //   } catch (error) {
// //     console.error(`Error: ${error.message}`);
// //     process.exit(1);
// //   }
// // };
// // connectDB();

// // // =================================================================
// // // --- AI CONTROLLERS (FIXED & WORKING ✅) ---
// // // =================================================================

// // // 1. Smart Search (Context Injection)
// // const getAIRecommendations = asyncHandler(async (req, res) => {
// //   const { query } = req.body;
// //   if (!process.env.GEMINI_API_KEY) {
// //     res.status(500); throw new Error("Gemini API Key is missing");
// //   }

// //   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// //   // 1. Saare Hosts ka basic data nikalo
// //   const allHosts = await HostProfile.find({}).select("kitchenName city mealPrice mealDescription stayPrice stayDescription _id");
// //   const hostsString = JSON.stringify(allHosts);

// //   // 2. Prompt banao
// //   const prompt = `
// //       Act as a smart food and travel guide.
// //       Here is the list of available hosts in JSON format: ${hostsString}
      
// //       User Request: "${query}"
      
// //       Task: Find top 3 hosts that best match the request.
// //       Strict Output Rules:
// //       - Return ONLY a JSON array of matching host _ids.
// //       - No explanation.
// //       - Example: ["id1", "id2"]
// //     `;

// //   // 3. AI Call (Using gemini-pro)
// //   // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
// //   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// //   try {
// //     const result = await model.generateContent(prompt);
// //     const response = await result.response;
// //     let text = response.text();

// //     // 4. Cleaning & Parsing
// //     text = text.replace(/```json/g, "").replace(/```/g, "").trim();
// //     let suggestedIds = [];
// //     try {
// //         suggestedIds = JSON.parse(text);
// //     } catch (e) {
// //         suggestedIds = [];
// //     }

// //     // 5. Full Data Fetch
// //     const recommendedHosts = await HostProfile.find({ _id: { $in: suggestedIds } });
// //     res.json(recommendedHosts);
// //   } catch (error) {
// //       console.error("AI Recommendation Error:", error);
// //       res.status(500).json({ message: "AI failed to fetch recommendations" });
// //   }
// // });

// // // 2. Review Summarizer (FIXED MODEL NAME HERE ✅)
// // const summarizeReviews = asyncHandler(async (req, res) => {
// //   const { hostId } = req.body;

// //   if (!process.env.GEMINI_API_KEY) {
// //     res.status(500); throw new Error("Gemini API Key is missing");
// //   }

// //   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// //   try {
// //     // 1. Reviews nikalo
// //     const reviews = await Review.find({ host: hostId }).limit(20);
    
// //     if (!reviews || reviews.length < 3) {
// //       return res.json({ summary: "Not enough reviews to summarize yet." });
// //     }

// //     const reviewsText = reviews.map(r => r.comment).join("\n");

// //     // 2. Prompt
// //     const prompt = `
// //       Analyze these reviews: "${reviewsText}"
// //       Provide a short summary in 3 bullet points (Pros, Cons, Verdict).
// //       Use emojis. Keep it concise.
// //     `;

// //     // 3. AI Call (Changed to gemini-pro for stability)
// //     // const model = genAI.getGenerativeModel({ model: "gemini-pro" }); 
// //     // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

// //       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    
// //     const result = await model.generateContent(prompt);
// //     const response = await result.response;
    
// //     res.json({ summary: response.text() });

// //   } catch (error) {
// //     console.error("AI Summarizer Error:", error);
// //     res.status(500).json({ message: "AI generation failed: " + error.message });
// //   }
// // });


// // // =================================================================
// // // --- USER CONTROLLERS ---
// // // =================================================================
// // const registerUser = asyncHandler(async (req, res) => {
// //   const { name, email, password } = req.body;
// //   if (!name || !email || !password) {
// //       res.status(400); throw new Error('Please add all fields');
// //   }
// //   const userExists = await User.findOne({ email });
// //   if (userExists) { res.status(400); throw new Error('User already exists'); }
// //   const user = await User.create({ name, email, password });
// //   if (user) {
// //     res.status(201).json({
// //       _id: user._id, name: user.name, email: user.email, role: user.role,
// //       token: generateToken(user._id),
// //     });
// //   } else { res.status(400); throw new Error('Invalid user data'); }
// // });

// // const authUser = asyncHandler(async (req, res) => {
// //   const { email, password } = req.body;
// //   const user = await User.findOne({ email });
// //   if (user && (await user.matchPassword(password))) {
// //     res.json({
// //       _id: user._id, name: user.name, email: user.email, role: user.role,
// //       phoneNumber: user.phoneNumber, token: generateToken(user._id),
// //     });
// //   } else { res.status(401); throw new Error('Invalid email or password'); }
// // });

// // const getUserProfile = asyncHandler(async (req, res) => {
// //   res.json({
// //     _id: req.user._id, name: req.user.name, email: req.user.email,
// //     phoneNumber: req.user.phoneNumber, role: req.user.role,
// //   });
// // });

// // const updateUserProfile = asyncHandler(async (req, res) => {
// //   const user = await User.findById(req.user._id);
// //   if (user) {
// //     user.name = req.body.name || user.name;
// //     user.email = req.body.email || user.email;
// //     user.phoneNumber = req.body.phoneNumber !== undefined ? req.body.phoneNumber : user.phoneNumber;
// //     if (req.body.password) { user.password = req.body.password; }
// //     const updatedUser = await user.save();
// //     res.json({
// //       _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
// //       role: updatedUser.role, phoneNumber: updatedUser.phoneNumber,
// //       token: generateToken(updatedUser._id),
// //     });
// //   } else { res.status(404); throw new Error('User not found'); }
// // });

// // // =================================================================
// // // --- HOST CONTROLLERS ---
// // // =================================================================
// // const registerHost = asyncHandler(async (req, res) => {
// //     const { kitchenName, description, address, city, images, offersMeal, mealPrice, mealDescription, offersStay, stayPrice, stayDescription } = req.body;
// //     const user = req.user;
// //     if (!kitchenName || !description || !address || !city) {
// //         res.status(400); throw new Error('Please fill all required host details.');
// //     }
// //     if (user.role === 'host') { res.status(400); throw new Error('User is already a host'); }
// //     const hostProfile = await HostProfile.create({
// //         user: user._id, kitchenName, description, address, city, images,
// //         offersMeal, mealPrice: offersMeal ? mealPrice : 0, mealDescription: offersMeal ? mealDescription : '',
// //         offersStay, stayPrice: offersStay ? stayPrice : 0, stayDescription: offersStay ? stayDescription : ''
// //     });
// //     user.role = 'host';
// //     user.hostProfile = hostProfile._id;
// //     const updatedUser = await user.save();
// //     res.status(201).json({
// //         _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
// //         role: updatedUser.role, phoneNumber: updatedUser.phoneNumber,
// //         token: generateToken(updatedUser._id), hostProfile: hostProfile,
// //     });
// // });

// // const getHostProfile = asyncHandler(async (req, res) => {
// //   const profile = await HostProfile.findOne({ user: req.user._id });
// //   if (profile) { res.json(profile); }
// //   else { res.status(404); throw new Error('Host profile not found'); }
// // });

// // const updateHostProfile = asyncHandler(async (req, res) => {
// //   const profile = await HostProfile.findOne({ user: req.user._id });
// //   if (profile) {
// //     profile.kitchenName = req.body.kitchenName || profile.kitchenName;
// //     profile.description = req.body.description || profile.description;
// //     profile.address = req.body.address || profile.address;
// //     profile.city = req.body.city || profile.city;
// //     profile.images = req.body.images || profile.images;
// //     profile.offersMeal = req.body.offersMeal !== undefined ? req.body.offersMeal : profile.offersMeal;
// //     profile.mealPrice = req.body.mealPrice !== undefined ? req.body.mealPrice : profile.mealPrice;
// //     profile.mealDescription = req.body.mealDescription !== undefined ? req.body.mealDescription : profile.mealDescription;
// //     profile.offersStay = req.body.offersStay !== undefined ? req.body.offersStay : profile.offersStay;
// //     profile.stayPrice = req.body.stayPrice !== undefined ? req.body.stayPrice : profile.stayPrice;
// //     profile.stayDescription = req.body.stayDescription !== undefined ? req.body.stayDescription : profile.stayDescription;
// //     const updatedProfile = await profile.save();
// //     res.json(updatedProfile);
// //   } else { res.status(404); throw new Error('Host profile not found'); }
// // });

// // const getFeaturedHosts = asyncHandler(async (req, res) => {
// //   const hosts = await HostProfile.find({}).sort({ rating: -1 }).limit(4);
// //   res.json(hosts);
// // });

// // const searchHostsByCity = asyncHandler(async (req, res) => {
// //   const city = req.query.city;
// //   let hosts;
// //   if (city) {
// //     hosts = await HostProfile.find({ city: { $regex: city, $options: 'i' } });
// //   } else {
// //     hosts = await HostProfile.find({});
// //   }
// //   res.json(hosts);
// // });

// // const getHostById = asyncHandler(async (req, res) => {
// //   const profile = await HostProfile.findById(req.params.id);
// //   if (profile) { res.json(profile); }
// //   else { res.status(404); throw new Error('Host not found'); }
// // });

// // // =================================================================
// // // --- REVIEW CONTROLLERS ---
// // // =================================================================
// // const createHostReview = asyncHandler(async (req, res) => {
// //   const { rating, comment } = req.body;
// //   const hostId = req.params.id;
// //   const hostProfile = await HostProfile.findById(hostId);
// //   if (!hostProfile) {
// //     res.status(404);
// //     throw new Error('Host not found');
// //   }
// //   const review = new Review({
// //     host: hostId,
// //     user: req.user._id,
// //     name: req.user.name,
// //     rating: Number(rating),
// //     comment,
// //   });
// //   await review.save();
// //   const reviews = await Review.find({ host: hostId });
// //   hostProfile.numReviews = reviews.length;
// //   hostProfile.rating =
// //     reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
// //   await hostProfile.save();
// //   res.status(201).json({ message: 'Review added successfully' });
// // });

// // const getHostReviews = asyncHandler(async (req, res) => {
// //   const hostId = req.params.id;
// //   const reviews = await Review.find({ host: hostId }).sort({ createdAt: -1 });
// //   res.json(reviews);
// // });

// // // =================================================================
// // // --- BOOKING CONTROLLERS ---
// // // =================================================================
// // const createBooking = asyncHandler(async (req, res) => {
// //   const {
// //     hostId, travelerName, travelerContact, checkInDate, checkOutDate,
// //     guestCount, stayDuration, bookedMeal, mealPrice, bookedStay, stayPrice, totalPrice
// //   } = req.body;

// //   if (!hostId || !checkInDate || !guestCount || totalPrice === undefined) {
// //       res.status(400); throw new Error('Missing required booking information.');
// //   }
// //   const host = await HostProfile.findById(hostId);
// //   if (!host) {
// //     res.status(404); throw new Error('Host not found');
// //   }
// //   const booking = new Booking({
// //     user: req.user._id, host: hostId, travelerName, travelerContact,
// //     checkInDate, checkOutDate: bookedStay ? checkOutDate : null,
// //     guestCount, stayDuration, bookedMeal, mealPrice, bookedStay, stayPrice, totalPrice,
// //     status: 'Pending',
// //   });
// //   const createdBooking = await booking.save();
// //   res.status(201).json(createdBooking);
// // });

// // const getMyBookings = asyncHandler(async (req, res) => {
// //   const bookings = await Booking.find({ user: req.user._id })
// //     .populate('host', 'kitchenName city images')
// //     .sort({ createdAt: -1 });
// //   res.json(bookings);
// // });

// // const getHostBookings = asyncHandler(async (req, res) => {
// //   const hostProfile = await HostProfile.findOne({ user: req.user._id });
// //   if (!hostProfile) { res.status(404); throw new Error('Host profile not found for this user.'); }
// //   const bookings = await Booking.find({ host: hostProfile._id })
// //     .populate('user', 'name email phoneNumber')
// //     .sort({ createdAt: -1 });
// //   res.json(bookings);
// // });

// // const updateBookingStatus = asyncHandler(async (req, res) => {
// //   const { status } = req.body;
// //   if (!status || (status !== 'Confirmed' && status !== 'Cancelled')) {
// //     res.status(400); throw new Error('Invalid status provided.');
// //   }
// //   const booking = await Booking.findById(req.params.id);
// //   if (!booking) { res.status(404); throw new Error('Booking not found'); }
// //   const hostProfile = await HostProfile.findOne({ user: req.user._id });
// //   if (!hostProfile || booking.host.toString() !== hostProfile._id.toString()) {
// //     res.status(401); throw new Error('User not authorized to update this booking');
// //   }
// //   if (booking.status !== 'Pending') {
// //     res.status(400); throw new Error(`Booking is already ${booking.status}`);
// //   }
// //   booking.status = status;
// //   const updatedBooking = await booking.save();
// //   res.json(updatedBooking);
// // });

// // const getHostPendingBookingCount = asyncHandler(async (req, res) => {
// //   const hostProfile = await HostProfile.findOne({ user: req.user._id });
// //   if (!hostProfile) { return res.json({ count: 0 }); }
// //   const count = await Booking.countDocuments({ host: hostProfile._id, status: 'Pending' });
// //   res.json({ count });
// // });

// // // =================================================================
// // // --- ROUTES (AI Routes are PUBLIC now - No protect) ---
// // // =================================================================

// // app.get('/', (req, res) => { res.send('API is running...'); });

// // // User Routes
// // app.route('/api/users/register').post(registerUser);
// // app.route('/api/users/login').post(authUser);
// // app.route('/api/users/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

// // // Host Routes
// // app.route('/api/host/register').post(protect, registerHost);
// // app.route('/api/host/myprofile').get(protect, getHostProfile).put(protect, updateHostProfile);
// // app.route('/api/host/featured').get(getFeaturedHosts);
// // app.route('/api/host/search').get(searchHostsByCity);
// // app.route('/api/host/:id').get(getHostById);

// // // Review Routes
// // app.route('/api/hosts/:id/reviews')
// //   .get(getHostReviews) 
// //   .post(protect, createHostReview);

// // // Booking Routes
// // app.route('/api/bookings').post(protect, createBooking);
// // app.route('/api/bookings/mybookings').get(protect, getMyBookings);
// // app.route('/api/bookings/host').get(protect, host, getHostBookings);
// // app.route('/api/bookings/host/pending-count').get(protect, host, getHostPendingBookingCount);
// // app.route('/api/bookings/:id/status').put(protect, host, updateBookingStatus);

// // // AI Routes (NEW ✨) - No 'protect' here to avoid token issues for now
// // app.route('/api/ai/recommend').post(getAIRecommendations);
// // app.route('/api/ai/summarize').post(summarizeReviews);

// // // =================================================================
// // // --- ERROR HANDLING MIDDLEWARE ---
// // // =================================================================
// // app.use(notFound);
// // app.use(errorHandler);

// // // =================================================================
// // // --- START THE SERVER ---
// // // =================================================================
// // app.listen(port, () => {
// //   console.log(`Server is running on port: ${port}`);
// // });

// require('dotenv').config(); // Sabse upar load karein
// const crypto = require('crypto');

// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const asyncHandler = require('express-async-handler');
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// // --- STRIPE SETUP ---
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// // --- MIDDLEWARE IMPORTS ---
// const { protect, host } = require('./middleware/authMiddleware');
// const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// // --- MODEL IMPORTS ---
// const User = require('./models/User');
// const HostProfile = require('./models/HostProfile');
// const Booking = require('./models/Booking');
// const Review = require('./models/Review');

// // --- UTILS ---
// const generateToken = require('./utils/generateToken');

// // --- APP CONFIGURATION ---
// const app = express();
// const port = process.env.PORT || 5000;

// // --- GLOBAL MIDDLEWARE ---
// app.use(cors());
// app.use(express.json());

// // --- DATABASE CONNECTION ---
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB Connected : ${conn.connection.host}`);
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1);
//   }
// };
// connectDB();

// // =================================================================
// // --- STRIPE PAYMENT CONTROLLERS (NEW ✨) ---
// // =================================================================

// // 1. Create Stripe Checkout Session
// const createStripeSession = asyncHandler(async (req, res) => {
//   const booking = await Booking.findById(req.params.id).populate('host', 'kitchenName');

//   if (!booking) {
//     res.status(404); throw new Error('Booking not found');
//   }

//   // Check agar confirmed hai tabhi payment karne do
//   if (booking.status !== 'Confirmed') {
//     res.status(400); throw new Error('Booking must be confirmed by host before payment.');
//   }

//   // Stripe Session Create karo (INR mein amount * 100 karna padta hai paise ke liye)
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: [
//       {
//         price_data: {
//           currency: 'inr',
//           product_data: {
//             name: `Hidden Gems Stay & Meal - ${booking.host.kitchenName}`,
//             description: `Booking for ${booking.guestCount} Guest(s)`,
//           },
//           unit_amount: booking.totalPrice * 100, // ₹1080 * 100 = 108000 paise
//         },
//         quantity: 1,
//       },
//     ],
//     mode: 'payment',
//     // Payment success hone par wapas frontend ke success page par bhejenge
//     success_url: `http://localhost:5173/payment-success/${booking._id}`,
//     cancel_url: `http://localhost:5173/my-bookings`,
//   });

//   res.json({ url: session.url });
// });

// // 2. Mark Booking as Paid (After Stripe Success)
// const updateBookingToPaid = asyncHandler(async (req, res) => {
//   const booking = await Booking.findById(req.params.id);

//   if (booking) {
//     booking.isPaid = true;
//     booking.paidAt = Date.now();
//     booking.paymentId = req.body.paymentId || 'stripe_checkout_success';
    
//     const updatedBooking = await booking.save();
//     res.json(updatedBooking);
//   } else {
//     res.status(404); throw new Error('Booking not found');
//   }
// });

// // =================================================================
// // --- AI CONTROLLERS ---
// // =================================================================

// // 1. Smart Search (Context Injection)
// const getAIRecommendations = asyncHandler(async (req, res) => {
//   const { query } = req.body;
//   if (!process.env.GEMINI_API_KEY) {
//     res.status(500); throw new Error("Gemini API Key is missing");
//   }

//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//   // 1. Saare Hosts ka basic data nikalo
//   const allHosts = await HostProfile.find({}).select("kitchenName city mealPrice mealDescription stayPrice stayDescription _id");
//   const hostsString = JSON.stringify(allHosts);

//   // 2. Prompt banao
//   const prompt = `
//       Act as a smart food and travel guide.
//       Here is the list of available hosts in JSON format: ${hostsString}
      
//       User Request: "${query}"
      
//       Task: Find top 3 hosts that best match the request.
//       Strict Output Rules:
//       - Return ONLY a JSON array of matching host _ids.
//       - No explanation.
//       - Example: ["id1", "id2"]
//     `;

//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   try {
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     let text = response.text();

//     // 4. Cleaning & Parsing
//     text = text.replace(/```json/g, "").replace(/```/g, "").trim();
//     let suggestedIds = [];
//     try {
//         suggestedIds = JSON.parse(text);
//     } catch (e) {
//         suggestedIds = [];
//     }

//     // 5. Full Data Fetch
//     const recommendedHosts = await HostProfile.find({ _id: { $in: suggestedIds } });
//     res.json(recommendedHosts);
//   } catch (error) {
//       console.error("AI Recommendation Error:", error);
//       res.status(500).json({ message: "AI failed to fetch recommendations" });
//   }
// });

// // 2. Review Summarizer
// const summarizeReviews = asyncHandler(async (req, res) => {
//   const { hostId } = req.body;

//   if (!process.env.GEMINI_API_KEY) {
//     res.status(500); throw new Error("Gemini API Key is missing");
//   }

//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//   try {
//     const reviews = await Review.find({ host: hostId }).limit(20);
    
//     if (!reviews || reviews.length < 3) {
//       return res.json({ summary: "Not enough reviews to summarize yet." });
//     }

//     const reviewsText = reviews.map(r => r.comment).join("\n");

//     const prompt = `
//       Analyze these reviews: "${reviewsText}"
//       Provide a short summary in 3 bullet points (Pros, Cons, Verdict).
//       Use emojis. Keep it concise.
//     `;

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
    
//     res.json({ summary: response.text() });

//   } catch (error) {
//     console.error("AI Summarizer Error:", error);
//     res.status(500).json({ message: "AI generation failed: " + error.message });
//   }
// });

// // =================================================================
// // --- USER CONTROLLERS ---
// // =================================================================
// const registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body;
//   if (!name || !email || !password) {
//       res.status(400); throw new Error('Please add all fields');
//   }
//   const userExists = await User.findOne({ email });
//   if (userExists) { res.status(400); throw new Error('User already exists'); }
//   const user = await User.create({ name, email, password });
//   if (user) {
//     res.status(201).json({
//       _id: user._id, name: user.name, email: user.email, role: user.role,
//       token: generateToken(user._id),
//     });
//   } else { res.status(400); throw new Error('Invalid user data'); }
// });

// const authUser = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (user && (await user.matchPassword(password))) {
//     res.json({
//       _id: user._id, name: user.name, email: user.email, role: user.role,
//       phoneNumber: user.phoneNumber, token: generateToken(user._id),
//     });
//   } else { res.status(401); throw new Error('Invalid email or password'); }
// });

// const getUserProfile = asyncHandler(async (req, res) => {
//   res.json({
//     _id: req.user._id, name: req.user.name, email: req.user.email,
//     phoneNumber: req.user.phoneNumber, role: req.user.role,
//   });
// });

// const updateUserProfile = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user._id);
//   if (user) {
//     user.name = req.body.name || user.name;
//     user.email = req.body.email || user.email;
//     user.phoneNumber = req.body.phoneNumber !== undefined ? req.body.phoneNumber : user.phoneNumber;
//     if (req.body.password) { user.password = req.body.password; }
//     const updatedUser = await user.save();
//     res.json({
//       _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
//       role: updatedUser.role, phoneNumber: updatedUser.phoneNumber,
//       token: generateToken(updatedUser._id),
//     });
//   } else { res.status(404); throw new Error('User not found'); }
// });

// // =================================================================
// // --- HOST CONTROLLERS ---
// // =================================================================
// const registerHost = asyncHandler(async (req, res) => {
//     const { kitchenName, description, address, city, images, offersMeal, mealPrice, mealDescription, offersStay, stayPrice, stayDescription } = req.body;
//     const user = req.user;
//     if (!kitchenName || !description || !address || !city) {
//         res.status(400); throw new Error('Please fill all required host details.');
//     }
//     if (user.role === 'host') { res.status(400); throw new Error('User is already a host'); }
//     const hostProfile = await HostProfile.create({
//         user: user._id, kitchenName, description, address, city, images,
//         offersMeal, mealPrice: offersMeal ? mealPrice : 0, mealDescription: offersMeal ? mealDescription : '',
//         offersStay, stayPrice: offersStay ? stayPrice : 0, stayDescription: offersStay ? stayDescription : ''
//     });
//     user.role = 'host';
//     user.hostProfile = hostProfile._id;
//     const updatedUser = await user.save();
//     res.status(201).json({
//         _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
//         role: updatedUser.role, phoneNumber: updatedUser.phoneNumber,
//         token: generateToken(updatedUser._id), hostProfile: hostProfile,
//     });
// });

// const getHostProfile = asyncHandler(async (req, res) => {
//   const profile = await HostProfile.findOne({ user: req.user._id });
//   if (profile) { res.json(profile); }
//   else { res.status(404); throw new Error('Host profile not found'); }
// });

// const updateHostProfile = asyncHandler(async (req, res) => {
//   const profile = await HostProfile.findOne({ user: req.user._id });
//   if (profile) {
//     profile.kitchenName = req.body.kitchenName || profile.kitchenName;
//     profile.description = req.body.description || profile.description;
//     profile.address = req.body.address || profile.address;
//     profile.city = req.body.city || profile.city;
//     profile.images = req.body.images || profile.images;
//     profile.offersMeal = req.body.offersMeal !== undefined ? req.body.offersMeal : profile.offersMeal;
//     profile.mealPrice = req.body.mealPrice !== undefined ? req.body.mealPrice : profile.mealPrice;
//     profile.mealDescription = req.body.mealDescription !== undefined ? req.body.mealDescription : profile.mealDescription;
//     profile.offersStay = req.body.offersStay !== undefined ? req.body.offersStay : profile.offersStay;
//     profile.stayPrice = req.body.stayPrice !== undefined ? req.body.stayPrice : profile.stayPrice;
//     profile.stayDescription = req.body.stayDescription !== undefined ? req.body.stayDescription : profile.stayDescription;
//     const updatedProfile = await profile.save();
//     res.json(updatedProfile);
//   } else { res.status(404); throw new Error('Host profile not found'); }
// });

// const getFeaturedHosts = asyncHandler(async (req, res) => {
//   const hosts = await HostProfile.find({}).sort({ rating: -1 }).limit(4);
//   res.json(hosts);
// });

// const searchHostsByCity = asyncHandler(async (req, res) => {
//   const city = req.query.city;
//   let hosts;
//   if (city) {
//     hosts = await HostProfile.find({ city: { $regex: city, $options: 'i' } });
//   } else {
//     hosts = await HostProfile.find({});
//   }
//   res.json(hosts);
// });

// const getHostById = asyncHandler(async (req, res) => {
//   const profile = await HostProfile.findById(req.params.id);
//   if (profile) { res.json(profile); }
//   else { res.status(404); throw new Error('Host not found'); }
// });

// // =================================================================
// // --- REVIEW CONTROLLERS ---
// // =================================================================
// const createHostReview = asyncHandler(async (req, res) => {
//   const { rating, comment } = req.body;
//   const hostId = req.params.id;
//   const hostProfile = await HostProfile.findById(hostId);
//   if (!hostProfile) {
//     res.status(404);
//     throw new Error('Host not found');
//   }
//   const review = new Review({
//     host: hostId,
//     user: req.user._id,
//     name: req.user.name,
//     rating: Number(rating),
//     comment,
//   });
//   await review.save();
//   const reviews = await Review.find({ host: hostId });
//   hostProfile.numReviews = reviews.length;
//   hostProfile.rating =
//     reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
//   await hostProfile.save();
//   res.status(201).json({ message: 'Review added successfully' });
// });

// const getHostReviews = asyncHandler(async (req, res) => {
//   const hostId = req.params.id;
//   const reviews = await Review.find({ host: hostId }).sort({ createdAt: -1 });
//   res.json(reviews);
// });

// // =================================================================
// // --- BOOKING CONTROLLERS ---
// // =================================================================
// const createBooking = asyncHandler(async (req, res) => {
//   const {
//     hostId, travelerName, travelerContact, checkInDate, checkOutDate,
//     guestCount, stayDuration, bookedMeal, mealPrice, bookedStay, stayPrice, totalPrice
//   } = req.body;

//   if (!hostId || !checkInDate || !guestCount || totalPrice === undefined) {
//       res.status(400); throw new Error('Missing required booking information.');
//   }
//   const host = await HostProfile.findById(hostId);
//   if (!host) {
//     res.status(404); throw new Error('Host not found');
//   }
//   const booking = new Booking({
//     user: req.user._id, host: hostId, travelerName, travelerContact,
//     checkInDate, checkOutDate: bookedStay ? checkOutDate : null,
//     guestCount, stayDuration, bookedMeal, mealPrice, bookedStay, stayPrice, totalPrice,
//     status: 'Pending',
//   });
//   const createdBooking = await booking.save();
//   res.status(201).json(createdBooking);
// });

// const getMyBookings = asyncHandler(async (req, res) => {
//   const bookings = await Booking.find({ user: req.user._id })
//     .populate('host', 'kitchenName city images')
//     .sort({ createdAt: -1 });
//   res.json(bookings);
// });

// const getHostBookings = asyncHandler(async (req, res) => {
//   const hostProfile = await HostProfile.findOne({ user: req.user._id });
//   if (!hostProfile) { res.status(404); throw new Error('Host profile not found for this user.'); }
//   const bookings = await Booking.find({ host: hostProfile._id })
//     .populate('user', 'name email phoneNumber')
//     .sort({ createdAt: -1 });
//   res.json(bookings);
// });

// const updateBookingStatus = asyncHandler(async (req, res) => {
//   const { status } = req.body;
//   if (!status || (status !== 'Confirmed' && status !== 'Cancelled')) {
//     res.status(400); throw new Error('Invalid status provided.');
//   }
//   const booking = await Booking.findById(req.params.id);
//   if (!booking) { res.status(404); throw new Error('Booking not found'); }
//   const hostProfile = await HostProfile.findOne({ user: req.user._id });
//   if (!hostProfile || booking.host.toString() !== hostProfile._id.toString()) {
//     res.status(401); throw new Error('User not authorized to update this booking');
//   }
//   if (booking.status !== 'Pending') {
//     res.status(400); throw new Error(`Booking is already ${booking.status}`);
//   }
//   booking.status = status;
//   const updatedBooking = await booking.save();
//   res.json(updatedBooking);
// });

// const getHostPendingBookingCount = asyncHandler(async (req, res) => {
//   const hostProfile = await HostProfile.findOne({ user: req.user._id });
//   if (!hostProfile) { return res.json({ count: 0 }); }
//   const count = await Booking.countDocuments({ host: hostProfile._id, status: 'Pending' });
//   res.json({ count });
// });

// // =================================================================
// // --- ROUTES ---
// // =================================================================

// app.get('/', (req, res) => { res.send('API is running...'); });

// // User Routes
// app.route('/api/users/register').post(registerUser);
// app.route('/api/users/login').post(authUser);
// app.route('/api/users/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

// // Host Routes
// app.route('/api/host/register').post(protect, registerHost);
// app.route('/api/host/myprofile').get(protect, getHostProfile).put(protect, updateHostProfile);
// app.route('/api/host/featured').get(getFeaturedHosts);
// app.route('/api/host/search').get(searchHostsByCity);
// app.route('/api/host/:id').get(getHostById);

// // Review Routes
// app.route('/api/hosts/:id/reviews')
//   .get(getHostReviews) 
//   .post(protect, createHostReview);

// // Booking Routes
// app.route('/api/bookings').post(protect, createBooking);
// app.route('/api/bookings/mybookings').get(protect, getMyBookings);
// app.route('/api/bookings/host').get(protect, host, getHostBookings);
// app.route('/api/bookings/host/pending-count').get(protect, host, getHostPendingBookingCount);
// app.route('/api/bookings/:id/status').put(protect, host, updateBookingStatus);

// // Stripe Payment Routes (NEW ✨)
// app.route('/api/bookings/:id/checkout').post(protect, createStripeSession);
// app.route('/api/bookings/:id/pay').put(protect, updateBookingToPaid);

// // AI Routes
// app.route('/api/ai/recommend').post(getAIRecommendations);
// app.route('/api/ai/summarize').post(summarizeReviews);

// // =================================================================
// // --- ERROR HANDLING MIDDLEWARE ---
// // =================================================================
// app.use(notFound);
// app.use(errorHandler);

// // =================================================================
// // --- START THE SERVER ---
// // =================================================================
// app.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });

require('dotenv').config(); // Sabse upar load karein
const crypto = require('crypto');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- STRIPE SETUP ---
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// --- MIDDLEWARE IMPORTS ---
const { protect, host } = require('./middleware/authMiddleware');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// --- MODEL IMPORTS ---
const User = require('./models/User');
const HostProfile = require('./models/HostProfile');
const Booking = require('./models/Booking');
const Review = require('./models/Review');

// --- UTILS ---
const generateToken = require('./utils/generateToken');
const sendEmail = require('./utils/sendEmail'); // <-- ADDED FOR FORGOT PASSWORD

// --- APP CONFIGURATION ---
const app = express();
const port = process.env.PORT || 5000;
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'; // <-- DYNAMIC CLIENT URL

// --- GLOBAL MIDDLEWARE ---
app.use(cors());
app.use(express.json());

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
connectDB();

// =================================================================
// --- STRIPE PAYMENT CONTROLLERS ---
// =================================================================

// 1. Create Stripe Checkout Session
const createStripeSession = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('host', 'kitchenName');

  if (!booking) {
    res.status(404); throw new Error('Booking not found');
  }

  // Check agar confirmed hai tabhi payment karne do
  if (booking.status !== 'Confirmed') {
    res.status(400); throw new Error('Booking must be confirmed by host before payment.');
  }

  // Stripe Session Create (Math.round to prevent float decimal errors in paise)
  const unitAmountInPaise = Math.round(booking.totalPrice * 100);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Hidden Gems Stay & Meal - ${booking.host.kitchenName}`,
            description: `Booking for ${booking.guestCount} Guest(s)`,
          },
          unit_amount: unitAmountInPaise,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${clientUrl}/payment-success/${booking._id}`,
    cancel_url: `${clientUrl}/my-bookings`,
  });

  res.json({ url: session.url });
});

// 2. Mark Booking as Paid (After Stripe Success)
const updateBookingToPaid = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (booking) {
    booking.isPaid = true;
    booking.paidAt = Date.now();
    booking.paymentId = req.body.paymentId || 'stripe_checkout_success';
    
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } else {
    res.status(404); throw new Error('Booking not found');
  }
});

// =================================================================
// --- AI CONTROLLERS ---
// =================================================================

// 1. Smart Search (Context Injection)
const getAIRecommendations = asyncHandler(async (req, res) => {
  const { query } = req.body;
  if (!process.env.GEMINI_API_KEY) {
    res.status(500); throw new Error("Gemini API Key is missing");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  // 1. Saare Hosts ka basic data nikalo
  const allHosts = await HostProfile.find({}).select("kitchenName city mealPrice mealDescription stayPrice stayDescription _id");
  const hostsString = JSON.stringify(allHosts);

  // 2. Prompt banao
  const prompt = `
      Act as a smart food and travel guide.
      Here is the list of available hosts in JSON format: ${hostsString}
      
      User Request: "${query}"
      
      Task: Find top 3 hosts that best match the request.
      Strict Output Rules:
      - Return ONLY a JSON array of matching host _ids.
      - No explanation.
      - Example: ["id1", "id2"]
    `;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // 3. Cleaning & Parsing
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    let suggestedIds = [];
    try {
        suggestedIds = JSON.parse(text);
    } catch (e) {
        suggestedIds = [];
    }

    // 4. Full Data Fetch
    const recommendedHosts = await HostProfile.find({ _id: { $in: suggestedIds } });
    res.json(recommendedHosts);
  } catch (error) {
      console.error("AI Recommendation Error:", error);
      res.status(500).json({ message: "AI failed to fetch recommendations" });
  }
});

// 2. Review Summarizer
const summarizeReviews = asyncHandler(async (req, res) => {
  const { hostId } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    res.status(500); throw new Error("Gemini API Key is missing");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  try {
    const reviews = await Review.find({ host: hostId }).limit(20);
    
    if (!reviews || reviews.length < 3) {
      return res.json({ summary: "Not enough reviews to summarize yet." });
    }

    const reviewsText = reviews.map(r => r.comment).join("\n");

    const prompt = `
      Analyze these reviews: "${reviewsText}"
      Provide a short summary in 3 bullet points (Pros, Cons, Verdict).
      Use emojis. Keep it concise.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    res.json({ summary: response.text() });

  } catch (error) {
    console.error("AI Summarizer Error:", error);
    res.status(500).json({ message: "AI generation failed: " + error.message });
  }
});

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

// 👇 NEW: Forgot Password Controller
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('There is no user registered with that email address');
  }

  // Get reset token from user model
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL targeting the frontend React route
  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

  const message = `
    <h3>You requested a password reset</h3>
    <p>Please click on the link below to set a new password. This link is valid for 15 minutes:</p>
    <a href="${resetUrl}" target="_blank" style="display:inline-block;padding:10px 20px;background-color:#007bff;color:#fff;text-decoration:none;border-radius:5px;">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request - Hidden Gems',
      message,
    });
    res.status(200).json({ message: 'Email sent successfully with reset instructions.' });
  } catch (err) {
    console.error("Email send error:", err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500);
    throw new Error('Email could not be sent. Please check your SMTP settings and try again.');
  }
});

// 👇 NEW: Reset Password Controller
const resetPassword = asyncHandler(async (req, res) => {
  // Hash token from URL parameter to match DB
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }, // Ensure token hasn't expired
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired password reset token');
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({ message: 'Password updated successfully! You can now login.' });
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
// --- BOOKING CONTROLLERS ---
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
app.route('/api/users/forgotpassword').post(forgotPassword);      // <-- ADDED FORGOT PASSWORD ROUTE
app.route('/api/users/resetpassword/:token').put(resetPassword);  // <-- ADDED RESET PASSWORD ROUTE

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

// Stripe Payment Routes
app.route('/api/bookings/:id/checkout').post(protect, createStripeSession);
app.route('/api/bookings/:id/pay').put(protect, updateBookingToPaid);

// AI Routes
app.route('/api/ai/recommend').post(getAIRecommendations);
app.route('/api/ai/summarize').post(summarizeReviews);

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