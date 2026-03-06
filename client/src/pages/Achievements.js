import React, { useState, useEffect } from 'react';

import { getAchievements } from '../utils/api';

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const res = await getAchievements();
        setAchievements(res.data);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  const categories = ['all', ...new Set(achievements.map(a => a.category))];

  const filteredAchievements = filter === 'all'
    ? achievements
    : achievements.filter(a => a.category === filter);

  const getCategoryIcon = (category) => {
    const icons = {
      certification: '📜',
      award: '🏆',
      project: '🚀',
      education: '🎓',
      experience: '💼',
      other: '⭐'
    };
    return icons[category] || icons.other;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="achievements-page">
      <div className="page-header">
        <h1>Achievements & Certifications</h1>
        <p>My professional milestones and accomplishments</p>
      </div>

      {/* Filter Buttons */}
      <div className="filter-container">
        {categories.map((category) => (
          <button
            key={category}
            className={`filter-btn ${filter === category ? 'active' : ''}`}
            onClick={() => setFilter(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="achievements-list">
        {filteredAchievements.map((achievement) => (
          <div key={achievement._id} className="achievement-detail-card">
            <div className="achievement-detail-icon">
              <span>{getCategoryIcon(achievement.category)}</span>
            </div>
            <div className="achievement-detail-content">
              <h3>{achievement.title}</h3>
              <span className={`category-badge ${achievement.category}`}>
                {achievement.category}
              </span>
              <p className="achievement-description">{achievement.description}</p>
              
              <div className="achievement-meta">
                {achievement.issuer && (
                  <span className="meta-item">
                    <strong>Issued by:</strong> {achievement.issuer}
                  </span>
                )}
                {achievement.issueDate && (
                  <span className="meta-item">
                    <strong>Date:</strong> {new Date(achievement.issueDate).toLocaleDateString()}
                  </span>
                )}
              </div>

              <div className="achievement-actions">
                {achievement.documentUrl && (
                  <a
                    href={`http://localhost:5000${achievement.documentUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                  >
                    View Document
                  </a>
                )}
                {achievement.link && (
                  <a
                    href={achievement.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                  >
                    View Details
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAchievements.length === 0 && (
        <div className="no-achievements">
          <p>No achievements found in this category.</p>
        </div>
      )}
    </div>
  );
};

export default Achievements;
