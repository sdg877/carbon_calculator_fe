import React from 'react';
import "../styles/footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {currentYear} Carbon Calculator. All rights reserved.</p>
        <div className="footer-links">
          <p>Built with Next.js & Python</p>
          <span> | </span>
          <a href="https://github.com/sdg877" target="_blank" rel="noopener noreferrer">
            View Source
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;