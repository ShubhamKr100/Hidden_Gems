import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
 
function ResetPasswordPage() {
  const { token } = useParams(); // URL se token nikaalne ke liye
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data } = await axios.put(`http://localhost:5000/api/users/resetpassword/${token}`, { password });
      setSuccess(data.message);
      setLoading(false);

      // 2 second baad automatic Login page pe bhej do
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired token');
      setLoading(false);
    }
  };

  return (
    <div className="form-container page-content" style={{ maxWidth: '450px', margin: '40px auto' }}>
      <h2>Set New Password</h2>
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
      {success && <p className="success-message" style={{ color: 'green', fontWeight: 'bold' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>New Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="Enter new password"
            autoComplete="new-password"
          />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            placeholder="Confirm new password"
            autoComplete="new-password"
          />
        </div>
        <button type="submit" className="cta-button" disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
          {loading ? 'Updating Password...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}
export default ResetPasswordPage;
