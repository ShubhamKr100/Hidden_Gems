// // src/pages/MyProfilePage.jsx

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function MyProfilePage() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
  
//   const navigate = useNavigate();

//   // Kadam 1: Page load hote hi user ki puraani details fetch karo
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const userInfo = JSON.parse(localStorage.getItem('userInfo'));
//         if (!userInfo) {
//           navigate('/login');
//           return;
//         }

//         const config = {
//           headers: {
//             Authorization: `Bearer ${userInfo.token}`,
//           },
//         };

//         const { data } = await axios.get(
//           'https://hidden-gems-backend-q048.onrender.com/api/users/profile',
//           config
//         );

//         // Form ko puraane data se bharo
//         setName(data.name);
//         setEmail(data.email);
//         setPhoneNumber(data.phoneNumber || ''); // Agar phone number nahi hai toh khaali string
        
//         setLoading(false);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch profile');
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, [navigate]);

//   // Kadam 2: Form submit hone par profile update karo
//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

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
//         name,
//         email,
//         phoneNumber, // Phone number ko update mein bhejo
//         password, // Agar password khaali hai toh backend use ignore kar dega
//       };

//       // Naye PUT route ko call karo
//       const { data } = await axios.put(
//         'https://hidden-gems-backend-q048.onrender.com/api/users/profile',
//         updatedData,
//         config
//       );

//       setSubmitting(false);
//       setSuccess('Profile updated successfully!');
      
//       // Sabse zaroori: localStorage ko nayi info se update karo
//       localStorage.setItem('userInfo', JSON.stringify(data));
      
//       // Password fields ko khaali kar do
//       setPassword('');
//       setConfirmPassword('');

//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update profile');
//       setSubmitting(false);
//     }
//   };

//   if (loading) {
//     return <div className="page-content"><h2>Loading Profile...</h2></div>;
//   }

//   return (
//     <div className="form-container page-content">
//       <h2>My Profile</h2>
      
//       {error && <p className="error-message">{error}</p>}
//       {success && <p className="success-message">{success}</p>}
      
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Name</label>
//           <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
//         </div>
//         <div className="form-group">
//           <label>Email</label>
//           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
//         </div>
        
//         {/* --- YEH NAYA FIELD HAI --- */}
//         <div className="form-group">
//           <label>Phone Number</label>
//           <input 
//             type="tel" 
//             value={phoneNumber} 
//             onChange={(e) => setPhoneNumber(e.target.value)} 
//             placeholder="Your contact number for hosts"
//           />
//         </div>
//         {/* ------------------------- */}

//         <hr />
//         <p>Update Password (leave blank to keep the same)</p>
//         <div className="form-group">
//           <label>New Password</label>
//           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
//         </div>
//         <div className="form-group">
//           <label>Confirm New Password</label>
//           <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
//         </div>
        
//         <button type="submit" className="cta-button" disabled={submitting}>
//           {submitting ? 'Saving...' : 'Update Profile'}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default MyProfilePage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const navigate = useNavigate();

  // Page load hote hi user ki puraani details fetch karo
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
          navigate('/login');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const { data } = await axios.get(
          'https://hidden-gems-backend-q048.onrender.com/api/users/profile',
          config
        );

        // Form ko puraane data se bharo
        setName(data.name);
        setEmail(data.email);
        setPhoneNumber(data.phoneNumber || '');
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  // Form submit hone par profile update karo
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

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
        name,
        email,
        phoneNumber,
        password,
      };

      const { data } = await axios.put(
        'https://hidden-gems-backend-q048.onrender.com/api/users/profile',
        updatedData,
        config
      );

      setSubmitting(false);
      setSuccess('Profile updated successfully! Redirecting...');
      
      // Sabse zaroori: localStorage ko nayi info se update karo
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      setPassword('');
      setConfirmPassword('');

      // ✅ SUCCESS: 1.2 seconds baad automatic Homepage par bhej do
      setTimeout(() => {
        navigate('/');
      }, 1200);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="page-content"><h2>Loading Profile...</h2></div>;
  }

  return (
    <div className="form-container page-content">
      <h2>My Profile</h2>
      
      {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
      {success && <p className="success-message" style={{ color: 'green', fontWeight: 'bold' }}>{success}</p>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        
        <div className="form-group">
          <label>Phone Number</label>
          <input 
            type="tel" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            placeholder="Your contact number for hosts"
          />
        </div>

        <hr style={{ margin: '1.5rem 0' }} />
        <p style={{ marginBottom: '1rem', color: '#666' }}>Update Password (leave blank to keep the same)</p>
        
        <div className="form-group">
          <label>New Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        </div>
        <div className="form-group">
          <label>Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
        </div>
        
        <button type="submit" className="cta-button" disabled={submitting}>
          {submitting ? 'Saving...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}

export default MyProfilePage;