import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await axios.post('https://hidden-gems-backend-q048.onrender.com/api/users/forgotpassword', { email });
      setSuccess(data.message);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="form-container page-content" style={{ maxWidth: '450px', margin: '40px auto' }}>
      <h2>Forgot Password</h2>
      <p style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
        Enter your registered email address and we will send you a link to reset your password.
      </p>

      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
      {success && <p className="success-message" style={{ color: 'green', fontWeight: 'bold' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="Enter your email"
          />
        </div>
        <button type="submit" className="cta-button" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
          {loading ? 'Sending Link...' : 'Send Reset Link'}
        </button>
      </form>

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>Back to Login</Link>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;