import React, { useEffect, useState } from 'react';
import { ordersAPI, Order } from '../api/orders';
import { notesAPI } from '../api/notes';
import './ManageOrders.css';

const MyOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getMyOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Error loading orders. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (noteId: string, fileName: string) => {
    try {
      setDownloading(noteId);
      const blob = await notesAPI.download(noteId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'note.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Download error:', error);
      alert(error.response?.data?.message || 'Error downloading file. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClass = status === 'completed' ? 'status-completed' : 
                       status === 'pending' ? 'status-pending' : 'status-failed';
    return <span className={`status-badge ${statusClass}`}>{status.toUpperCase()}</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="manage-page">
      <div className="manage-header">
        <h1>My Orders</h1>
        <p>View your purchase history and download notes</p>
      </div>

      <div className="manage-container">
        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="no-data">
            <p>No orders found. Start shopping!</p>
            <a href="/shop" className="btn-primary">Browse Notes</a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="order-summary">
                    <div className="order-total">₹{order.totalAmount}</div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                <div className="order-notes">
                  <h4>Notes ({order.notes.length})</h4>
                  {order.notes.map((noteItem, index) => (
                    <div key={index} className="order-note-item">
                      <div className="note-info">
                        <span className="note-title">{noteItem.noteId.title}</span>
                        <span className="note-price">₹{noteItem.price}</span>
                      </div>
                      {order.status === 'completed' && (
                        <button
                          onClick={() => handleDownload(noteItem.noteId._id, noteItem.noteId.fileName)}
                          className="btn-download"
                          disabled={downloading === noteItem.noteId._id}
                        >
                          {downloading === noteItem.noteId._id ? 'Downloading...' : '📥 Download'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {order.status === 'pending' && (
                  <div className="order-pending-message">
                    ⏳ Payment pending. Please complete the payment to download notes.
                  </div>
                )}

                {order.status === 'failed' && (
                  <div className="order-failed-message">
                    ❌ Payment failed. Please try again or contact support.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
