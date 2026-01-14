import React, { useEffect, useState } from 'react';
import { streamsAPI, Stream } from '../api/streams';
import { boardsAPI, Board } from '../api/boards';
import './ManageBoards.css';

const ManageStreams: React.FC = () => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', boardId: '' });
  const [selectedBoard, setSelectedBoard] = useState('');

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    if (selectedBoard) {
      fetchStreams(selectedBoard);
    }
  }, [selectedBoard]);

  const fetchBoards = async () => {
    try {
      const response = await boardsAPI.getAll();
      setBoards(response.data || []);
      if (response.data && response.data.length > 0) {
        setSelectedBoard(response.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  const fetchStreams = async (boardId: string) => {
    try {
      setLoading(true);
      const response = await streamsAPI.getByBoard(boardId);
      setStreams(response.data || []);
    } catch (error) {
      console.error('Error fetching streams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await streamsAPI.update(editingId, formData);
      } else {
        await streamsAPI.create(formData);
      }
      setFormData({ name: '', description: '', boardId: '' });
      setShowForm(false);
      setEditingId(null);
      if (selectedBoard) fetchStreams(selectedBoard);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving stream');
    }
  };

  const handleEdit = (stream: Stream) => {
    setFormData({ 
      name: stream.name, 
      description: stream.description,
      boardId: stream.boardId 
    });
    setEditingId(stream._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this stream?')) {
      try {
        await streamsAPI.delete(id);
        if (selectedBoard) fetchStreams(selectedBoard);
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error deleting stream');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '', boardId: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const getBoardName = (boardId: string) => {
    const board = boards.find(b => b._id === boardId);
    return board?.name || 'Unknown';
  };

  return (
    <div className="manage-page">
      <div className="manage-header">
        <h1>Manage Streams</h1>
        <button onClick={() => setShowForm(true)} className="btn-add">
          + Add Stream
        </button>
      </div>

      <div className="filter-section">
        <label>Filter by Board:</label>
        <select 
          value={selectedBoard} 
          onChange={(e) => setSelectedBoard(e.target.value)}
          className="board-filter"
        >
          {boards.map(board => (
            <option key={board._id} value={board._id}>{board.name}</option>
          ))}
        </select>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Stream' : 'Add New Stream'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Board</label>
                <select
                  value={formData.boardId}
                  onChange={(e) => setFormData({ ...formData, boardId: e.target.value })}
                  required
                >
                  <option value="">Select Board</option>
                  {boards.map(board => (
                    <option key={board._id} value={board._id}>{board.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Stream Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Science, Commerce, Arts"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  placeholder="Brief description of the stream"
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
        ) : streams.length === 0 ? (
          <div className="no-data">No streams found for this board. Add your first stream!</div>
        ) : (
          <div className="items-grid">
            {streams.map((stream) => (
              <div key={stream._id} className="item-card">
                <div className="item-badge">{getBoardName(stream.boardId)}</div>
                <h3>{stream.name}</h3>
                <p>{stream.description}</p>
                <div className="item-actions">
                  <button onClick={() => handleEdit(stream)} className="btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(stream._id)} className="btn-delete">
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

export default ManageStreams;
