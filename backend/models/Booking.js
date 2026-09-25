// // backend/models/Booking.js

// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//   // Yeh booking kis traveler ne ki hai
//   user: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     required: true, 
//     ref: 'User' 
//   },
//   // Yeh booking kis host ke liye hai
//   host: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     required: true, 
//     ref: 'HostProfile' 
//   },
  

// // --- NAYE FIELDS ---
//   travelerName: { type: String, required: true },
//   travelerContact: { type: String, required: true },
//   // bookingDate: { type: Date, required: true },

//   checkInDate: { type: Date, required: true }, // <-- YEH ADD KAREIN (Meal/Stay shuru)
//   checkOutDate: { type: Date }, // <-- YEH ADD KAREIN (Sirf Stay ke liye)


//   guestCount: { type: Number, required: true, default: 1 },
  
//   bookedMeal: { type: Boolean, default: false },

//   // mealPrice: { type: Number, default: 0 }, // <-- YEH LINE ADD KAREIN

//   bookedStay: { type: Boolean, default: false },

//   // stayPrice: { type: Number, default: 0 }, // <-- YEH LINE ADD KAREIN

//   stayDuration: { type: Number, default: 1 }, // Kitne din rehna hai
  
//   totalPrice: { type: Number, required: true },
//   status: { // <-- SABSE ZAROORI
//     type: String,
//     required: true,
//     enum: ['Pending', 'Confirmed', 'Cancelled'],
//     default: 'Pending',
//   },
//   isPaid: { type: Boolean, required: true, default: false },
//   // --- END NAYE FIELDS ---





// isPaid: { type: Boolean, default: false },
//   paidAt: { type: Date },
//   paymentId: { type: String },


// }, {
//   timestamps: true, // Booking kab create hui, yeh time add karega
// });

// const Booking = mongoose.model('Booking', bookingSchema);
// module.exports = Booking;


//   // // Service details
//   // bookedMeal: { 
//   //   type: Boolean, 
//   //   default: false 
//   // },
//   // mealPrice: { 
//   //   type: Number, 
//   //   default: 0 
//   // },
//   // bookedStay: { 
//   //   type: Boolean, 
//   //   default: false 
//   // },
//   // stayPrice: { 
//   //   type: Number, 
//   //   default: 0 
//   // },
  
//   // // Payment details
//   // totalPrice: { 
//   //   type: Number, 
//   //   required: true 
//   // },
//   // isPaid: { 
//   //   type: Boolean, 
//   //   required: true, 
//   //   default: false 
//   // },
//   // paidAt: { 
//   //   type: Date 
//   // },

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // 1. Kis traveler (user) ne booking ki hai
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' 
  },
  
  // 2. Kis host ke kitchen/stay ke liye booking hai
  host: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'HostProfile' 
  },
  
  // 3. Traveler ki Basic Details
  travelerName: { 
    type: String, 
    required: true 
  },
  travelerContact: { 
    type: String, 
    required: true 
  },

  // 4. Booking Dates & Guests
  checkInDate: { 
    type: Date, 
    required: true 
  },
  checkOutDate: { 
    type: Date // Sirf stay ke liye
  },
  guestCount: { 
    type: Number, 
    required: true, 
    default: 1 
  },
  stayDuration: { 
    type: Number, 
    default: 0 // Kitne din rehna hai (0 agar sirf meal hai)
  },
  
  // 5. Service Selection & Prices
  bookedMeal: { 
    type: Boolean, 
    default: false 
  },
  mealPrice: { 
    type: Number, 
    default: 0 
  },
  bookedStay: { 
    type: Boolean, 
    default: false 
  },
  stayPrice: { 
    type: Number, 
    default: 0 
  },

  // 6. Total Amount & Booking Status
  totalPrice: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String,
    required: true,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending',
  },

  // 7. Stripe Payment Tracking Fields 💳
  isPaid: { 
    type: Boolean, 
    required: true, 
    default: false 
  },
  paidAt: { 
    type: Date 
  },
  paymentId: { 
    type: String // Stripe ka transaction ID store karne ke liye
  },

}, {
  timestamps: true, // createdAt aur updatedAt automatic manage karega
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;