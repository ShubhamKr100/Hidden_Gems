// src/pages/BecomeHostPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function BecomeHostPage() {
  const [kitchenName, setKitchenName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [images, setImages] = useState(''); // Abhi ke liye simple text, baad mein file upload kar sakte hain

  // Meal Options
  const [offersMeal, setOffersMeal] = useState(false);
  const [mealPrice, setMealPrice] = useState('');
  const [mealDescription, setMealDescription] = useState('');

  // Stay Options
  const [offersStay, setOffersStay] = useState(false);
  const [stayPrice, setStayPrice] = useState('');
  const [stayDescription, setStayDescription] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();




// src/pages/BecomeHostPage.jsx

// ...baaki imports aur state waala code...

  const handleSubmit = async (event) => {
    event.preventDefault(); // Yeh line bahut zaroori hai
    console.log('Form submission started...'); // <-- Step 1

    if (!offersMeal && !offersStay) {
      setError('You must offer at least one service (Meal or Stay).');
      console.log('Error: No service offered.'); // <-- Step 2
      return;
    }

    setLoading(true);
    setError('');
    console.log('Loading state set to true. Sending request...'); // <-- Step 3

    try {
      // 1. Apni User Info localStorage se nikalo
      const userInfoString = localStorage.getItem('userInfo');

      if (!userInfoString) {
        console.log('Error: User is not logged in.'); // <-- Step 4
        throw new Error('You must be logged in to become a host.');
      }

    //   const { userInfo } = JSON.parse(userInfoString);
      // --- YEH LINE THEEK KI GAYI HAI ---
      // Pehle: const { userInfo } = JSON.parse(userInfoString); (Galat)
      const userInfo = JSON.parse(userInfoString); // (Sahi)
      // ---------------------------------
      // 2. Request ke saath token bhejo
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const hostData = {
        kitchenName, description, address, city, images: [images],
        offersMeal, mealPrice, mealDescription,
        offersStay, stayPrice, stayDescription
      };

      // 3. Backend API ko call karo
      const { data } = await axios.post(
        'https://hidden-gems-backend-q048.onrender.com/api/host/register',
        hostData,
        config
      );

      // 4. Success!
      console.log('Success! Host registered.'); // <-- Step 5
      setLoading(false);
    //   localStorage.setItem('userInfo', JSON.stringify(data.userInfo));
    localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/my-kitchen');

    } catch (err) {
      console.log('Error in catch block:', err); // <-- Step 6
      setError(err.response?.data?.message || err.message || 'Failed to become a host');
      setLoading(false);
    }
  };

// ...baaki component code...
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     if (!offersMeal && !offersStay) {
//       setError('You must offer at least one service (Meal or Stay).');
//       return;
//     }

//     setLoading(true);
//     setError('');

//     try {
//       // 1. Apni User Info localStorage se nikalo
//       const { userInfo } = JSON.parse(localStorage.getItem('userInfo'));

//       // 2. Request ke saath token bhejo (Security Guard ke liye)
//       const config = {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${userInfo.token}`,
//         },
//       };
      
//       const hostData = {
//         kitchenName, description, address, city, images: [images],
//         offersMeal, mealPrice, mealDescription,
//         offersStay, stayPrice, stayDescription
//       };

//       // 3. Backend API ko call karo
//       const { data } = await axios.post(
//         'https://hidden-gems-backend-q048.onrender.com/api/host/register', // Yeh API hum agle step mein banayenge
//         hostData,
//         config
//       );

//       // 4. Success! Apni local info update karo
//       setLoading(false);
//       localStorage.setItem('userInfo', JSON.stringify(data.userInfo)); // Backend se nayi info milegi
//       navigate('/my-kitchen'); // Host ko uske naye dashboard par bhej do

//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to become a host');
//       setLoading(false);
//     }
//   };







  return (
    <div className="form-container page-content">
      <h2>Become a Host</h2>
      <p>Share your authentic food and home with travelers.</p>
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <h3>Your Kitchen/Home Details</h3>
        <div className="form-group">
          <label>Kitchen/Home Name</label>
          <input type="text" value={kitchenName} onChange={(e) => setKitchenName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Description (Tell your story)</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Full Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>City</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Image URL (A picture of your food/home)</label>
          <input type="text" value={images} onChange={(e) => setImages(e.target.value)} />
        </div>

        <hr />
        
        <h3>Services You Offer</h3>
        <div className="form-group-checkbox">
          <input type="checkbox" id="offersMeal" checked={offersMeal} onChange={(e) => setOffersMeal(e.target.checked)} />
          <label htmlFor="offersMeal">I want to offer Meals</label>
        </div>

        {offersMeal && (
          <div className="form-group-nested">
            <div className="form-group">
              <label>Meal Price (per person)</label>
              <input type="number" value={mealPrice} onChange={(e) => setMealPrice(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Meal Description (e.g., Dal, Roti, Sabji...)</label>
              <textarea value={mealDescription} onChange={(e) => setMealDescription(e.target.value)} required />
            </div>
          </div>
        )}

        <div className="form-group-checkbox">
          <input type="checkbox" id="offersStay" checked={offersStay} onChange={(e) => setOffersStay(e.target.checked)} />
          <label htmlFor="offersStay">I want to offer a Stay (Homestay)</label>
        </div>

        {offersStay && (
          <div className="form-group-nested">
            <div className="form-group">
              <label>Stay Price (per night)</label>
              <input type="number" value={stayPrice} onChange={(e) => setStayPrice(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Stay Description (e.g., 1 Room, AC, Wifi...)</label>
              <textarea value={stayDescription} onChange={(e) => setStayDescription(e.target.value)} required />
            </div>
          </div>
        )}
        
        <button type="submit" className="cta-button" disabled={loading}>
          {loading ? 'Registering...' : 'Register as Host'}
        </button>
      </form>
    </div>
  );
}

export default BecomeHostPage;