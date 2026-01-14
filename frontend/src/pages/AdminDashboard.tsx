import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI, AdminStats } from '../api/orders';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAdminStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your notes selling platform</p>
      </div>

      <div className="admin-container">
        {loading ? (
          <div className="loading">Loading statistics...</div>
        ) : stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-info">
                <h3>{stats.totalUsers}</h3>
                <p>Total Users</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-info">
                <h3>{stats.totalNotes}</h3>
                <p>Total Notes</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🛒</div>
              <div className="stat-info">
                <h3>{stats.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-info">
                <h3>{stats.completedOrders}</h3>
                <p>Completed Orders</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <h3>{stats.pendingOrders}</h3>
                <p>Pending Orders</p>
              </div>
            </div>

            <div className="stat-card stat-revenue">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>₹{stats.totalRevenue.toLocaleString('en-IN')}</h3>
                <p>Total Revenue</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📧</div>
              <div className="stat-info">
                <h3>{stats.totalContacts}</h3>
                <p>Contact Messages</p>
              </div>
            </div>
          </div>
        )}

        <div className="dashboard-grid">
          <Link to="/admin/boards" className="dashboard-card">
            <div className="card-icon">📚</div>
            <h3>Manage Boards</h3>
            <p>Add, edit, or remove educational boards</p>
          </Link>

          <Link to="/admin/streams" className="dashboard-card">
            <div className="card-icon">🎓</div>
            <h3>Manage Streams</h3>
            <p>Organize streams for each board</p>
          </Link>

          <Link to="/admin/subjects" className="dashboard-card">
            <div className="card-icon">📖</div>
            <h3>Manage Subjects</h3>
            <p>Add subjects for each stream</p>
          </Link>

          <Link to="/admin/notes" className="dashboard-card">
            <div className="card-icon">📝</div>
            <h3>Manage Notes</h3>
            <p>Upload and manage study notes</p>
          </Link>

          <Link to="/admin/orders" className="dashboard-card">
            <div className="card-icon">🛒</div>
            <h3>Manage Orders</h3>
            <p>View and track all orders</p>
          </Link>

          <Link to="/admin/contacts" className="dashboard-card">
            <div className="card-icon">📧</div>
            <h3>Contact Messages</h3>
            <p>View customer inquiries and messages</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
