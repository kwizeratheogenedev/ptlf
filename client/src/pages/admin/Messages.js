import React, { useState, useEffect } from 'react';
import { getMessages, deleteMessage, markMessageAsRead } from 'utils/api';
import AdminLayout from '../../components/AdminLayout';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await getMessages();
      setMessages(res.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = async (msg) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      try {
        await markMessageAsRead(msg._id);
        msg.isRead = true;
        setMessages([...messages]);
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(id);
        setMessages(messages.filter(m => m._id !== id));
        if (selectedMessage?._id === id) {
          setSelectedMessage(null);
        }
      } catch (error) {
        setMessage(error.response?.data?.message || 'Error deleting message');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <AdminLayout title="Messages">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Messages">
      <div className="admin-header">
        <h1>Messages</h1>
        <p>Total: {messages.length} | Unread: {messages.filter(m => !m.isRead).length}</p>
      </div>

      {message && (
        <div className={`alert ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <div className="messages-container">
        {/* Messages List */}
        <div className="messages-list">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`message-item ${msg.isRead ? 'read' : 'unread'} ${selectedMessage?._id === msg._id ? 'selected' : ''}`}
              onClick={() => handleViewMessage(msg)}
            >
              <div className="message-header">
                <span className="sender-name">{msg.name}</span>
                <span className="message-date">{formatDate(msg.createdAt)}</span>
              </div>
              <div className="message-subject">{msg.subject}</div>
              <div className="message-preview">{msg.message.substring(0, 60)}...</div>
              {!msg.isRead && <span className="unread-badge">New</span>}
            </div>
          ))}

          {messages.length === 0 && (
            <div className="empty-state">
              <p>No messages yet.</p>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="message-detail">
          {selectedMessage ? (
            <>
              <div className="detail-header">
                <h2>{selectedMessage.subject}</h2>
                <div className="detail-meta">
                  <span>From: <strong>{selectedMessage.name}</strong></span>
                  <span>Email: {selectedMessage.email}</span>
                  {selectedMessage.phone && <span>Phone: {selectedMessage.phone}</span>}
                  <span>Date: {formatDate(selectedMessage.createdAt)}</span>
                </div>
              </div>
              <div className="detail-body">
                <p>{selectedMessage.message}</p>
              </div>
              <div className="detail-actions">
                <a href={`mailto:${selectedMessage.email}`} className="btn btn-primary">
                  Reply
                </a>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(selectedMessage._id)}
                >
                  Delete
                </button>
              </div>
            </>
          ) : (
            <div className="no-selection">
              <p>Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
