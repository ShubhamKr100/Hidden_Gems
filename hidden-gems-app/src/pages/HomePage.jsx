import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ImageSlider from '../components/ImageSlider'; // Slider component

function HomePage() {
  const [hosts, setHosts] = useState([]); // Sirf hosts ke liye state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ab humein sirf featured hosts ko fetch karna hai
    const fetchFeaturedHosts = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = await axios.get('https://hidden-gems-backend-q048.onrender.com/api/host/featured');
        setHosts(data);
        
      } catch (err) {
        console.error("Error fetching featured hosts:", err);
        setError("Could not load data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedHosts();
  }, []);

  if (loading) {
    return <div className="page-content" style={{ textAlign: 'center' }}><h2>Loading...</h2></div>;
  }

  if (error) {
    return <div className="page-content" style={{ textAlign: 'center' }}><h2>{error}</h2></div>;
  }

  return (
    <div className="page-content">
      {/* Aapka Hero Section yahan aa sakta hai */}
      {/* <div className="hero-section"> ... </div> */}

      {/* --- FEATURED HOSTS SECTION (Sirf yeh section bachega) --- */}
      <div className="featured-section" style={{ marginTop: '3rem' }}>
        <h2 style={{ textAlign: 'center' }}> Local Meals And Stays </h2>
        {hosts.length > 0? (
          <div className="spots-grid">
            {hosts.map(host => (
              <Link to={`/host/${host._id}`} key={host._id} className="spot-card-link">
                <div className="spot-card">
                  <ImageSlider images={host.images} />
                  <div className="spot-card-content">
                    <h3>{host.kitchenName}</h3>
                    <p><strong>{host.city}</strong></p>
                    
                    {/* --- YAHAN TYPO THA (className. -> className) --- */}
                    <div className="host-offerings" style={{fontSize: '0.9rem', color: '#333'}}>
                      {host.offersMeal && <span>✓ Meal (₹{host.mealPrice})</span>}
                      <br/>
                      {host.offersStay && <span>✓ Stay (₹{host.stayPrice})</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center' }}>No hosts available yet. Be the first to become one!</p>
        )}
      </div>

    </div>
  );
}

export default HomePage;

// // import React, { useState, useEffect } from 'react';
// // import { Link } from 'react-router-dom';
// // import StarRating from '../components/StarRating';
// // import axios from 'axios';

// // function HomePage() {
// //   const [spots, setSpots] = useState([]);

// //   useEffect(() => {
// //     const fetchSpots = async () => {
// //       try {
// //         const response = await axios.get('https://hidden-gems-backend-q048.onrender.com/api/spots');


// //     // V V V YEH NAYI LINE ADD KAREIN V V V
// //     console.log("Data received from backend:", response.data);
// //     // ^ ^ ^ YEH NAYI LINE ADD KAREIN ^ ^ ^



// //         setSpots(response.data);
// //       } catch (error) {
// //         console.error("Error fetching spots:", error);
// //       }
// //     };

// //     fetchSpots();
// //   }, []);

// //   return (
// //     <div className="page-content">
// //       <div className="hero-section">
// //         <h1>Discover India's Hidden Gems</h1>
// //         <p>Your guide to the most beautiful and unexplored places, shared by travelers like you.</p>
// //         <Link to="/add" className="cta-button">Share Your Gem</Link>
// //       </div>

// //       <div className="featured-section">
// //         <h2>Featured Spots</h2>
// //         <div className="spots-grid">
// //           {spots.map(spot => (
// //             // --- CHANGE YAHAN HAI ---
// //             // 'spot.id' ko 'spot._id' se replace kiya gaya hai
// //             <Link to={`/spot/${spot._id}`} key={spot._id} className="spot-card-link">
// //               <div className="spot-card">
// //                 <img src={spot.image} alt={spot.name} className="spot-card-image" />
// //                 <div className="spot-card-content">
// //                   <div className="card-title-line">
// //                     <h3>{spot.name}</h3>
// //  {/* YEH LINE ADD KAREIN */}
// //         <p className="spot-location"><strong>{spot.location}</strong></p> 
// //         {/* <p>{spot.description.substring(0, 100)}...</p> */}
// //         {/* Aap yahan par star rating bhi dikha sakte hain */}
     

// //                     <StarRating rating={spot.rating} />
// //                   </div>
// //                   <p>{spot.description}</p>
// //                 </div>
// //               </div>
// //             </Link>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default HomePage;
// // import React, { useState, useEffect } from 'react';
// // import { Link } from 'react-router-dom';
// // import StarRating from '../components/StarRating';
// // import axios from 'axios';

// // function HomePage() {
// //   const [spots, setSpots] = useState([]);

// //   useEffect(() => {
// //     const fetchSpots = async () => {
// //       try {
// //         const response = await axios.get('https://hidden-gems-backend-q048.onrender.com/api/spots');


// //     // V V V YEH NAYI LINE ADD KAREIN V V V
// //     console.log("Data received from backend:", response.data);
// //     // ^ ^ ^ YEH NAYI LINE ADD KAREIN ^ ^ ^



// //         setSpots(response.data);
// //       } catch (error) {
// //         console.error("Error fetching spots:", error);
// //       }
// //     };

// //     fetchSpots();
// //   }, []);

// //   return (
// //     <div className="page-content">
// //       <div className="hero-section">
// //         <h1>Discover India's Hidden Gems</h1>
// //         <p>Your guide to the most beautiful and unexplored places, shared by travelers like you.</p>
// //         <Link to="/add" className="cta-button">Share Your Gem</Link>
// //       </div>

// //       <div className="featured-section">
// //         <h2>Featured Spots</h2>
// //         <div className="spots-grid">
// //           {spots.map(spot => (
// //             // --- CHANGE YAHAN HAI ---
// //             // 'spot.id' ko 'spot._id' se replace kiya gaya hai
// //             <Link to={`/spot/${spot._id}`} key={spot._id} className="spot-card-link">
// //               <div className="spot-card">
// //                 <img src={spot.image} alt={spot.name} className="spot-card-image" />
// //                 <div className="spot-card-content">
// //                   <div className="card-title-line">
// //                     <h3>{spot.name}</h3>
// //  {/* YEH LINE ADD KAREIN */}
// //         <p className="spot-location"><strong>{spot.location}</strong></p> 
// //         {/* <p>{spot.description.substring(0, 100)}...</p> */}
// //         {/* Aap yahan par star rating bhi dikha sakte hain */}
     

// //                     <StarRating rating={spot.rating} />
// //                   </div>
// //                   <p>{spot.description}</p>
// //                 </div>
// //               </div>
// //             </Link>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default HomePage;
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// // import StarRating from '../components/StarRating';

// import ImageSlider from '../components/ImageSlider'; // <-- NAYA IMPORT

// function HomePage() {
//   const [spots, setSpots] = useState([]);
//   const [hosts, setHosts] = useState([]); // <-- Naya state Hosts ke liye
  
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchHomepageData = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Dono API calls ek saath karein
//         const spotPromise = axios.get('https://hidden-gems-backend-q048.onrender.com/api/spots');
//         const hostPromise = axios.get('https://hidden-gems-backend-q048.onrender.com/api/host/featured');

//         const [spotResponse, hostResponse] = await Promise.all([
//           spotPromise,
//           hostPromise,
//         ]);

//         setSpots(spotResponse.data);
//         setHosts(hostResponse.data); // <-- Naya data set karein
        
//       } catch (err) {
//         console.error("Error fetching homepage data:", err);
//         setError("Could not load data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchHomepageData();
//   }, []);

//   if (loading) {
//     return <div className="page-content" style={{ textAlign: 'center' }}><h2>Loading...</h2></div>;
//   }

//   if (error) {
//     return <div className="page-content" style={{ textAlign: 'center' }}><h2>{error}</h2></div>;
//   }

//   return (
//     <div className="page-content">
//       {/* Aapka Hero Section yahan aa sakta hai */}
//       {/* <div className="hero-section"> ... </div> */}

//       {/* --- SECTION 1: FEATURED SPOTS --- */}
//       <div className="featured-section">
//         <h2 style={{ textAlign: 'center' }}>Featured Spots</h2>
//         {spots.length > 0 ? (
//           <div className="spots-grid">
//             {spots.map(spot => (
//               <Link to={`/spot/${spot._id}`} key={spot._id} className="spot-card-link">
//                 <div className="spot-card">
//                   <img src={spot.image} alt={spot.name} className="spot-card-image" />
//                   <div className="spot-card-content">
//                     <div className="card-title-line">
//                       <h3>{spot.name}</h3>
//                       {/* <StarRating rating={spot.rating} /> */}
//                     </div>
//                     <p><strong>{spot.location}</strong></p>
//                     <p>{spot.description.substring(0, 100)}...</p>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         ) : (
//           <p style={{ textAlign: 'center' }}>No spots found yet.</p>
//         )}
//       </div>

//       {/* --- SECTION 2: FEATURED HOSTS (YEH NAYA SECTION HAI) --- */}
//       <div className="featured-section" style={{ marginTop: '3rem' }}>
//         <h2 style={{ textAlign: 'center' }}>Featured Local Kitchens</h2>
//         {hosts.length > 0 ? (
//           <div className="spots-grid">
//             {hosts.map(host => (
//               // TODO: Is link ko /host/:id par point karna hoga jab hum HostDetailPage banayenge
//               <Link to={`/host/${host._id}`} key={host._id} className="spot-card-link">
//                 <div className="spot-card">
//                   {/* <img 
//                     src={host.images[0] || 'default-image.jpg'} 
//                     alt={host.kitchenName} 
//                     className="spot-card-image" 
//                   /> */}




//                   {/* --- YAHAN CHANGE HUA HAI --- */}
//                   <ImageSlider images={host.images} />
//                   {/* --------------------------- */}
                  



                  
//                   <div className="spot-card-content">
//                     <h3>{host.kitchenName}</h3>
//                     <p><strong>{host.city}</strong></p>
//                     <div className="host-offerings" style={{fontSize: '0.9rem', color: '#333'}}>
//                       {host.offersMeal && <span>✓ Meal (₹{host.mealPrice})</span>}
//                       <br/>
//                       {host.offersStay && <span>✓ Stay (₹{host.stayPrice})</span>}
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         ) : (
//           <p style={{ textAlign: 'center' }}>No hosts available yet.</p>
//         )}
//       </div>

//     </div>
//   );
// }

// export default HomePage;

