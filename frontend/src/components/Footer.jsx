import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <p>&copy; 2024 Федерация гонок дронов Республики Саха (Якутия)</p>
          <div className="social-links">
            <span>Социальные сети: </span>
            <a href="#" className="social-link">VK</a>
            <a href="#" className="social-link">Telegram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;