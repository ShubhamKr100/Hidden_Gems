import React from 'react';

function AppDownload() {
  return (
    <section className="app-download-section">
      <p className="footer-title">For a Better Experience</p>
      <h3 className="footer-heading">Download the Hidden Gems App</h3>
      <div className="store-buttons">
        <a href="https://play.google.com" target="_blank" rel="noopener noreferrer">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png" 
            alt="Get it on Google Play" 
          />
        </a>
        <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png" 
            alt="Download on the App Store" 
          />
        </a>
      </div>
    </section>
  );
}

export default AppDownload;