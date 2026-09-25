// // import React, { useState } from 'react';
// // import axios from 'axios';
// // import { useNavigate, Link } from 'react-router-dom';

// // function LoginPage() {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
  
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(false);
  
// //   const navigate = useNavigate();

// //   const handleSubmit = async (event) => {
// //     event.preventDefault();
// //     setError('');
// //     setLoading(true);

// //     try {
// //       const config = {
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //       };

// //       const { data } = await axios.post(
// //         'https://hidden-gems-backend-q048.onrender.com/api/users/login',
// //         { email, password },
// //         config
// //       );

// //       // Login hone ke baad user ki info ko localStorage mein save karein
// //       localStorage.setItem('userInfo', JSON.stringify(data));
// //       setLoading(false);
// //       navigate('/'); // Login hote hi homepage par bhej dein

// //     } catch (err) {
// //       setError(err.response?.data?.message || 'Login failed');
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="form-container">
// //       <h2>Login</h2>
// //       {error && <p className="error-message">{error}</p>}
// //       <form onSubmit={handleSubmit}>
// //         <div className="form-group">
// //           <label>Email</label>
// //           <input
// //             type="email"
// //             value={email}
// //             onChange={(e) => setEmail(e.target.value)}
// //             required
// //           />
// //         </div>
// //         <div className="form-group">
// //           <label>Password</label>
// //           <input
// //             type="password"
// //             value={password}
// //             onChange={(e) => setPassword(e.target.value)}
// //             required

            
// //             autoComplete="current-password" // <-- Yeh add karein

// //           />
// //         </div>
// //         <button type="submit" className="cta-button" disabled={loading}>
// //           {loading ? 'Logging in...' : 'Login'}
// //         </button>
// //       </form>
// //       <p style={{ marginTop: '1rem' }}>
// //         New user? <Link to="/register">Register here</Link>
// //       </p>
// //     </div>
// //   );
// // }
// // export default LoginPage;

// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate, Link } from 'react-router-dom';

// function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
  
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const navigate = useNavigate();

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const config = {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       };

//       const { data } = await axios.post(
//         'https://hidden-gems-backend-q048.onrender.com/api/users/login',
//         { email, password },
//         config
//       );

//       // Login hone ke baad user ki info ko localStorage mein save karein
//       localStorage.setItem('userInfo', JSON.stringify(data));
//       setLoading(false);
      
//       // ✅ SUCCESS: Login hote hi Homepage par bhej do
//       navigate('/'); 

//     } catch (err) {
//       setError(err.response?.data?.message || 'Login failed');
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Login</h2>
//       {error && <p className="error-message">{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>Email</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label>Password</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             autoComplete="current-password"
//           />

//           <p style={{ marginTop: '0.5rem', textAlign: 'right' }}>
//   <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: '#007bff' }}>
//     Forgot Password?
//   </Link>
// </p>


//         </div>
//         <button type="submit" className="cta-button" disabled={loading}>
//           {loading ? 'Logging in...' : 'Login'}
//         </button>
//       </form>
//       <p style={{ marginTop: '1rem' }}>
//         New user? <Link to="/register">Register here</Link>
//       </p>
//     </div>
//   );
// }

// export default LoginPage;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        'https://hidden-gems-backend-q048.onrender.com/api/users/login',
        { email, password },
        config
      );

      // Login hone ke baad user ki info ko localStorage mein save karein
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);

      // ✅ SUCCESS: Login hote hi Homepage par bhej do
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {/* Forgot Password link — password field ke bahar, form ke andar */}
        <p style={{ marginTop: '-0.5rem', marginBottom: '1rem', textAlign: 'right' }}>
          <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: '#007bff' }}>
            Forgot Password?
          </Link>
        </p>

        <button type="submit" className="cta-button" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: '1rem' }}>
        New user? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default LoginPage;