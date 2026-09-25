// src/components/ReviewForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Rating } from 'react-simple-star-rating'; // Make sure this is imported

function ReviewForm({ hostId, bookingId, onReviewSubmit }) {
  const [rating, setRating] = useState(0); // Initial rating 0
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle rating change
  const handleRating = (rate) => {
    // 'rate' will now be like 0, 0.5, 1, 1.5, ... 5
    setRating(rate);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) {
      setError('Please provide both a rating (click stars) and a comment.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(
        `https://hidden-gems-backend-q048.onrender.com/api/hosts/${hostId}/reviews`,
        { rating, comment }, // Send the rating (can be float like 3.5)
        config
      );

      setLoading(false);
      onReviewSubmit(bookingId); // Notify parent

    } catch (err) {
       setError(err.response?.data?.message || 'Failed to submit review.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form" style={{ marginTop: '1rem', padding: '1rem', background: '#eee', borderRadius: '5px' }}>
      <h4>Write a Review</h4>
      {error && <p className="error-message" style={{color: 'red', fontSize: '0.9rem'}}>{error}</p>}
      
      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Your Rating:</label>
        <Rating
          onClick={handleRating}
          initialValue={rating} // Keep initialValue if needed, but ratingValue updates display
          size={35}
          fillColor='orange'
          emptyColor='lightgray'
          allowFraction={true} // <-- THIS IS THE CHANGE FOR HALF STARS ⭐
          transition
          ratingValue={rating} // Ensures display syncs with state
        />
      </div>

      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Comment:</label>
        <textarea
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          placeholder="Share your experience..."
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            border: '1px solid #ccc', 
            borderRadius: '4px', 
                        resize: 'both',

            // resize: 'vertical',
            // resize: 'horizontal',
            fontSize: '1rem' 
          }}
        />
      </div>
      
      <button type="submit" className="cta-button" disabled={loading} style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}

export default ReviewForm;