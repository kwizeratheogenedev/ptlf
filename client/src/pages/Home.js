import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile, getServices, getAchievements } from '../utils/api';

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, servicesRes, achievementsRes] = await Promise.all([
          getProfile(),
          getServices(),
          getAchievements()
        ]);
        setProfile(profileRes.data);
        setServices(Array.isArray(servicesRes.data) ? servicesRes.data : []);
        setAchievements(Array.isArray(achievementsRes.data) ? achievementsRes.data.slice(0, 3) : []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Hi, I'm <span className="highlight">{profile?.name || 'IT Professional'}</span>
            </h1>
            <h2 className="hero-subtitle">{profile?.title || 'Software Engineer'}</h2>
            <p className="hero-description">
              {profile?.bio || 'Passionate about creating innovative solutions and delivering high-quality IT services that drive business growth.'}
            </p>
            <div className="hero-buttons">
              <Link to="/services" className="btn btn-primary">View Services</Link>
              <Link to="/contact" className="btn btn-secondary">Contact Me</Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="profile-image-container">
              {profile?.profileImage ? (
                <img
                  src={`http://localhost:5000${profile.profileImage}`}
                  alt={profile.name}
                  className="profile-image"
                />
              ) : (
                <div className="profile-placeholder">
                  <span>{profile?.name?.charAt(0) || 'P'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      {profile?.skills && profile.skills.length > 0 && (
        <section className="skills-section">
          <h2 className="section-title">Skills & Technologies</h2>
          <div className="skills-container">
            {profile.skills.map((skill, index) => (
              <span key={index} className="skill-tag">{skill}</span>
            ))}
          </div>
        </section>
      )}

      {/* Services Preview */}
      <section className="services-preview">
        <div className="section-header">
          <h2 className="section-title">My Services</h2>
          <Link to="/services" className="view-all-link">View All Services →</Link>
        </div>
        <div className="services-grid">
          {services.slice(0, 3).map((service) => (
            <div key={service._id} className="service-card">
              <div className="service-icon">
                <i className={`icon-${service.icon}`}></i>
              </div>
              <h3>{service.title}</h3>
              <p>{service.shortDescription || service.description.substring(0, 100)}</p>
              <Link to="/services" className="service-link">Learn More</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements Preview */}
      <section className="achievements-preview">
        <div className="section-header">
          <h2 className="section-title">Recent Achievements</h2>
          <Link to="/achievements" className="view-all-link">View All →</Link>
        </div>
        <div className="achievements-grid">
          {achievements.map((achievement) => (
            <div key={achievement._id} className="achievement-card">
              <div className="achievement-icon">
                <i className={`icon-${achievement.category}`}></i>
              </div>
              <h3>{achievement.title}</h3>
              <p>{achievement.description.substring(0, 100)}...</p>
              <span className={`category-badge ${achievement.category}`}>
                {achievement.category}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Start Your Project?</h2>
        <p>Let's work together to bring your ideas to life.</p>
        <Link to="/contact" className="btn btn-primary">Get In Touch</Link>
      </section>
    </div>
  );
};

export default Home;
