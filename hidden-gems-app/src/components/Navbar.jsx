import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { api } from '../api';

function Navbar() {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [pendingBookingCount, setPendingBookingCount] = useState(0);

  useEffect(() => {
    const fetchPendingCount = async () => {
      if (userInfo && userInfo.role === 'host' && userInfo.token) {
        try {
          const { data } = await api.get('/bookings/host/pending-count');
          setPendingBookingCount(data.count);
        } catch (error) {
          console.error("Could not fetch pending booking count:", error);
          setPendingBookingCount(0);
        }
      } else {
        setPendingBookingCount(0);
      }
    };

    fetchPendingCount();
  }, [userInfo]);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setPendingBookingCount(0);
    navigate('/login');
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          <span className="logo-first-part">Hidden</span>
          <span className="logo-second-part">Gems</span>
        </Link>
      </div>

      <nav className="header-center">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Home
        </NavLink>
        <NavLink to="/meals" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Find Meals
        </NavLink>

        {userInfo && (
          <NavLink to="/my-bookings" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            My Bookings
          </NavLink>
        )}

        {userInfo && userInfo.role === 'host' && (
          <>
            <NavLink to="/my-kitchen" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
              My Kitchen
            </NavLink>
            <NavLink
              to="/host/bookings"
              className={({ isActive }) => (isActive ? 'nav-link active host-bookings-link' : 'nav-link host-bookings-link')}
            >
              Host Bookings
              {pendingBookingCount > 0 && (
                <span className="notification-badge">{pendingBookingCount}</span>
              )}
            </NavLink>
          </>
        )}

        {userInfo && userInfo.role === 'traveler' && (
          <NavLink to="/become-host" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Become a Host
          </NavLink>
        )}
      </nav>

      <div className="header-right">
        <div className="search-box">
          <input type="text" placeholder="Search spots..." />
          <FaSearch className="search-icon" />
        </div>

        <div className="auth-links">
          {userInfo ? (
            <>
              <Link to="/profile" className="nav-username">
                Hello, {userInfo.name.split(' ')[0]}
              </Link>
              <button onClick={logoutHandler} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link-button">Login</Link>
              <Link to="/register" className="nav-link-button register-btn">Register</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

// import React, { useState, useEffect } from 'react';
// import { NavLink, Link, useNavigate } from 'react-router-dom';
// import { FaSearch } from 'react-icons/fa';
// import axios from 'axios'; // Import axios

// function Navbar() {
//   const navigate = useNavigate();
//   const userInfo = JSON.parse(localStorage.getItem('userInfo'));

//   // --- NEW: State for pending booking count ---
//   const [pendingBookingCount, setPendingBookingCount] = useState(0);

//   // --- NEW: Effect to fetch pending count for hosts ---
//   useEffect(() => {
//     const fetchPendingCount = async () => {
//       // Only fetch if user is logged in and is a host
//       if (userInfo && userInfo.role === 'host' && userInfo.token) {
//         try {
//           const config = {
//             headers: {
//               Authorization: `Bearer ${userInfo.token}`,
//             },
//           };
//           const { data } = await axios.get(
//             'https://hidden-gems-backend-q048.onrender.com/api/bookings/host/pending-count',
//             config
//           );
//           setPendingBookingCount(data.count);
//         } catch (error) {
//           console.error("Could not fetch pending booking count:", error);
//           // Handle error appropriately, maybe set count to 0 or show a message
//           setPendingBookingCount(0);
//         }
//       } else {
//         // If not a host or not logged in, reset count
//         setPendingBookingCount(0);
//       }
//     };

//     fetchPendingCount();

//     // Optional: Add a timer to refetch count periodically
//     // const intervalId = setInterval(fetchPendingCount, 60000); // Fetch every 60 seconds
//     // return () => clearInterval(intervalId); // Cleanup interval on component unmount

//   }, [userInfo]); // Re-run effect if userInfo changes (login/logout)


//   const logoutHandler = () => {
//     localStorage.removeItem('userInfo');
//     setPendingBookingCount(0); // Reset count on logout
//     navigate('/login');
//     window.location.reload();
//   };

//   return (
//     <header className="header">
//       {/* Left Section: Logo */}
//       <div className="header-left">
//         <Link to="/" className="logo">
//           <span className="logo-first-part">Hidden</span>
//           <span className="logo-second-part">Gems</span>
//         </Link>
//       </div>

//       {/* Center Section: Navigation Links */}
//       <nav className="header-center">
//         <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
//           Home
//         </NavLink>
//         <NavLink to="/meals" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
//           Find Meals
//         </NavLink>
        
//         {userInfo && (
//           <NavLink to="/mybookings" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
//             My Bookings
//           </NavLink>
//         )}
        
//         {userInfo && userInfo.role === 'host' && (
//           <>
//             <NavLink to="/my-kitchen" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
//               My Kitchen
//             </NavLink>
//             {/* --- NEW: Host Bookings Link with Notification --- */}
//             <NavLink 
//               to="/host/bookings" // <-- New URL for host bookings page
//               className={({ isActive }) => (isActive ? 'nav-link active host-bookings-link' : 'nav-link host-bookings-link')}
//             >
//               Host Bookings
//               {pendingBookingCount > 0 && (
//                 <span className="notification-badge">{pendingBookingCount}</span>
//               )}
//             </NavLink>
//           </>
//         )}
        
//         {userInfo && userInfo.role === 'traveler' && (
//           <NavLink to="/become-host" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
//             Become a Host
//           </NavLink>
//         )}
//       </nav>

//       {/* Right Section: Search and Auth */}
//       <div className="header-right">
//         <div className="search-box">
//           <input type="text" placeholder="Search spots..." />
//           <FaSearch className="search-icon" />
//         </div>
        
//         <div className="auth-links">
//           {userInfo ? (
//             <>
//               <Link to="/profile" className="nav-username">
//                  Hello, {userInfo.name.split(' ')[0]}
//               </Link>
//               <button onClick={logoutHandler} className="logout-btn">
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="nav-link-button">Login</Link>
//               <Link to="/register" className="nav-link-button register-btn">Register</Link>
//             </>
//           )}
//         </div>
//       </div>
//     </header>
//   );
// }

// export default Navbar;