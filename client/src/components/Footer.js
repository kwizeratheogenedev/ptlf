import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Portfolio</h3>
          <p>Professional IT services and solutions for your business needs.</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/achievements">Achievements</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div className="footer-section">
          <h4>Services</h4>
          <Link to="/services">Web Development</Link>
          <Link to="/services">Cloud Solutions</Link>
          <Link to="/services">Consulting</Link>
          <Link to="/services">Security</Link>
        </div>

        <div className="footer-section">
          <h4>Contact</h4>
          <p>Email: contact@example.com</p>
          <p>Phone: +1 234 567 890</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} IT Portfolio. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
