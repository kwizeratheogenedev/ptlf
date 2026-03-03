import React, { useState, useEffect } from 'react';
import { getAchievements, createAchievement, updateAchievement, deleteAchievement } from 'utils/api';
import AdminLayout from '../../components/AdminLayout';

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'certification',
    issuer: '',
    issueDate: '',
    link: '',
    isFeatured: false,
    order: 0
  });
  const [document, setDocument] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAchievements();
  }, []);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      if (document) {
        data.append('document', document);
      }

      if (editingAchievement) {
        await updateAchievement(editingAchievement._id, data);
        setMessage('Achievement updated successfully!');
      } else {
        await createAchievement(data);
        setMessage('Achievement created successfully!');
      }

      setShowForm(false);
      setEditingAchievement(null);
      resetForm();
      fetchAchievements();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving achievement');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (achievement) => {
    setEditingAchievement(achievement);
    setFormData({
      title: achievement.title,
      description: achievement.description,
      category: achievement.category || 'certification',
      issuer: achievement.issuer || '',
      issueDate: achievement.issueDate ? achievement.issueDate.split('T')[0] : '',
      link: achievement.link || '',
      isFeatured: achievement.isFeatured || false,
      order: achievement.order || 0
    });
    setDocument(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        await deleteAchievement(id);
        fetchAchievements();
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error deleting achievement');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'certification',
      issuer: '',
      issueDate: '',
      link: '',
      isFeatured: false,
      order: 0
    });
    setDocument(null);
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingAchievement(null);
    resetForm();
  };

  if (loading) {
    return (
      <AdminLayout title="Achievements">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Achievements">
      <div className="admin-header">
        <h1>Manage Achievements</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add New Achievement
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {/* Achievement Form */}
      {showForm && (
        <div className="form-modal">
          <div className="form-modal-content">
            <div className="form-modal-header">
              <h2>{editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}</h2>
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
                  <label htmlFor="category">Category</label>
                  <select id="category" name="category" value={formData.category} onChange={handleChange}>
                    <option value="certification">Certification</option>
                    <option value="award">Award</option>
                    <option value="project">Project</option>
                    <option value="education">Education</option>
                    <option value="experience">Experience</option>
                    <option value="other">Other</option>
                  </select>
                </div>
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

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="issuer">Issuer / Organization</label>
                  <input
                    type="text"
                    id="issuer"
                    name="issuer"
                    value={formData.issuer}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="issueDate">Issue Date</label>
                  <input
                    type="date"
                    id="issueDate"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="link">External Link</label>
                  <input
                    type="url"
                    id="link"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    placeholder="https://example.com"
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
                <label htmlFor="document">Document (PDF, Image)</label>
                <input
                  type="file"
                  id="document"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                {editingAchievement?.documentName && (
                  <p className="file-info">Current file: {editingAchievement.documentName}</p>
                )}
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                  />
                  Featured (highlighted on site)
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : (editingAchievement ? 'Update Achievement' : 'Create Achievement')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Achievements List */}
      <div className="admin-list">
        {achievements.map((achievement) => (
          <div key={achievement._id} className="admin-item">
            <div className="item-info">
              <h3>
                {achievement.title}
                {achievement.isFeatured && <span className="featured-badge">★ Featured</span>}
              </h3>
              <span className={`category-badge ${achievement.category}`}>
                {achievement.category}
              </span>
              <p>{achievement.description.substring(0, 100)}...</p>
              {achievement.issuer && <small>Issued by: {achievement.issuer}</small>}
            </div>
            <div className="item-actions">
              {achievement.documentUrl && (
                <a
                  href={`http://localhost:5000${achievement.documentUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  View Doc
                </a>
              )}
              <button className="btn btn-secondary" onClick={() => handleEdit(achievement)}>
                Edit
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(achievement._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}

        {achievements.length === 0 && (
          <div className="empty-state">
            <p>No achievements yet. Click "Add New Achievement" to create one.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAchievements;
