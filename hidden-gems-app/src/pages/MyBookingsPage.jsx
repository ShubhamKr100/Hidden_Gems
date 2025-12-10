// src/pages/MyBookingsPage.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm'; // <-- Import the new component

function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // --- NEW: State to track which booking's review form is open ---
  const [showReviewFormFor, setShowReviewFormFor] = useState(null); // Stores booking ID
  // --- NEW: State to track which bookings have been reviewed ---
  const [reviewedBookings, setReviewedBookings] = useState(new Set()); // Stores IDs

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      if (!userInfo) {
        setError('Please log in to see your bookings.');
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Cache-Control': 'no-cache',
        },
      };

      const { data } = await axios.get(
        'http://localhost:5000/api/bookings/mybookings',
        config
      );
      setBookings(data);
      setLoading(false);

      // TODO: Check if user has already reviewed these hosts
      // This requires fetching user's reviews or adding a flag to booking

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  // --- NEW: Function called by ReviewForm on successful submission ---
  const handleReviewSubmitted = (bookingId) => {
    setShowReviewFormFor(null); // Close the form
    setReviewedBookings(prev => new Set(prev).add(bookingId)); // Mark as reviewed
    // Optionally: Refresh bookings or update UI immediately
    alert('Thank you for your review!');
  };

  if (loading) {
    return <div className="page-content"><h2>Loading Your Bookings...</h2></div>;
  }

  if (error) {
    return <div className="page-content"><h2>{error}</h2></div>;
  }

  return (
    <div className="page-content">
      <h2>My Bookings</h2>
      
      {bookings.length === 0 ? (
        <p>You have no bookings yet. <Link to="/meals">Find a meal or stay!</Link></p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div className="service-card booking-card" key={booking._id} style={{ marginBottom: '1.5rem', borderLeft: `5px solid ${booking.status === 'Pending' ? 'orange' : booking.status === 'Confirmed' ? 'green' : 'red'}` }}>
              
              <h3>{booking.host?.kitchenName || 'Host Name Unavailable'}</h3>
              <p><strong>Location:</strong> {booking.host?.city || 'N/A'}</p>
              
              <ul style={{ paddingLeft: '20px', margin: '1rem 0' }}>
                {booking.bookedMeal && (<li>Booked Meal (Price: ₹{booking.mealPrice})</li>)}
                {booking.bookedStay && (<li>Booked Stay (Price: ₹{booking.stayPrice} for {booking.stayDuration} night{booking.stayDuration > 1 ? 's' : ''})</li>)}
              </ul>
              
              <p><strong>Total Price: ₹{booking.totalPrice}</strong></p>
              
              <p>
                <strong>Status:</strong>
                <span style={{ fontWeight: 'bold', color: booking.status === 'Pending' ? 'orange' : booking.status === 'Confirmed' ? 'green' : 'red' }}>
                  {` ${booking.status}`}
                </span>
                {/* Optional messages */}
                {booking.status === 'Pending' && <span style={{fontSize: '0.9rem', color: '#777'}}> (Awaiting host confirmation)</span>}
                {booking.status === 'Confirmed' && <span style={{fontSize: '0.9rem', color: 'green'}}> (Confirmed!)</span>}
                {booking.status === 'Cancelled' && <span style={{fontSize: '0.9rem', color: 'red'}}> (Cancelled by host)</span>}
              </p>

              <p style={{fontSize: '0.8rem', color: '#777'}}>Requested On: {new Date(booking.createdAt).toLocaleString()}</p>

              {/* --- NEW: Review Button and Form Logic --- */}
              {booking.status === 'Confirmed' && !reviewedBookings.has(booking._id) && (
                 // Only show button if confirmed and not already reviewed (basic check)
                 <div>
                   {showReviewFormFor !== booking._id && (
                     <button
                       className="cta-button"
                       onClick={() => setShowReviewFormFor(booking._id)} // Open form for this booking
                       style={{ marginTop: '1rem', backgroundColor: '#ff9900' }} // Orange color
                     >
                       Leave a Review
                     </button>
                   )}
                   
                   {showReviewFormFor === booking._id && (
                     <ReviewForm 
                       hostId={booking.host._id} // Pass host ID to the form
                       bookingId={booking._id}   // Pass booking ID to track submission
                       onReviewSubmit={handleReviewSubmitted} // Callback on success
                     />
                   )}
                 </div>
              )}
               {booking.status === 'Confirmed' && reviewedBookings.has(booking._id) && (
                 <p style={{ marginTop: '1rem', color: 'green', fontStyle: 'italic' }}>✓ Review Submitted</p>
               )}
              {/* --- END: Review Button and Form Logic --- */}

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookingsPage;      