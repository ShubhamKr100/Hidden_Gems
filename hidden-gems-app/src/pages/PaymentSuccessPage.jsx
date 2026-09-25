import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

function PaymentSuccessPage() {
  const { id } = useParams(); // Booking ID
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const markAsPaid = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        // Backend ko batao ki payment success ho gaya aur DB update karo
        await axios.put(`https://hidden-gems-backend-q048.onrender.com/api/bookings/${id}/pay`, {}, config);
        
        setLoading(false);
        // 3 second baad automatic My Bookings page pe bhej do
        setTimeout(() => {
          navigate('/my-bookings'); // Ya jo bhi aapke bookings page ka route hai
        }, 3000);

      } catch (err) {
        setError('Failed to update payment status in database.');
        setLoading(false);
      }
    };

    if (id) {
      markAsPaid();
    }
  }, [id, navigate]);

  return (
    <div className="page-content" style={{ textAlign: 'center', marginTop: '50px' }}>
      {loading ? (
        <h2>Verifying your payment with Stripe... ⏳</h2>
      ) : error ? (
        <h2 style={{ color: 'red' }}>{error}</h2>
      ) : (
        <div style={{ background: '#e8f5e9', padding: '40px', borderRadius: '12px', display: 'inline-block', border: '1px solid #4caf50' }}>
          <h1 style={{ color: '#2e7d32', fontSize: '3rem', margin: 0 }}>🎉</h1>
          <h2 style={{ color: '#2e7d32' }}>Payment Successful!</h2>
          <p>Your booking is fully confirmed and paid.</p>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>Redirecting to your bookings in 3 seconds...</p>
          <Link to="/my-bookings" className="cta-button" style={{ marginTop: '15px', display: 'inline-block' }}>
            Go to My Bookings Now
          </Link>
        </div>
      )}
    </div>
  );
}

export default PaymentSuccessPage;