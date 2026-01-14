import React, { useEffect, useState } from 'react';
import { boardsAPI, Board } from '../api/boards';
import './ManageBoards.css';

const ManageBoards: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await boardsAPI.getAll();
      setBoards(response.data || []);
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await boardsAPI.update(editingId, formData);
      } else {
        await boardsAPI.create(formData);
      }
      setFormData({ name: '', description: '' });
      setShowForm(false);
      setEditingId(null);
      fetchBoards();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving board');
    }
  };

  const handleEdit = (board: Board) => {
    setFormData({ name: board.name, description: board.description });
    setEditingId(board._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this board?')) {
      try {
        await boardsAPI.delete(id);
        fetchBoards();
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error deleting board');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '' });
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="manage-page">
      <div className="manage-header">
        <h1>Manage Boards</h1>
        <button onClick={() => setShowForm(true)} className="btn-add">
          + Add Board
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Board' : 'Add New Board'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Board Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., CBSE, ICSE"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  placeholder="Brief description of the board"
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={handleCancel} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="manage-container">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : boards.length === 0 ? (
          <div className="no-data">No boards found. Add your first board!</div>
        ) : (
          <div className="items-grid">
            {boards.map((board) => (
              <div key={board._id} className="item-card">
                <h3>{board.name}</h3>
                <p>{board.description}</p>
                <div className="item-actions">
                  <button onClick={() => handleEdit(board)} className="btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(board._id)} className="btn-delete">
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

export default ManageBoards;
