// backend/models/Booking.js

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Yeh booking kis traveler ne ki hai
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  // Yeh booking kis host ke liye hai
  host: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'HostProfile' 
  },
  

// --- NAYE FIELDS ---
  travelerName: { type: String, required: true },
  travelerContact: { type: String, required: true },
  // bookingDate: { type: Date, required: true },

  checkInDate: { type: Date, required: true }, // <-- YEH ADD KAREIN (Meal/Stay shuru)
  checkOutDate: { type: Date }, // <-- YEH ADD KAREIN (Sirf Stay ke liye)


  guestCount: { type: Number, required: true, default: 1 },
  
  bookedMeal: { type: Boolean, default: false },

  // mealPrice: { type: Number, default: 0 }, // <-- YEH LINE ADD KAREIN

  bookedStay: { type: Boolean, default: false },

  // stayPrice: { type: Number, default: 0 }, // <-- YEH LINE ADD KAREIN

  stayDuration: { type: Number, default: 1 }, // Kitne din rehna hai
  
  totalPrice: { type: Number, required: true },
  status: { // <-- SABSE ZAROORI
    type: String,
    required: true,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending',
  },
  isPaid: { type: Boolean, required: true, default: false },
  // --- END NAYE FIELDS ---



  // // Service details
  // bookedMeal: { 
  //   type: Boolean, 
  //   default: false 
  // },
  // mealPrice: { 
  //   type: Number, 
  //   default: 0 
  // },
  // bookedStay: { 
  //   type: Boolean, 
  //   default: false 
  // },
  // stayPrice: { 
  //   type: Number, 
  //   default: 0 
  // },
  
  // // Payment details
  // totalPrice: { 
  //   type: Number, 
  //   required: true 
  // },
  // isPaid: { 
  //   type: Boolean, 
  //   required: true, 
  //   default: false 
  // },
  // paidAt: { 
  //   type: Date 
  // },




}, {
  timestamps: true, // Booking kab create hui, yeh time add karega
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;