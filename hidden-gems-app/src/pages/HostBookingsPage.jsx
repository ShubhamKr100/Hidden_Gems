import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function HostBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch bookings
  const fetchHostBookings = async () => {
    try {
      setLoading(true);
      setError('');
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

      // Fetch bookings for the host
      const { data } = await axios.get(
        'http://localhost:5000/api/bookings/host',
        config
      );

      setBookings(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings');
      setLoading(false);
    }
  };

  // Fetch bookings when the component mounts
  useEffect(() => {
    fetchHostBookings();
  }, []);

  // Function to handle updating booking status (Confirm/Cancel)
  const handleStatusUpdate = async (bookingId, newStatus) => {
    // Optional: Add a confirmation dialog
    if (!window.confirm(`Are you sure you want to ${newStatus === 'Confirmed' ? 'confirm' : 'cancel'} this booking?`)) {
      return;
    }

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Send PUT request to update status
      await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        { status: newStatus }, // Send the new status in the body
        config
      );

      // Refresh the bookings list after successful update
      fetchHostBookings();

    } catch (err) {
      alert(`Failed to update status: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) {
    return <div className="page-content"><h2>Loading Booking Requests...</h2></div>;
  }

  if (error) {
    return <div className="page-content"><h2>{error}</h2></div>;
  }

  return (
    <div className="page-content">
      <h2>Your Booking Requests</h2>

      {bookings.length === 0 ? (
        <p>You have no booking requests yet.</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div className="service-card booking-card" key={booking._id} style={{ marginBottom: '1.5rem', borderLeft: `5px solid ${booking.status === 'Pending' ? 'orange' : booking.status === 'Confirmed' ? 'green' : 'red'}` }}>
              {/* Populate gives us user details */}
              <h3>Booking from: {booking.user.name}</h3>
              <p><strong>Contact:</strong> {booking.user.phoneNumber || 'Not Provided'} | {booking.user.email}</p>


              <p><strong>Date Requested:</strong> {new Date(booking.checkInDate).toLocaleDateString()}</p>

              
              <p><strong>Guests:</strong> {booking.guestCount}</p>

              <ul style={{ paddingLeft: '20px', margin: '1rem 0' }}>
                {booking.bookedMeal && (
                  <li>Booked Meal
                     {/* (₹{booking.mealPrice}) */}
                  </li>
                )}
                {booking.bookedStay && (
                  <li>Booked Stay 
                    (
                      {/* ₹{booking.stayPrice}  */}
                    for {booking.stayDuration} night{booking.stayDuration > 1 ? 's' : ''})</li>
                )}
              </ul>

              <p><strong>Total Price: ₹{booking.totalPrice}</strong></p>
              <p>
                <strong>Status:</strong>
                <span style={{ fontWeight: 'bold', color: booking.status === 'Pending' ? 'orange' : booking.status === 'Confirmed' ? 'green' : 'red' }}>
                  {` ${booking.status}`}
                </span>
              </p>
              <p style={{fontSize: '0.8rem', color: '#777'}}>
                Requested On: {new Date(booking.createdAt).toLocaleString()}
              </p>

              {/* Action Buttons only for Pending requests */}
              {booking.status === 'Pending' && (
                <div className="booking-actions" style={{ marginTop: '1rem' }}>
                  <button
                    className="cta-button"
                    onClick={() => handleStatusUpdate(booking._id, 'Confirmed')}
                    style={{ marginRight: '1rem', backgroundColor: '#28a745' }} // Green color
                  >
                    Confirm
                  </button>
                  <button
                    className="cta-button"
                    onClick={() => handleStatusUpdate(booking._id, 'Cancelled')}
                    style={{ backgroundColor: '#dc3545' }} // Red color
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HostBookingsPage;