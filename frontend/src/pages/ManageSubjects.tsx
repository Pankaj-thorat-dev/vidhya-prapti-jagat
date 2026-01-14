import React, { useEffect, useState } from 'react';
import { subjectsAPI, Subject } from '../api/subjects';
import { boardsAPI, Board } from '../api/boards';
import { streamsAPI, Stream } from '../api/streams';
import './ManageBoards.css';

const ManageSubjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', streamId: '' });
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedStream, setSelectedStream] = useState('');

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    if (selectedBoard) {
      fetchStreams(selectedBoard);
    }
  }, [selectedBoard]);

  useEffect(() => {
    if (selectedStream) {
      fetchSubjects(selectedStream);
    }
  }, [selectedStream]);

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
      const response = await streamsAPI.getByBoard(boardId);
      setStreams(response.data || []);
      if (response.data && response.data.length > 0) {
        setSelectedStream(response.data[0]._id);
      } else {
        setSelectedStream('');
        setSubjects([]);
      }
    } catch (error) {
      console.error('Error fetching streams:', error);
    }
  };

  const fetchSubjects = async (streamId: string) => {
    try {
      setLoading(true);
      const response = await subjectsAPI.getByStream(streamId);
      setSubjects(response.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await subjectsAPI.update(editingId, formData);
      } else {
        await subjectsAPI.create(formData);
      }
      setFormData({ name: '', description: '', streamId: '' });
      setShowForm(false);
      setEditingId(null);
      if (selectedStream) fetchSubjects(selectedStream);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving subject');
    }
  };

  const handleEdit = (subject: Subject) => {
    setFormData({
      name: subject.name,
      description: subject.description,
      streamId: subject.streamId
    });
    setEditingId(subject._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      try {
        await subjectsAPI.delete(id);
        if (selectedStream) fetchSubjects(selectedStream);
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error deleting subject');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', description: '', streamId: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const getStreamName = (streamId: string) => {
    const stream = streams.find(s => s._id === streamId);
    return stream?.name || 'Unknown';
  };

  return (
    <div className="manage-page">
      <div className="manage-header">
        <h1>Manage Subjects</h1>
        <button onClick={() => setShowForm(true)} className="btn-add" disabled={!selectedStream}>
          + Add Subject
        </button>
      </div>

      <div className="filter-section">
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div>
            <label>Board:</label>
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
          <div>
            <label>Stream:</label>
            <select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="board-filter"
              disabled={!selectedBoard || streams.length === 0}
            >
              <option value="">Select Stream</option>
              {streams.map(stream => (
                <option key={stream._id} value={stream._id}>{stream.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Subject' : 'Add New Subject'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Board</label>
                <select
                  value={selectedBoard}
                  onChange={(e) => {
                    setSelectedBoard(e.target.value);
                    setFormData({ ...formData, streamId: '' });
                  }}
                  required
                >
                  {boards.map(board => (
                    <option key={board._id} value={board._id}>{board.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Stream</label>
                <select
                  value={formData.streamId}
                  onChange={(e) => setFormData({ ...formData, streamId: e.target.value })}
                  required
                  disabled={!selectedBoard || streams.length === 0}
                >
                  <option value="">Select Stream</option>
                  {streams.map(stream => (
                    <option key={stream._id} value={stream._id}>{stream.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Subject Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., Mathematics, Physics, Chemistry"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  placeholder="Brief description of the subject"
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
        {!selectedStream ? (
          <div className="no-data">Please select a board and stream to view subjects</div>
        ) : loading ? (
          <div className="loading">Loading...</div>
        ) : subjects.length === 0 ? (
          <div className="no-data">No subjects found for this stream. Add your first subject!</div>
        ) : (
          <div className="items-grid">
            {subjects.map((subject) => (
              <div key={subject._id} className="item-card">
                <div className="item-badge">{getStreamName(subject.streamId)}</div>
                <h3>{subject.name}</h3>
                <p>{subject.description}</p>
                <div className="item-actions">
                  <button onClick={() => handleEdit(subject)} className="btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(subject._id)} className="btn-delete">
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

export default ManageSubjects;
