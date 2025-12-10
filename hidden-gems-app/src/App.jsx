// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// // Components
// import Navbar from './components/Navbar';
// import AppDownload from './components/AppDownload';
// import Footer from './components/Footer';

// // Pages
// import HomePage from './pages/HomePage';
// import AddSpotPage from './pages/AddSpotPage';
// import SpotDetailsPage from './pages/SpotDetailsPage'; // Aap is naam ko use kar rahe hain
// import LoginPage from './pages/LoginPage';
// import RegisterPage from './pages/RegisterPage';

// import './App.css';

// function App() {
//   return (           
//     // Step 1: Poore app ko <Router> se wrap karna zaroori hai
//     <Router>
//       <Navbar />
//       <main className="main-content">
//         <Routes>
//           {/* Aapke puraane routes */}
//           <Route path="/" element={<HomePage />} />
//           <Route path="/add" element={<AddSpotPage />} />
//           <Route path="/spot/:id" element={<SpotDetailsPage />} />

//           {/* Naye Login aur Register routes */}
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/register" element={<RegisterPage />} />
          
//           {/* Yahan hum apne "Find Meals" page ke liye route add kar sakte hain */}
//           {/* <Route path="/meals" element={<MealsPage />} /> */}
//         </Routes>
//       </main>
//       <AppDownload />
//       <Footer />
//     </Router>
//   );
// }

// export default App;

import React from 'react';
// BrowserRouter ko yahan se import NAHI karna hai
import { Routes, Route } from 'react-router-dom'; 

// --- Components ---
import Navbar from './components/Navbar';
import AppDownload from './components/AppDownload';
import Footer from './components/Footer';

// --- Pages (Puraane) ---
import HomePage from './pages/HomePage';
// import SpotDetailsPage from './pages/SpotDetailsPage';

// --- Pages (Authentication) ---
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// --- Pages (NAYE "Kitchens" FEATURE KE) ---
import BecomeHostPage from './pages/BecomeHostPage';

import MyKitchenPage from './pages/MyKitchenPage'; // <-- NAYA IMPORT
import FindMealsPage from './pages/FindMealsPage';   // <-- NAYA IMPORT
import HostEditPage from './pages/HostEditPage';     // <-- NAYA IMPORT

import HostDetailsPage from './pages/HostDetailsPage'; // <-- NAYA IMPORT
import MyBookingsPage from './pages/MyBookingsPage'; // <-- NAYA IMPORT
import MyProfilePage from './pages/MyProfilePage'; // <-- NAYA IMPORT
import HostBookingsPage from './pages/HostBookingsPage'; // <-- Import new page


// import FindMealsPage from './pages/FindMealsPage'; // Hum yeh page agle step mein banayenge
// import MyKitchenPage from './pages/MyKitchenPage'; // Yeh Host ka dashboard hoga
// import HostDetailsPage from './pages/HostDetailsPage'; // Yeh Meal/Stay details page hoga

import './App.css';

function App() {
  return (
    // <Router> yahan nahi hai, yeh main.jsx mein hai (jo sahi hai)
    <> 
      <Navbar />
      <main className="main-content">
        <Routes>
          {/* --- Puraane Routes --- */}
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/spot/:id" element={<SpotDetailsPage />} /> */}
          
          {/* --- Auth Routes --- */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* --- Naye Host/Traveler Routes --- */}
          <Route path="/become-host" element={<BecomeHostPage />} />
          
          <Route path="/my-kitchen" element={<MyKitchenPage />} /> {/* <-- NAYA ROUTE */}

          {/* YEH DO NAYE ROUTES ADD KAREIN */}
          <Route path="/meals" element={<FindMealsPage />} />
          <Route path="/my-kitchen/edit" element={<HostEditPage />} />

          <Route path="/host/:id" element={<HostDetailsPage />} />
          <Route path="/mybookings" element={<MyBookingsPage />} />


          <Route path="/profile" element={<MyProfilePage />} />

          {/* Yeh routes hum agle steps mein banayenge.
            Maine inhe yahan planning ke liye add kar diya hai.
          */}

          <Route path="/host/bookings" element={<HostBookingsPage />} /> {/* <-- Add new route */}
          {/* <Route path="/meals" element={<FindMealsPage />} /> */}
          {/* <Route path="/my-kitchen" element={<MyKitchenPage />} /> */}
          {/* <Route path="/host/:id" element={<HostDetailsPage />} /> */}

        </Routes>
      </main>
      <AppDownload />
      <Footer />
    </>
  );
}

export default App;