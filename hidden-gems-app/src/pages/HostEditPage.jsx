// // // src/pages/HostEditPage.jsx
// // import React from 'react';

// // function HostEditPage() {
// //   return (
// //     <div className="page-content">
// //       <h2>Edit Your Kitchen Profile</h2>
// //       <p>Yeh page jald hi banega. Yahan par host apni profile edit kar payega.</p>
// //     </div>
// //   );
// // }
// // export default HostEditPage;
// // src/pages/HostEditPage.jsx

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';

// function HostEditPage() {
//   // Form fields ke liye state
//   const [kitchenName, setKitchenName] = useState('');
//   const [description, setDescription] = useState('');
//   const [address, setAddress] = useState('');
//   const [city, setCity] = useState('');

//   const [offersMeal, setOffersMeal] = useState(false);
//   const [mealPrice, setMealPrice] = useState('');
//   const [mealDescription, setMealDescription] = useState('');

//   const [offersStay, setOffersStay] = useState(false);
//   const [stayPrice, setStayPrice] = useState('');
//   const [stayDescription, setStayDescription] = useState('');

//   // UI States
//   const [loading, setLoading] = useState(true); // Page load hone ke liye
//   const [submitting, setSubmitting] = useState(false); // Form submit hone ke liye
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState(''); // Success message ke liye
  
  
//   const navigate = useNavigate();

//   // Kadam 1: Page load hote hi puraana data fetch karo
//   useEffect(() => {
//     const fetchHostProfile = async () => {
//       try {
//         const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//         if (!userInfo || userInfo.role !== 'host') {
//           navigate('/login'); // Agar host nahi hai toh login par bhejo
//           return;
//         }

//         const config = {
//           headers: {
//             Authorization: `Bearer ${userInfo.token}`,
//           },
//         };

//         const { data } = await axios.get(
//           'https://hidden-gems-backend-q048.onrender.com/api/host/myprofile',
//           config
//         );

//         // Form ko puraane data se bharo
//         setKitchenName(data.kitchenName);
//         setDescription(data.description);
//         setAddress(data.address);  ////////////
//         setCity(data.city);
//         setImages(data.images[0] || '');////////   imj
//         setOffersMeal(data.offersMeal);
//         setMealPrice(data.mealPrice || '');
//         setMealDescription(data.mealDescription || '');
//         setOffersStay(data.offersStay);
//         setStayPrice(data.stayPrice || '');
//         setStayDescription(data.stayDescription || '');
        
//         setLoading(false);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch profile');
//         setLoading(false);
//       }
//     };

//     fetchHostProfile();
//   }, [navigate]);

//   // Kadam 2: Form submit hone par naya data bhejo
//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setSubmitting(true);
//     setError('');
//     setSuccess('');

//     try {
//       const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//       const config = {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${userInfo.token}`,
//         },
//       };

//       const updatedData = {
//         kitchenName, description, address, city,
//         images: [images], // <-- YEH LINE ADD KAREIN
//         offersMeal, mealPrice, mealDescription,
//         offersStay, stayPrice, stayDescription
//       };

//       // Naye PUT route ko call karo
//       await axios.put(
//         'https://hidden-gems-backend-q048.onrender.com/api/host/myprofile',
//         updatedData,
//         config
//       );

//       setSubmitting(false);
//       setSuccess('Profile updated successfully!');
//       // 2 second baad wapas dashboard par bhej do
//       setTimeout(() => navigate('/my-kitchen'), 2000);

//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update profile');
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return <div className="page-content"><h2>Loading Editor...</h2></div>;
//   }

//   return (
//     <div className="form-container page-content">
//       <Link to="/my-kitchen" className="back-button">← Go Back to Dashboard</Link>
//       <h2>Edit Your Kitchen Profile</h2>
      
//       {error && <p className="error-message">{error}</p>}
//       {success && <p className="success-message">{success}</p>}
      
//       <form onSubmit={handleSubmit}>
//         <h3>Your Kitchen/Home Details</h3>
//         <div className="form-group">
//           <label>Kitchen/Home Name</label>
//           <input type="text" value={kitchenName} onChange={(e) => setKitchenName(e.target.value)} required />
//         </div>
//         <div className="form-group">
//           <label>Description</label>
//           <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
//         </div>
//         <div className="form-group">
//           <label>Full Address</label>
//           <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
//         </div>
//         <div className="form-group">
//           <label>City</label>
//           <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
//         </div>

//         <hr />
        
//         <h3>Services You Offer</h3>
//         <div className="form-group-checkbox">
//           <input type="checkbox" id="offersMeal" checked={offersMeal} onChange={(e) => setOffersMeal(e.target.checked)} />
//           <label htmlFor="offersMeal">I offer Meals</label>
//         </div>
//         {offersMeal && (
//           <div className="form-group-nested">
//             <div className="form-group">
//               <label>Meal Price (per person)</label>
//               <input type="number" value={mealPrice} onChange={(e) => setMealPrice(e.target.value)} />
//             </div>
//             <div className="form-group">
//               <label>Meal Description</label>
//               <textarea value={mealDescription} onChange={(e) => setMealDescription(e.target.value)} />
//             </div>
//           </div>
//         )}

//         <div className="form-group-checkbox">
//           <input type="checkbox" id="offersStay" checked={offersStay} onChange={(e) => setOffersStay(e.target.checked)} />
//           <label htmlFor="offersStay">I offer a Stay</label>
//         </div>
//         {offersStay && (
//           <div className="form-group-nested">
//             <div className="form-group">
//               <label>Stay Price (per night)</label>
//               <input type="number" value={stayPrice} onChange={(e) => setStayPrice(e.target.value)} />
//             </div>
//             <div className="form-group">
//               <label>Stay Description</label>
//               <textarea value={stayDescription} onChange={(e) => setStayDescription(e.target.value)} />
//             </div>
//           </div>
//         )}
        
//         <button type="submit" className="cta-button" disabled={submitting}>
//           {submitting ? 'Saving...' : 'Save Changes'}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default HostEditPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function HostEditPage() {
  // Form fields ke liye state
  const [kitchenName, setKitchenName] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [images, setImages] = useState(''); // <-- YEH LINE ADD KI GAYI HAI

  const [offersMeal, setOffersMeal] = useState(false);
  const [mealPrice, setMealPrice] = useState('');
  const [mealDescription, setMealDescription] = useState('');

  const [offersStay, setOffersStay] = useState(false);
  const [stayPrice, setStayPrice] = useState('');
  const [stayDescription, setStayDescription] = useState('');

  // UI States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  // Kadam 1: Page load hote hi puraana data fetch karo
  useEffect(() => {
    const fetchHostProfile = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo || userInfo.role !== 'host') {
          navigate('/login');
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

        // Form ko puraane data se bharo
        setKitchenName(data.kitchenName);
        setDescription(data.description);
        setAddress(data.address);
        setCity(data.city);
        setImages(data.images[0] || ''); // Aapki line sahi hai
        setOffersMeal(data.offersMeal);
        setMealPrice(data.mealPrice || '');
        setMealDescription(data.mealDescription || '');
        setOffersStay(data.offersStay);
        setStayPrice(data.stayPrice || '');
        setStayDescription(data.stayDescription || '');
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
        setLoading(false);
      }
    };

    fetchHostProfile();
  }, [navigate]);

  // Kadam 2: Form submit hone par naya data bhejo
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const updatedData = {
        kitchenName, description, address, city,
        // images: [images], // Aapki line sahi hai

        images: images.split(',').map(url => url.trim()), // <-- Aise change karein

        //taki slider multiple images jaisa ho 



        offersMeal, mealPrice, mealDescription,
        offersStay, stayPrice, stayDescription
      };

      await axios.put(
        'https://hidden-gems-backend-q048.onrender.com/api/host/myprofile',
        updatedData,
        config
      );

      setSubmitting(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => navigate('/my-kitchen'), 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page-content"><h2>Loading Editor...</h2></div>;
  }

  return (
    <div className="form-container page-content">
      <Link to="/my-kitchen" className="back-button">← Go Back to Dashboard</Link>
      <h2>Edit Your Kitchen Profile</h2>
      
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      
      <form onSubmit={handleSubmit}>
        <h3>Your Kitchen/Home Details</h3>
        <div className="form-group">
          <label>Kitchen/Home Name</label>
          <input type="text" value={kitchenName} onChange={(e) => setKitchenName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Description</label>
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

        {/* --- YEH INPUT FIELD ADD KIYA GAYA HAI --- */}
        <div className="form-group">
          <label>Image URL (A picture of your food/home  , (Comma se alag karein))</label>
          {/* <input 
            type="text" 
            value={images} 
            onChange={(e) => setImages(e.target.value)} 
          /> */}

          {/* // niche changes taki for slider  */}

          <textarea 
            value={images} 
           onChange={(e) => setImages(e.target.value)} 
            placeholder="https://image1.com, https://image2.com, ..."
            />
        </div>
        {/* --- YAHAN TAK --- */}

        <hr />
        
        <h3>Services You Offer</h3>
        {/* ... baaki form (Meal aur Stay options) ... */}
        
        <div className="form-group-checkbox">
          <input type="checkbox" id="offersMeal" checked={offersMeal} onChange={(e) => setOffersMeal(e.target.checked)} />
          <label htmlFor="offersMeal">I offer Meals</label>
        </div>
        {offersMeal && (
          <div className="form-group-nested">
            <div className="form-group">
              <label>Meal Price (per person)</label>
              <input type="number" value={mealPrice} onChange={(e) => setMealPrice(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Meal Description</label>
              <textarea value={mealDescription} onChange={(e) => setMealDescription(e.target.value)} />
            </div>
          </div>
        )}

        <div className="form-group-checkbox">
          <input type="checkbox" id="offersStay" checked={offersStay} onChange={(e) => setOffersStay(e.target.checked)} />
          <label htmlFor="offersStay">I offer a Stay</label>
        </div>
        {offersStay && (
          <div className="form-group-nested">
            <div className="form-group">
              <label>Stay Price (per night)</label>
              <input type="number" value={stayPrice} onChange={(e) => setStayPrice(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Stay Description</label>
              <textarea value={stayDescription} onChange={(e) => setStayDescription(e.target.value)} />
            </div>
          </div>
        )}
        
        <button type="submit" className="cta-button" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default HostEditPage;