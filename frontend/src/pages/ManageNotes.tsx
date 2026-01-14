import React, { useEffect, useState } from 'react';
import { notesAPI, Note } from '../api/notes';
import { boardsAPI, Board } from '../api/boards';
import { streamsAPI, Stream } from '../api/streams';
import { subjectsAPI, Subject } from '../api/subjects';
import './ManageBoards.css';

const ManageNotes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    pages: '',
    boardId: '',
    streamId: '',
    subjectId: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchBoards();
    fetchNotes();
  }, []);

  useEffect(() => {
    if (formData.boardId) {
      fetchStreams(formData.boardId);
    }
  }, [formData.boardId]);

  useEffect(() => {
    if (formData.streamId) {
      fetchSubjects(formData.streamId);
    }
  }, [formData.streamId]);

  const fetchBoards = async () => {
    try {
      const response = await boardsAPI.getAll();
      setBoards(response.data || []);
    } catch (error) {
      console.error('Error fetching boards:', error);
    }
  };

  const fetchStreams = async (boardId: string) => {
    try {
      const response = await streamsAPI.getByBoard(boardId);
      setStreams(response.data || []);
    } catch (error) {
      console.error('Error fetching streams:', error);
    }
  };

  const fetchSubjects = async (streamId: string) => {
    try {
      const response = await subjectsAPI.getByStream(streamId);
      setSubjects(response.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await notesAPI.getAll();
      setNotes(response.data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subjectId) {
      alert('Please select a subject');
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('pages', formData.pages);
      data.append('subjectId', formData.subjectId);
      
      if (file) {
        data.append('file', file);
      }

      if (imageFile) {
        data.append('image', imageFile);
      }

      if (editingId) {
        await notesAPI.update(editingId, data);
        alert('Note updated successfully!');
      } else {
        await notesAPI.create(data);
        alert('Note created successfully!');
      }
      
      setFormData({ 
        title: '', 
        description: '', 
        price: '', 
        pages: '', 
        boardId: '', 
        streamId: '', 
        subjectId: '' 
      });
      setFile(null);
      setImageFile(null);
      setShowForm(false);
      setEditingId(null);
      fetchNotes();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error saving note');
    }
  };

  const handleEdit = (note: Note) => {
    setFormData({
      title: note.title,
      description: note.description,
      price: note.price.toString(),
      pages: note.pages.toString(),
      boardId: note.boardId,
      streamId: note.streamId,
      subjectId: note.subjectId,
    });
    setEditingId(note._id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await notesAPI.delete(id);
        alert('Note deleted successfully!');
        fetchNotes();
      } catch (error: any) {
        alert(error.response?.data?.message || 'Error deleting note');
      }
    }
  };

  const handleCancel = () => {
    setFormData({ 
      title: '', 
      description: '', 
      price: '', 
      pages: '', 
      boardId: '', 
      streamId: '', 
      subjectId: '' 
    });
    setFile(null);
    setImageFile(null);
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="manage-page">
      <div className="manage-header">
        <h1>Manage Notes</h1>
        <button onClick={() => setShowForm(true)} className="btn-add">
          + Add Note
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? 'Edit Note' : 'Add New Note'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Note title"
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  placeholder="Brief description"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    placeholder="Price in rupees"
                  />
                </div>

                <div className="form-group">
                  <label>Pages *</label>
                  <input
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                    required
                    min="1"
                    placeholder="Number of pages"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Board *</label>
                <select
                  value={formData.boardId}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    boardId: e.target.value, 
                    streamId: '', 
                    subjectId: '' 
                  })}
                  required
                >
                  <option value="">Select Board</option>
                  {boards.map(board => (
                    <option key={board._id} value={board._id}>{board.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Stream *</label>
                <select
                  value={formData.streamId}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    streamId: e.target.value, 
                    subjectId: '' 
                  })}
                  required
                  disabled={!formData.boardId}
                >
                  <option value="">Select Stream</option>
                  {streams.map(stream => (
                    <option key={stream._id} value={stream._id}>{stream.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <select
                  value={formData.subjectId}
                  onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                  required
                  disabled={!formData.streamId}
                >
                  <option value="">Select Subject</option>
                  {subjects.map(subject => (
                    <option key={subject._id} value={subject._id}>{subject.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>PDF File {editingId && '(Leave empty to keep existing file)'}</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required={!editingId}
                />
              </div>

              <div className="form-group">
                <label>Note Image (Optional) {editingId && '(Leave empty to keep existing image)'}</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                <small style={{ color: '#666', fontSize: '0.85rem' }}>
                  Recommended: JPG, PNG, or WebP. Will be displayed on note card.
                </small>
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
        ) : notes.length === 0 ? (
          <div className="no-data">No notes found. Add your first note!</div>
        ) : (
          <div className="items-grid">
            {notes.map((note) => (
              <div key={note._id} className="item-card">
                <div className="note-badges">
                  <span className="badge badge-board">{note.board}</span>
                  <span className="badge badge-stream">{note.stream}</span>
                  <span className="badge badge-subject">{note.subject}</span>
                </div>
                <h3>{note.title}</h3>
                <p>{note.description}</p>
                <div className="note-meta">
                  <span className="note-price">₹{note.price}</span>
                  <span className="note-pages">📄 {note.pages} pages</span>
                </div>
                <div className="item-actions">
                  <button onClick={() => handleEdit(note)} className="btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(note._id)} className="btn-delete">
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

export default ManageNotes;
