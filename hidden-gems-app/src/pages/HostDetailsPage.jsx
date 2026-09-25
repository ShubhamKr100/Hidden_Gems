
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ImageSlider from '../components/ImageSlider'; 

// --- DATE PICKER IMPORTS ---
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, differenceInDays } from 'date-fns';
// ---------------------------

function HostDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- MAIN DATA STATES ---
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userProfile, setUserProfile] = useState(null); // For phone number check

    // --- BOOKING FORM STATES ---
    const [bookMeal, setBookMeal] = useState(false);
    const [bookStay, setBookStay] = useState(false);
    const [range, setRange] = useState(undefined); // Date Range
    const [guestCount, setGuestCount] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);

    // --- BOOKING STATUS STATES ---
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState('');
    const [bookingSuccess, setBookingSuccess] = useState('');

    // --- REVIEW STATES ---
    const [reviews, setReviews] = useState([]);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState('');

    // --- AI SUMMARY STATES ---
    const [summary, setSummary] = useState("");
    const [aiLoading, setAiLoading] = useState(false);

    // =========================================================
    // 1. DATA FETCHING EFFECTS
    // =========================================================

    // Fetch Host Data & Reviews
    useEffect(() => {
        const fetchHostData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                setReviewLoading(true);
                
                // Parallel requests for speed
                const [hostResponse, reviewResponse] = await Promise.all([
                    axios.get(`http://localhost:5000/api/host/${id}`),
                    axios.get(`http://localhost:5000/api/hosts/${id}/reviews`)
                ]);

                setProfile(hostResponse.data);
                setReviews(reviewResponse.data);
            } catch (err) {
                const message = err.response?.data?.message || 'Failed to fetch host data';
                setError(message);
            } finally {
                setLoading(false);
                setReviewLoading(false);
            }
        };
        fetchHostData();
    }, [id]);

    // Fetch User Profile (Only once to check phone number)
    useEffect(() => {
        const fetchUserProfile = async () => {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            if (!userInfo) return;
            try {
                const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
                const { data } = await axios.get('http://localhost:5000/api/users/profile', config);
                setUserProfile(data);
            } catch (err) {
                console.error('User profile fetch failed', err);
            }
        };
        fetchUserProfile();
    }, []);

    // =========================================================
    // 2. CALCULATION EFFECTS
    // =========================================================

    // Calculate Total Price automatically
    useEffect(() => {
        if (profile) {
            // Calculate nights (Default to 0 if invalid range)
            const nights = (range?.from && range?.to) ? differenceInDays(range.to, range.from) : 0;
            
            // Meal Cost Calculation
            let mealCost = 0;
            if (bookMeal) {
                // Agar stay hai toh har raat ka khana, nahi to 1 din ka
                const multiplier = (nights > 0) ? nights : 1;
                mealCost = profile.mealPrice * guestCount * multiplier;
            }

            // Stay Cost Calculation
            const stayCost = (bookStay && nights > 0) ? (profile.stayPrice * nights) : 0;

            setTotalPrice(mealCost + stayCost);
        }
    }, [bookMeal, bookStay, profile, guestCount, range]);

    // =========================================================
    // 3. HANDLERS (ACTIONS)
    // =========================================================

    // ✨ AI Summarize Handler
    const handleSummarize = async () => {
        setAiLoading(true);
        try {
            const { data } = await axios.post('http://localhost:5000/api/ai/summarize', { hostId: id });
            setSummary(data.summary);
        } catch (error) {
            console.error(error);
            alert("AI service is currently unavailable. Please check backend console.");
        }
        setAiLoading(false);
    };

    // 📅 Booking Submit Handler
    const handleBookingSubmit = async () => {
        setBookingError('');
        setBookingSuccess('');

        // 1. Validation
        if (!bookMeal && !bookStay) return setBookingError('Please select at least one service (Meal or Stay).');
        if (!range || !range.from) return setBookingError('Please select a check-in date.');
        if (bookStay && !range.to) return setBookingError('Please select a check-out date for stay.');

        // 2. Auth Check
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) return navigate('/login?redirect=/host/' + id);

        // 3. Phone Check
        if (!userProfile || !userProfile.phoneNumber) {
             return setBookingError(<span>Please <Link to="/profile" style={{color: '#007bff'}}>add your phone number</Link> to your profile.</span>);
        }

        setBookingLoading(true);

        try {
            const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
            const nights = (range?.from && range?.to) ? differenceInDays(range.to, range.from) : 0;

            const bookingDetails = {
                hostId: profile._id, 
                travelerName: userInfo.name,
                travelerContact: userProfile.phoneNumber, 
                checkInDate: range.from,
                checkOutDate: range.to,
                guestCount: Number(guestCount),
                stayDuration: bookStay ? nights : 0,
                bookedMeal: bookMeal,
                mealPrice: bookMeal ? profile.mealPrice : 0,
                bookedStay: bookStay,
                stayPrice: bookStay ? profile.stayPrice : 0,
                totalPrice: totalPrice,
            };

            await axios.post('http://localhost:5000/api/bookings', bookingDetails, config);
            
            setBookingSuccess('Booking Request Sent! Check "My Bookings" for status.');
            // Reset form optional
        } catch (err) {
            setBookingError(err.response?.data?.message || 'Booking request failed.');
        } finally {
            setBookingLoading(false);
        }
    };

    // =========================================================
    // 4. RENDER UI
    // =========================================================

    if (loading) return <div className="page-content"><h2>Loading Host Details...</h2></div>;
    if (error) return <div className="page-content"><h2>{error}</h2></div>;
    if (!profile) return <div className="page-content"><h2>Host not found.</h2></div>;

    // Helper text for DatePicker
    let footer = <p className="text-sm text-gray-500 mt-2">Please pick the first day.</p>;
    if (range?.from && !range?.to) footer = <p className="text-sm text-gray-500 mt-2">{format(range.from, 'PPP')} – Please pick check-out day.</p>;
    if (range?.from && range?.to) footer = <p className="text-sm text-gray-500 mt-2">{format(range.from, 'PPP')} – {format(range.to, 'PPP')}</p>;

    return (
        <div className="page-content">
            {/* --- Header Section --- */}
            <h2 style={{ marginBottom: '0.5rem' }}>{profile.kitchenName}</h2>
            <p style={{ marginTop: 0, fontStyle: 'italic', color: '#555' }}>{profile.city}, {profile.address}</p>

            <ImageSlider images={profile.images} />

            <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginTop: '2rem' }}>{profile.description}</p>

            {/* --- BOOKING SECTION --- */}
            <div className="host-details booking-section" style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
                <h3 style={{marginBottom: '1rem'}}>Book Your Experience</h3>
                
                <div className="booking-options" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    
                    {/* Date Picker */}
                    <div className="form-group" style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                        <label style={{fontWeight: 'bold'}}>Select Dates (Check-in / Check-out)</label>
                        <DayPicker
                          mode="range"
                          selected={range}
                          onSelect={setRange}
                          disabled={{ before: new Date() }}
                          footer={footer}
                        />
                    </div>

                    {/* Guest Count */}
                    <div className="form-group">
                        <label htmlFor="guestCount" style={{marginRight: '10px'}}>Number of Guests:</label>
                        <input type="number" id="guestCount" value={guestCount} min="1" onChange={(e) => setGuestCount(Number(e.target.value))} required style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '80px' }}/>
                    </div>

                    {/* Service Selection */}
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {profile.offersMeal && (
                            <div className="form-group-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="checkbox" id="bookMeal" checked={bookMeal} onChange={(e) => setBookMeal(e.target.checked)} style={{transform: 'scale(1.2)'}}/>
                                <label htmlFor="bookMeal"> Book Meal (₹{profile.mealPrice} / person)</label>
                            </div>
                        )}
                        {profile.offersStay && (
                            <div className="form-group-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="checkbox" id="bookStay" checked={bookStay} onChange={(e) => setBookStay(e.target.checked)} style={{transform: 'scale(1.2)'}}/>
                                <label htmlFor="bookStay"> Book Stay (₹{profile.stayPrice} / night)</label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Price & Actions */}
                {totalPrice > 0 && ( <h3 style={{ marginTop: '1.5rem', color: '#2ecc71' }}> Total Price: ₹{totalPrice} </h3> )}
                
                {bookingError && <p className="error-message" style={{color: 'red', marginTop: '10px'}}>{bookingError}</p>}
                {bookingSuccess && <p className="success-message" style={{color: 'green', marginTop: '10px', fontWeight: 'bold'}}>{bookingSuccess}</p>}
                
                <button className="cta-button" style={{ marginTop: '1.5rem', padding: '12px 24px', fontSize: '1rem' }} onClick={handleBookingSubmit} disabled={bookingLoading || totalPrice === 0}>
                    {bookingLoading ? 'Sending Request...' : 'Send Booking Request'}
                </button>
            </div>

            {/* --- REVIEWS SECTION --- */}
            <div className="reviews-section" style={{ marginTop: '3rem' }}>
                <h3>Reviews ({profile.numReviews})</h3>

                {/* ✨ AI Summary Box */}
                <div style={{ backgroundColor: '#f3f4f6', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ margin: 0, color: '#4f46e5', fontWeight: 'bold' }}>✨ AI Review Summary</h4>
                        {!summary && (
                            <button onClick={handleSummarize} disabled={aiLoading} 
                                style={{
                                    padding: '0.5rem 1rem', backgroundColor: aiLoading ? '#9ca3af' : '#4f46e5', color: 'white',
                                    border: 'none', borderRadius: '6px', cursor: aiLoading ? 'not-allowed' : 'pointer', fontWeight: '500'
                                }}>
                                {aiLoading ? "Analyzing..." : "Summarize Reviews"}
                            </button>
                        )}
                    </div>

                    {summary ? (
                        <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6', fontSize: '0.95rem', color: '#374151', background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                            {summary}
                        </div>
                    ) : (
                        !aiLoading && <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>Click button to see what people think about this host in short.</p>
                    )}
                </div>

                {/* Review List */}
                {reviewLoading && <p>Loading reviews...</p>}
                {!reviewLoading && reviews.length === 0 && <p>No reviews yet.</p>}
                
                <div className="reviews-list">
                    {reviews.map((review) => (
                        <div key={review._id} className="review-item" style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
                            <div style={{display:'flex', justifyContent:'space-between'}}>
                                <strong>{review.name}</strong>
                                <span style={{ fontSize: '0.8rem', color: '#777' }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p style={{ margin: '0.2rem 0', color: '#ffc107' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                            <p style={{ margin: '0.5rem 0 0 0' }}>{review.comment}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HostDetailsPage;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import ImageSlider from '../components/ImageSlider'; // Humara slider component
// // import StarRating from '../components/StarRating'; // Agar aapke paas hai

// // ... other imports
// // import ImageSlider from '../components/ImageSlider';

// // --- ADD THESE ---
// import { DayPicker } from 'react-day-picker';
// import 'react-day-picker/dist/style.css';
// import { format, differenceInDays } from 'date-fns';
// // ---------------




// function HostDetailsPage() {
//     const [profile, setProfile] = useState(null); // Host ki profile
//     const [loading, setLoading] = useState(true); // Main page loading
//     const [error, setError] = useState('');     // Main page error
//     const { id } = useParams();
//     const navigate = useNavigate();

//     // --- Booking Form States ---
//     const [bookMeal, setBookMeal] = useState(false);
//     const [bookStay, setBookStay] = useState(false);


//     // const [bookingDate, setBookingDate] = useState('');
//     // --- DATE PICKER STATE (Change Hua) ---
//     // 'bookingDate' ki jagah ab 'range' state hai
//     const [range, setRange] = useState(undefined);
//     // -------------------------------------


//     const [guestCount, setGuestCount] = useState(1);
//     // const [stayDuration, setStayDuration] = useState(1);
//     // stayDuration state hata diya, ab yeh range se calculate hoga
//     const [totalPrice, setTotalPrice] = useState(0);

//     // --- User Profile State ---
//     const [userProfile, setUserProfile] = useState(null);

//     // --- Booking Process States ---
//     const [bookingLoading, setBookingLoading] = useState(false);
//     const [bookingError, setBookingError] = useState('');
//     const [bookingSuccess, setBookingSuccess] = useState('');

//     // --- Review States ---
//     const [reviews, setReviews] = useState([]);
//     const [reviewLoading, setReviewLoading] = useState(false);
//     const [reviewError, setReviewError] = useState('');

//     // Effect 1: Fetch Host Profile AND Reviews
//     useEffect(() => {
//         const fetchHostData = async () => {
//             if (!id) return;
//             try {
//                 setLoading(true); // Main loading
//                 setReviewLoading(true); // Review loading
//                 setError('');
//                 setReviewError('');

//                 // Fetch host profile
//                 const hostPromise = axios.get(`http://localhost:5000/api/host/${id}`);
//                 // Fetch host reviews
//                 const reviewPromise = axios.get(`http://localhost:5000/api/hosts/${id}/reviews`);

//                 // Wait for both
//                 const [hostResponse, reviewResponse] = await Promise.all([
//                     hostPromise,
//                     reviewPromise,
//                 ]);

//                 setProfile(hostResponse.data);
//                 setReviews(reviewResponse.data);

//             } catch (err) {
//                 const message = err.response?.data?.message || 'Failed to fetch host data';
//                 setError(message);
//                 setReviewError(message); // Show error in review section too
//             } finally {
//                 setLoading(false);
//                 setReviewLoading(false);
//             }
//         };
//         fetchHostData();
//     }, [id]);

//     // Effect 2: Fetch Logged-in User Profile (for phone number check)
//     useEffect(() => {
//         const fetchUserProfile = async () => {
//             const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//             if (!userInfo) return;

//             try {
//                 const config = {
//                     headers: {
//                         Authorization: `Bearer ${userInfo.token}`,
//                         'Cache-Control': 'no-cache',
//                     },
//                 };
//                 const { data } = await axios.get('http://localhost:5000/api/users/profile', config);
//                 setUserProfile(data);
//             } catch (err) {
//                 console.error('Could not fetch user profile for booking check', err);
//             }
//         };
//         fetchUserProfile();
//     }, []); // Run once

//     // Effect 3: Calculate Total Price
// // src/pages/HostDetailsPage.jsx

//     // ... (Effect 1 aur Effect 2 waise hi rahenge) ...

//     // Effect 3: Total price calculate karne ke liye (Sahi Logic)
//     useEffect(() => {
//         if (profile) {
//             // 1. Raatein (nights) calculate karein
//             const nights = (range?.from && range?.to) ? differenceInDays(range.to, range.from) : 0;
            
//             // 2. Meal ka cost = Price * Guest Count
//             const mealCost = bookMeal ? (profile.mealPrice * guestCount  * nights) : 0;
            
//             // 3. Stay ka cost = Price * Night Count
//             // Check karein ki nights 0 se zyaada hain
//             const stayCost = (bookStay && nights > 0) ? (profile.stayPrice * nights) : 0;
            
//             setTotalPrice(mealCost + stayCost);
//         }
//     }, [bookMeal, bookStay, profile, guestCount, range]); // <-- Dependency ko 'range' mein badlein

//     // useEffect(() => {
//     //     if (profile) {
//     //         // const mealCost = bookMeal ? (profile.mealPrice * guestCount) : 0;
//     //         // const stayCost = bookStay ? (profile.stayPrice * stayDuration) : 0;

//     //         // Raatein (nights) calculate karein
//     //         const nights = (range?.from && range?.to) ? differenceInDays(range.to, range.from) : 0;
            
//     //         const mealCost = bookMeal ? (profile.mealPrice * guestCount) : 0;
//     //         const stayCost = bookStay && nights > 0 ? (profile.stayPrice * nights) : 0;


//     //         setTotalPrice(mealCost + stayCost);
//     //     }
//     // }, [bookMeal, bookStay, profile, guestCount, range
//     //     // stayDuration
//     //         ]);

//     // Booking Submit Handler


//     // Booking Submit Handler (SAHI LOGIC)
//     const handleBookingSubmit = async () => {
//         // Basic checks
//         if (!bookMeal && !bookStay) {
//             setBookingError('Please select at least one service (Meal or Stay).');
//             return;
//         }
//         if (!range || !range.from) {
//             setBookingError('Please select a check-in date.');
//             return;
//         }
//         if (bookStay && (!range.to)) {
//             setBookingError('Please select a check-out date for your stay.');
//             return;
//         }

//         const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//         if (!userInfo) {
//             navigate('/login?redirect=/host/' + id);
//             return;
//         }

//         // Phone number check (userProfile state se, jo pehle hi fetch ho chuka hai)
//         if (!userProfile || !userProfile.phoneNumber || userProfile.phoneNumber.trim() === '') {
//              setBookingError(<span>Please <Link to="/profile" style={{color: '#007bff'}}>add your phone number</Link> to your profile...</span>);
//              return;
//          }

//         setBookingLoading(true);
//         setBookingError('');
//         setBookingSuccess('');

//         try {
//             const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
            
//             const nights = (range?.from && range?.to) ? differenceInDays(range.to, range.from) : 0;

//             const bookingDetails = {
//                 // BUG FIX: hostId ko main 'profile' state se lein
//                 hostId: profile._id, 
//                 travelerName: userInfo.name,
//                 // BUG FIX: travelerContact ko 'userProfile' state se lein
//                 travelerContact: userProfile.phoneNumber, 
//                 checkInDate: range.from,
//                 checkOutDate: range.to,
//                 guestCount: Number(guestCount),
//                 stayDuration: bookStay ? nights : 0,
//                 bookedMeal: bookMeal,
//                 mealPrice: bookMeal ? profile.mealPrice : 0, // Base price bhejein
//                 bookedStay: bookStay,
//                 stayPrice: bookStay ? profile.stayPrice : 0, // Base price bhejein
//                 totalPrice: totalPrice, // Total calculated price bhejein
//             };

//             await axios.post('http://localhost:5000/api/bookings', bookingDetails, config);
            
//             setBookingLoading(false);
//             setBookingError('');
//             setBookingSuccess('Booking Request Sent! Check "My Bookings" for status.');

//         } catch (err) {
//             // BUG FIX: Sahi error message dikhayein
//             setBookingError(err.response?.data?.message || 'Booking request failed.');
//             setBookingSuccess('');
//             setBookingLoading(false);
//         }
//     };
//     // const handleBookingSubmit = async () => {
//     //     // Basic checks
//     //     if (!bookMeal && !bookStay) {
//     //         setBookingError('Please select at least one service (Meal or Stay).');
//     //         return;
//     //     }
//     //     // if (!bookingDate) {
//     //     //     setBookingError('Please select a date for your booking.');
//     //     //     return;
//     //     // }

//     //     // Naya Check: Check-in date zaroori hai
//     //     if (!range || !range.from) {
//     //         setBookingError('Please select a check-in date.');
//     //         return;
//     //     }
//     //     // Naya Check: Agar Stay book kar rahe hain, toh check-out bhi zaroori hai
//     //     if (bookStay && (!range.to)) {
//     //         setBookingError('Please select a check-out date for your stay.');
//     //         return;
//     //     }

//     //     const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//     //     if (!userInfo) {
//     //         navigate('/login?redirect=/host/' + id);
//     //         return;
//     //     }

//     //     // Check phone number using fetched userProfile state
//     //     if (!userProfile || !userProfile.phoneNumber || userProfile.phoneNumber.trim() === '') {
//     //          setBookingError(
//     //              <span>
//     //                  Please <Link to="/profile" style={{color: '#007bff', textDecoration: 'underline'}}>add your phone number</Link> to your profile before booking.
//     //              </span>
//     //          );
//     //          return;
//     //      }

//     //     setBookingLoading(true);
//     //     setBookingError('');
//     //     setBookingSuccess('');

//     //     try {
//     //         const config = {
//     //             headers: {
//     //                 'Content-Type': 'application/json',
//     //                 Authorization: `Bearer ${userInfo.token}`,
//     //             },
//     //         };

//     //         const bookingDetails = {
//     //             hostId: profile._id,
//     //             travelerName: userInfo.name,
//     //             travelerContact: userProfile.phoneNumber,
//     //             // bookingDate: bookingDate,

//     //             checkInDate: range.from, // Naya field
//     //             checkOutDate: range.to, // Naya field
//     //             // guestCount: Number(guestCount),
//     //             // stayDuration: bookStay ? Number(stayDuration) : 0,
//     //             // bookedMeal: bookMeal,
//     //             // mealPrice: bookMeal ? profile.mealPrice : 0,
//     //             // bookedStay: bookStay,
//     //             // stayPrice: bookStay ? profile.stayPrice : 0,
//     //             // totalPrice: totalPrice,

//     //             guestCount: Number(guestCount),
//     //             stayDuration: bookStay ? nights : 0, // Naya calculation
//     //             bookedMeal: bookMeal,
//     //             mealPrice: bookMeal ? (profile.mealPrice * guestCount) : 0, // Price ko guest se multiply kiya
//     //             bookedStay: bookStay,
//     //             stayPrice: bookStay ? (profile.stayPrice * nights) : 0, // Price ko raaton se multiply kiya
//     //             totalPrice: totalPrice,
//     //         };

//     //         await axios.post(
//     //             'http://localhost:5000/api/bookings',
//     //             bookingDetails,
//     //             config
//     //         );

//     //         setBookingLoading(false);
//     //         setBookingError('');
//     //         setBookingSuccess('Booking Request Sent! The host will contact you to confirm. Check "My Bookings" for status.');
//     //         // Optionally reset form fields
//     //         // setBookMeal(false); setBookStay(false); setBookingDate(''); etc.

//     //     } catch (err) {
//     //         setBookingError(err.response?.data?.message || 'Booking request failed.');
//     //         setBookingSuccess('');
//     //         setBookingLoading(false);
//     //     }
//     // };

//     // Render Logic
//     if (loading) {
//         return <div className="page-content"><h2>Loading Host Details...</h2></div>;
//     }
//     if (error) {
//         return <div className="page-content"><h2>{error}</h2></div>;
//     }
//     if (!profile) {
//         return <div className="page-content"><h2>Host not found.</h2></div>;
//     }
//     // --- DATE PICKER KE LIYE HELPER TEXT ---
//     let footer = <p>Please pick the first day.</p>;
//     if (range?.from && !range?.to) {
//       footer = <p>{format(range.from, 'PPP')} – Please pick the second day (check-out).</p>;
//     }
//     if (range?.from && range?.to) {
//       footer = <p>{format(range.from, 'PPP')} – {format(range.to, 'PPP')}</p>;
//     }
//     // ------------

//     return (
//         <div className="page-content">
//             <h2 style={{ marginBottom: '0.5rem' }}>{profile.kitchenName}</h2>
//             <p style={{ marginTop: 0, fontStyle: 'italic', color: '#555' }}>{profile.city}, {profile.address}</p>

//             <ImageSlider images={profile.images} />

//             <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginTop: '2rem' }}>{profile.description}</p>

//             {/* --- BOOKING SECTION --- */}
//             <div className="host-details booking-section" style={{ marginTop: '2rem', padding: '1.5rem', background: '#f9f9f9', borderRadius: '8px' }}>
//                 <h3>Book Your Experience</h3>
//                 <div className="booking-options">
//                     {/* Date Input */}


// {/* 
//                     <div className="form-group">
//                         <label htmlFor="bookingDate">Select Date:</label>
//                         <input type="date" id="bookingDate" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px' }}/>
//                     </div> */}
//                     {/* Date Input
//                   <div className="form-group">
//                     <label>Select Date:</label>
//                     {/* Display selected date or prompt */}
//                     {/* <p style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', background: 'white' }}>
//                       {bookingDate ? format(bookingDate, 'PPP') : 'Please pick a day'}
//                     </p>
//                     <DayPicker
//                       mode="single" // Allow selecting only one day
//                       selected={bookingDate}
//                       onSelect={setBookingDate} // Update the state when a day is clicked
//                       disabled={{ before: new Date() }} // Disable past dates
//                       styles={{
//                         caption: { color: '#ff9900' } // Example styling
//                       }}
//                     /> */}
//                   {/* </div> */} 


//                   {/* --- DATE PICKER (Poora badal gaya hai) --- */}
//                     <div className="form-group">
//                         <label>Select Dates (Check-in / Check-out)</label>
//                         <DayPicker
//                           mode="range" // <-- RANGE MODE
//                           selected={range}
//                           onSelect={setRange}
//                           disabled={{ before: new Date() }} // Puraani dates disable
//                           numberOfMonths={1} // 1 mahine ka calendar dikhayein
//                           footer={footer} // Helper text dikhayein
//                         />
//                     </div>
//                     {/* ------------------------------------- */}




//                     {/* Guest Count Input */}
//                     <div className="form-group">
//                         <label htmlFor="guestCount">Number of Guests:</label>
//                         <input type="number" id="guestCount" value={guestCount} min="1" onChange={(e) => setGuestCount(Number(e.target.value))} required style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '60px' }}/>
//                     </div>
//                     {/* Meal Option */}
//                     {profile.offersMeal && (
//                         <div className="form-group-checkbox">
//                             <input type="checkbox" id="bookMeal" checked={bookMeal} onChange={(e) => setBookMeal(e.target.checked)}/>
//                             <label htmlFor="bookMeal"> Book Meal (Price: ₹{profile.mealPrice} per person)</label>
//                         </div>
//                     )}
//                     {/* Stay Option */}
//                     {profile.offersStay && (
//                         <div className="form-group-checkbox">
//                             <input type="checkbox" id="bookStay" checked={bookStay} onChange={(e) => setBookStay(e.target.checked)}/>
//                             <label htmlFor="bookStay"> Book Stay (Price: ₹{profile.stayPrice} per night)</label>
//                             {/* Stay Option (stayDuration input hata diya) */}
//                             {/* {bookStay && (
//                                 <div className="form-group" style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
//                                     <label htmlFor="stayDuration" style={{ fontSize: '0.9rem' }}>Number of Nights:</label>
//                                     <input type="number" id="stayDuration" value={stayDuration} min="1" onChange={(e) => setStayDuration(Number(e.target.value))} required style={{ padding: '0.5rem', border: '1px solid #ccc', borderRadius: '4px', width: '60px' }}/>
//                                 </div>
//                             )} */}
//                         </div>
//                     )}
//                 </div>
//                 {/* Total Price Display */}
//                 {totalPrice > 0 && ( <h3 style={{ marginTop: '1.5rem' }}> Total Price: ₹{totalPrice} </h3> )}
//                 {/* Error/Success Messages */}
//                 {bookingError && <p className="error-message">{bookingError}</p>}
//                 {bookingSuccess && <p className="success-message">{bookingSuccess}</p>}
//                 {/* Submit Button */}
//                 <button className="cta-button" style={{ marginTop: '1rem' }} onClick={handleBookingSubmit} disabled={bookingLoading || totalPrice === 0}>
//                     {bookingLoading ? 'Sending Request...' : 'Send Booking Request'}
//                 </button>
//             </div>

//             {/* --- REVIEW SECTION --- */}
//             <div className="reviews-section" style={{ marginTop: '3rem' }}>
//                 <h3>Reviews ({profile.numReviews})</h3>
//                 {/* Optional: <StarRating rating={profile.rating} /> */}

//                 {reviewLoading && <p>Loading reviews...</p>}
//                 {reviewError && <p className="error-message">{reviewError}</p>}
//                 {!reviewLoading && !reviewError && (
//                     reviews.length === 0 ? (
//                         <p>No reviews yet.</p>
//                     ) : (
//                         <div className="reviews-list">
//                             {reviews.map((review) => (
//                                 <div key={review._id} className="review-item" style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
//                                     <strong>{review.name}</strong>
//                                     <p style={{ margin: '0.2rem 0', color: '#ffc107' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
//                                     <p style={{ margin: '0.5rem 0 0 0' }}>{review.comment}</p>
//                                     <p style={{ fontSize: '0.8rem', color: '#777', marginTop: '0.5rem' }}> Reviewed on: {new Date(review.createdAt).toLocaleDateString()} </p>
//                                 </div>
//                             ))}
//                         </div>
//                     )
//                 )}
//             </div>
//             {/* --- END REVIEW SECTION --- */}
//         </div>
//     );
// }

// export default HostDetailsPage;