import React, { useState, useEffect } from 'react';
import { getAdminServices, createService, updateService, deleteService } from 'utils/api';
import AdminLayout from '../../components/AdminLayout';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    icon: 'code',
    category: 'development',
    price: '',
    features: '',
    isActive: true,
    order: 0
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await getAdminServices();
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const data = {
        ...formData,
        features: formData.features.split('\n').filter(f => f.trim())
      };

      if (editingService) {
        await updateService(editingService._id, data);
        setMessage('Service updated successfully!');
      } else {
        await createService(data);
        setMessage('Service created successfully!');
      }

      setShowForm(false);
      setEditingService(null);
      resetForm();
      fetchServices();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving service');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      shortDescription: service.shortDescription || '',
      icon: service.icon || 'code',
      category: service.category || 'development',
      price: service.price || '',
      features: service.features?.join('\n') || '',
      isActive: service.isActive,
      order: service.order || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await deleteService(id);
        fetchServices();
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error deleting service');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      icon: 'code',
      category: 'development',
      price: '',
      features: '',
      isActive: true,
      order: 0
    });
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingService(null);
    resetForm();
  };

  if (loading) {
    return (
      <AdminLayout title="Services">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Services">
      <div className="admin-header">
        <h1>Manage Services</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add New Service
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {/* Service Form */}
      {showForm && (
        <div className="form-modal">
          <div className="form-modal-content">
            <div className="form-modal-header">
              <h2>{editingService ? 'Edit Service' : 'Add New Service'}</h2>
              <button className="close-btn" onClick={cancelEdit}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title">Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="icon">Icon</label>
                  <select id="icon" name="icon" value={formData.icon} onChange={handleChange}>
                    <option value="code">💻 Code</option>
                    <option value="design">🎨 Design</option>
                    <option value="cloud">☁️ Cloud</option>
                    <option value="security">🔒 Security</option>
                    <option value="data">📊 Data</option>
                    <option value="consulting">💡 Consulting</option>
                    <option value="mobile">📱 Mobile</option>
                    <option value="database">🗄️ Database</option>
                    <option value="api">🔗 API</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange}>
                  <option value="development">Development</option>
                  <option value="design">Design</option>
                  <option value="cloud">Cloud</option>
                  <option value="security">Security</option>
                  <option value="data">Data</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="shortDescription">Short Description</label>
                <input
                  type="text"
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  placeholder="Brief description for cards"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="price">Price</label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g., Starting from $500"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="order">Order</label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="features">Features (one per line)</label>
                <textarea
                  id="features"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                ></textarea>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  Active (visible on public site)
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : (editingService ? 'Update Service' : 'Create Service')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="admin-list">
        {services.map((service) => (
          <div key={service._id} className="admin-item">
            <div className="item-info">
              <h3>{service.title}</h3>
              <span className={`category-badge ${service.category}`}>
                {service.category}
              </span>
              <p>{service.shortDescription || service.description.substring(0, 100)}...</p>
            </div>
            <div className="item-status">
              <span className={`status-badge ${service.isActive ? 'active' : 'inactive'}`}>
                {service.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="item-actions">
              <button className="btn btn-secondary" onClick={() => handleEdit(service)}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(service._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}

        {services.length === 0 && (
          <div className="empty-state">
            <p>No services yet. Click "Add New Service" to create one.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminServices;
