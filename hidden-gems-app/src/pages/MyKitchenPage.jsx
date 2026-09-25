import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ImageSlider from '../components/ImageSlider'; // <-- NAYA IMPORT

function MyKitchenPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHostProfile = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        if (!userInfo || userInfo.role !== 'host') {
          setError('You are not authorized to view this page.');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(
          'https://hidden-gems-backend-q048.onrender.com/api/host/myprofile',
          config
        );

        setProfile(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
        setLoading(false);
      }
    };

    fetchHostProfile();
  }, []);

  if (loading) {
    return <div className="page-content"><h2>Loading Your Kitchen...</h2></div>;
  }

  if (error) {
    return <div className="page-content"><h2>{error}</h2></div>;
  }

  if (!profile) {
    return <div className="page-content"><h2>Host profile not found.</h2></div>;
  }

  // --- YAHAN CHANGES KIYE GAYE HAIN ---
  return (
    <div className="page-content">
      <h2 style={{ marginBottom: '0.5rem' }}>My Kitchen: {profile.kitchenName}</h2>
      <p style={{ marginTop: 0, fontStyle: 'italic' }}>{profile.description}</p>
      
      {/* --- IMAGE SECTION ADD KIYA GAYA --- */}


{/* --- YAHAN CHANGE HUA HAI --- */}
      <ImageSlider images={profile.images} />
      {/* --------------------------- */}

      {/* {profile.images && profile.images[0] && (
        <img 
          src={profile.images[0]} 
          alt={profile.kitchenName} 
          className="spot-detail-image" // Reuse styling from spot details
        />
      )} */}
      {/* --- IMAGE SECTION END --- */}

      <div className="host-details" style={{ marginTop: '2rem' }}>
        <h3>Your Offerings</h3>
        
        {profile.offersMeal && (
          <div className="service-card">
            <h4>✓ Authentic Meal</h4>
            <p><strong>Price:</strong> ₹{profile.mealPrice} per person</p>
            <p><strong>Details:</strong> {profile.mealDescription}</p>
          </div>
        )}
        
        {profile.offersStay && (
          <div className="service-card" style={{ marginTop: '1rem' }}>
            <h4>✓ Homestay</h4>
            <p><strong>Price:</strong> ₹{profile.stayPrice} per night</p>
            <p><strong>Details:</strong> {profile.stayDescription}</p>
          </div>
        )}

        {!profile.offersMeal && !profile.offersStay && (
          <p>You are not offering any services yet.</p>
        )}

        <Link to="/my-kitchen/edit" className="cta-button" style={{ marginTop: '2rem' }}>
          Edit My Offerings
        </Link>
      </div>
    </div>
  );
}

export default MyKitchenPage;

// // src/pages/MyKitchenPage.jsx

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// function MyKitchenPage() {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchHostProfile = async () => {
//       try {
//         // 1. Apni User Info localStorage se nikalo
//         const userInfo = JSON.parse(localStorage.getItem('userInfo'));

//         if (!userInfo || userInfo.role !== 'host') {
//           setError('You are not authorized to view this page.');
//           setLoading(false);
//           return;
//         }

//         // 2. Request ke saath token bhejo
//         const config = {
//           headers: {
//             Authorization: `Bearer ${userInfo.token}`,
//           },
//         };

//         // 3. Backend API ko call karo
//         const { data } = await axios.get(
//           'https://hidden-gems-backend-q048.onrender.com/api/host/myprofile',
//           config
//         );

//         setProfile(data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch profile');
//         setLoading(false);
//       }
//     };

//     fetchHostProfile();
//   }, []);

//   if (loading) {
//     return <div className="page-content"><h2>Loading Your Kitchen...</h2></div>;
//   }

//   if (error) {
//     return <div className="page-content"><h2>{error}</h2></div>;
//   }

//   if (!profile) {
//     return <div className="page-content"><h2>Host profile not found.</h2></div>;
//   }

//   return (
//     <div className="page-content">
//       <h2>My Kitchen: {profile.kitchenName}</h2>
//       <p>{profile.description}</p>
      
//       <div className="host-details">
//         <h3>Your Offerings</h3>
        
//         {profile.offersMeal && (
//           <div className="service-card">
//             <h4>✓ Authentic Meal</h4>
//             <p><strong>Price:</strong> ₹{profile.mealPrice} per person</p>
//             <p><strong>Details:</strong> {profile.mealDescription}</p>
//           </div>
//         )}
        
//         {profile.offersStay && (
//           <div className="service-card">
//             <h4>✓ Homestay</h4>
//             <p><strong>Price:</strong> ₹{profile.stayPrice} per night</p>
//             <p><strong>Details:</strong> {profile.stayDescription}</p>
//           </div>
//         )}

//         {!profile.offersMeal && !profile.offersStay && (
//           <p>You are not offering any services yet.</p>
//         )}

//         <Link to="/my-kitchen/edit" className="cta-button">
//           Edit My Offerings
//         </Link>
//       </div>
//     </div>
//   );
// }

// export default MyKitchenPage;

// src/pages/MyKitchenPage.jsx