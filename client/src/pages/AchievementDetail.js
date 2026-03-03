import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAchievement } from '../utils/api';

const AchievementDetail = () => {
  const { id } = useParams();
  const [achievement, setAchievement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        const res = await getAchievement(id);
        setAchievement(res.data);
      } catch (error) {
        setError('Achievement not found');
      } finally {
        setLoading(false);
      }
    };

    fetchAchievement();
  }, [id]);

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

  if (error || !achievement) {
    return (
      <div className="error-container">
        <h2>{error || 'Achievement not found'}</h2>
        <Link to="/achievements" className="btn btn-primary">Back to Achievements</Link>
      </div>
    );
  }

  return (
    <div className="achievement-detail-page">
      <Link to="/achievements" className="back-link">
        ← Back to Achievements
      </Link>

      <div className="achievement-detail">
        <div className="detail-header">
          <div className="detail-icon">
            <span>{getCategoryIcon(achievement.category)}</span>
          </div>
          <div className="detail-title">
            <h1>{achievement.title}</h1>
            <span className={`category-badge ${achievement.category}`}>
              {achievement.category}
            </span>
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-section">
            <h3>Description</h3>
            <p>{achievement.description}</p>
          </div>

          <div className="detail-meta">
            {achievement.issuer && (
              <div className="meta-item">
                <h4>Issued by</h4>
                <p>{achievement.issuer}</p>
              </div>
            )}

            {achievement.issueDate && (
              <div className="meta-item">
                <h4>Date</h4>
                <p>{new Date(achievement.issueDate).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          <div className="detail-actions">
            {achievement.documentUrl && (
              <a
                href={`http://localhost:5000${achievement.documentUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                View Document
              </a>
            )}

            {achievement.link && (
              <a
                href={achievement.link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                View Details
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementDetail;
