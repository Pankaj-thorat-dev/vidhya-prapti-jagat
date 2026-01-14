import React, { useEffect, useState } from 'react';
import { ordersAPI, Order } from '../api/orders';
import './ManageOrders.css';

const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Error loading orders. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredOrders = () => {
    if (filter === 'all') return orders;
    return orders.filter(order => order.status === filter);
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

  const filteredOrders = getFilteredOrders();
  const totalRevenue = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="manage-page">
      <div className="manage-header">
        <h1>Manage Orders</h1>
        <div className="order-stats">
          <div className="stat-item">
            <span className="stat-label">Total Orders:</span>
            <span className="stat-value">{orders.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Total Revenue:</span>
            <span className="stat-value">₹{totalRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="manage-container">
        <div className="filter-tabs">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All ({orders.length})
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed ({orders.filter(o => o.status === 'completed').length})
          </button>
          <button
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending ({orders.filter(o => o.status === 'pending').length})
          </button>
          <button
            className={filter === 'failed' ? 'active' : ''}
            onClick={() => setFilter('failed')}
          >
            Failed ({orders.filter(o => o.status === 'failed').length})
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="no-data">No orders found in this category.</div>
        ) : (
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Notes</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Payment ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order: any) => (
                  <tr key={order._id}>
                    <td className="order-id">{order._id.slice(-8).toUpperCase()}</td>
                    <td>
                      <div className="user-info">
                        <div>{order.userId?.name || 'N/A'}</div>
                        <div className="user-email">{order.userId?.email || 'N/A'}</div>
                      </div>
                    </td>
                    <td>
                      <div className="notes-list">
                        {order.notes.map((note: any, idx: number) => (
                          <div key={idx} className="note-item">
                            {note.noteId?.title || 'Unknown'}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="amount">₹{order.totalAmount}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td className="payment-id">
                      {order.razorpayPaymentId ? (
                        <span title={order.razorpayPaymentId}>
                          {order.razorpayPaymentId.slice(0, 12)}...
                        </span>
                      ) : (
                        <span className="no-payment">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;
