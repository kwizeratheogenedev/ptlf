import React, { useState, useEffect } from 'react';
import { getServices } from '../utils/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await getServices();
        setServices(res.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const categories = ['all', ...new Set(services.map(s => s.category))];

  const filteredServices = filter === 'all'
    ? services
    : services.filter(s => s.category === filter);

  const getIconComponent = (icon) => {
    const icons = {
      code: '💻',
      design: '🎨',
      cloud: '☁️',
      security: '🔒',
      data: '📊',
      consulting: '💡',
      mobile: '📱',
      database: '🗄️',
      api: '🔗',
      default: '⚙️'
    };
    return icons[icon] || icons.default;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="services-page">
      <div className="page-header">
        <h1>My Services</h1>
        <p>Professional IT solutions tailored to your needs</p>
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

      {/* Services Grid */}
      <div className="services-list">
        {filteredServices.map((service) => (
          <div key={service._id} className="service-detail-card">
            <div className="service-detail-icon">
              <span>{getIconComponent(service.icon)}</span>
            </div>
            <div className="service-detail-content">
              <h3>{service.title}</h3>
              <span className={`category-badge ${service.category}`}>
                {service.category}
              </span>
              <p className="service-description">{service.description}</p>
              
              {service.features && service.features.length > 0 && (
                <ul className="service-features">
                  {service.features.map((feature, index) => (
                    <li key={index}>
                      <i className="check-icon">✓</i>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              
              {service.price && (
                <div className="service-price">
                  <span className="price-label">Starting from:</span>
                  <span className="price-value">{service.price}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="no-services">
          <p>No services found in this category.</p>
        </div>
      )}

      {/* CTA Section */}
      <div className="services-cta">
        <h2>Don't See What You Need?</h2>
        <p>I'm always open to discussing custom projects and unique requirements.</p>
        <a href="/contact" className="btn btn-primary">Let's Talk</a>
      </div>
    </div>
  );
};

export default Services;
