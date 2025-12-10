// src/pages/FindMealsPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ImageSlider from '../components/ImageSlider'; // Humara slider component

function FindMealsPage() {
  const [query, setQuery] = useState(''); // Search bar mein user kya type kar raha hai
  const [results, setResults] = useState([]); // Search ke baad mile hosts
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false); // Taki hum "No results" dikha sakein

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!query) {
      setError('Please enter a city name.');
      return;
    }
    
    setLoading(true);
    setError('');
    setHasSearched(true);
    setResults([]); // Puraane results saaf karo

    try {
      // Naye search API ko call karo
      const { data } = await axios.get(
        `http://localhost:5000/api/host/search?city=${query}`
      );
      setResults(data);

    } catch (err) {
      setError(err.response?.data?.message || 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <h2>Find Local Meals & Stays</h2>
      
      {/* --- SEARCH BAR --- */}
      <div className="search-bar-container" style={{ margin: '2rem 0', textAlign: 'center' }}>
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="search-box-input" // Navbar waali styling use kar sakte hain
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter city (e.g., Jamshedpur)"
            style={{ padding: '0.75rem', width: '300px', marginRight: '1rem', borderRadius: '20px', border: '1px solid #ddd' }}
          />
          <button type="submit" className="cta-button" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
        {error && <p className="error-message" style={{marginTop: '1rem'}}>{error}</p>}
      </div>

      {/* --- RESULTS SECTION --- */}
      <div className="search-results">
        {loading && <p style={{ textAlign: 'center' }}>Loading hosts...</p>}
        
        {!loading && hasSearched && results.length === 0 && (
          <p style={{ textAlign: 'center' }}>No hosts found in "{query}". Try another city!</p>
        )}
        
        {!loading && results.length > 0 && (
          <div className="spots-grid">
            {results.map(host => (
              <Link to={`/host/${host._id}`} key={host._id} className="spot-card-link">
                <div className="spot-card">
                  <ImageSlider images={host.images} />
                  <div className="spot-card-content">
                    <h3>{host.kitchenName}</h3>
                    <p><strong>{host.city}</strong></p>
                    <div className="host-offerings" style={{fontSize: '0.9rem', color: '#333'}}>
                      {host.offersMeal && <span>✓ Meal (₹{host.mealPrice})</span>}
                      <br/>
                      {host.offersStay && <span>✓ Stay (₹{host.stayPrice})</span>}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
              
        {!loading && !hasSearched && (
           <p style={{ textAlign: 'center' }}>Please enter a city to find available hosts.</p>
        )}
      </div>
    </div>
  );
}

export default FindMealsPage; 