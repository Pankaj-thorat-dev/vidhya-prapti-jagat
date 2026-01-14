import React, { useEffect, useState } from 'react';
import { contactAPI, ContactMessage } from '../api/contact';
import './ManageBoards.css';

const ManageContacts: React.FC = () => {
  const [contacts, setContacts] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactAPI.getAll();
      setContacts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      alert('Error loading contact messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      try {
        await contactAPI.delete(id);
        alert('Message deleted successfully!');
        fetchContacts();
        setSelectedMessage(null);
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error deleting message');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="manage-page">
      <div className="manage-header">
        <h1>Contact Messages</h1>
        <p>View and manage customer inquiries</p>
      </div>

      {selectedMessage && (
        <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Message Details</h2>
            <div className="message-details">
              <div className="detail-row">
                <strong>From:</strong>
                <span>{selectedMessage.name}</span>
              </div>
              <div className="detail-row">
                <strong>Email:</strong>
                <span>
                  <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
                </span>
              </div>
              <div className="detail-row">
                <strong>Subject:</strong>
                <span>{selectedMessage.subject}</span>
              </div>
              <div className="detail-row">
                <strong>Date:</strong>
                <span>{formatDate(selectedMessage.createdAt)}</span>
              </div>
              <div className="detail-row message-content">
                <strong>Message:</strong>
                <p>{selectedMessage.message}</p>
              </div>
            </div>
            <div className="form-actions">
              <button
                onClick={() => setSelectedMessage(null)}
                className="btn-cancel"
              >
                Close
              </button>
              <button
                onClick={() => handleDelete(selectedMessage._id)}
                className="btn-delete"
              >
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="manage-container">
        {loading ? (
          <div className="loading">Loading messages...</div>
        ) : contacts.length === 0 ? (
          <div className="no-data">No contact messages yet</div>
        ) : (
          <div className="contacts-list">
            {contacts.map((contact) => (
              <div key={contact._id} className="contact-card">
                <div className="contact-header-info">
                  <div className="contact-from">
                    <strong>{contact.name}</strong>
                    <span className="contact-email">{contact.email}</span>
                  </div>
                  <span className="contact-date">{formatDate(contact.createdAt)}</span>
                </div>
                <div className="contact-subject">
                  <strong>Subject:</strong> {contact.subject}
                </div>
                <div className="contact-message-preview">
                  {contact.message.length > 150
                    ? `${contact.message.substring(0, 150)}...`
                    : contact.message}
                </div>
                <div className="contact-actions">
                  <button
                    onClick={() => setSelectedMessage(contact)}
                    className="btn-view"
                  >
                    View Full Message
                  </button>
                  <button
                    onClick={() => handleDelete(contact._id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageContacts;
