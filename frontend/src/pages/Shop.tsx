import React, { useEffect, useState } from 'react';
import { notesAPI, Note } from '../api/notes';
import { boardsAPI, Board } from '../api/boards';
import { streamsAPI, Stream } from '../api/streams';
import { subjectsAPI, Subject } from '../api/subjects';
import { ordersAPI } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Shop.css';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Shop: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [boards, setBoards] = useState<Board[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBoard, setSelectedBoard] = useState('');
  const [selectedStream, setSelectedStream] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<string[]>([]);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    fetchAllData();
    loadRazorpayScript();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [notes, selectedBoard, selectedStream, selectedSubject, searchQuery]);

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [notesRes, boardsRes] = await Promise.all([
        notesAPI.getAll(),
        boardsAPI.getAll()
      ]);

      setNotes(notesRes.data || []);
      setBoards(boardsRes.data || []);

      if (boardsRes.data && boardsRes.data.length > 0) {
        const allStreams: Stream[] = [];
        for (const board of boardsRes.data) {
          try {
            const streamRes = await streamsAPI.getByBoard(board._id);
            allStreams.push(...(streamRes.data || []));
          } catch (err) {
            console.error(`Error fetching streams for board ${board._id}:`, err);
          }
        }
        setStreams(allStreams);

        const allSubjects: Subject[] = [];
        for (const stream of allStreams) {
          try {
            const subjectRes = await subjectsAPI.getByStream(stream._id);
            allSubjects.push(...(subjectRes.data || []));
          } catch (err) {
            console.error(`Error fetching subjects for stream ${stream._id}:`, err);
          }
        }
        setSubjects(allSubjects);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading notes. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...notes];

    if (selectedBoard) {
      filtered = filtered.filter(note => note.boardId === selectedBoard);
    }

    if (selectedStream) {
      filtered = filtered.filter(note => note.streamId === selectedStream);
    }

    if (selectedSubject) {
      filtered = filtered.filter(note => note.subjectId === selectedSubject);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.description.toLowerCase().includes(query)
      );
    }

    setFilteredNotes(filtered);
  };

  const getAvailableStreams = () => {
    if (!selectedBoard) return streams;
    return streams.filter(stream => stream.boardId === selectedBoard);
  };

  const getAvailableSubjects = () => {
    if (!selectedStream) return subjects;
    return subjects.filter(subject => subject.streamId === selectedStream);
  };

  const clearFilters = () => {
    setSelectedBoard('');
    setSelectedStream('');
    setSelectedSubject('');
    setSearchQuery('');
  };

  const addToCart = (noteId: string) => {
    if (!cart.includes(noteId)) {
      setCart([...cart, noteId]);
    }
  };

  const removeFromCart = (noteId: string) => {
    setCart(cart.filter(id => id !== noteId));
  };

  const getTotalPrice = () => {
    return filteredNotes
      .filter(note => cart.includes(note._id))
      .reduce((total, note) => total + note.price, 0);
  };

  const handleCheckout = async () => {
    if (!user) {
      alert('Please login to purchase notes');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      setProcessingPayment(true);

      // Create order
      const orderResponse = await ordersAPI.create(cart);
      const { orderId, amount, currency, key } = orderResponse.data;

      // Check if Razorpay SDK is loaded
      if (!window.Razorpay) {
        alert('Razorpay SDK not loaded. Please refresh the page.');
        setProcessingPayment(false);
        return;
      }

      // Razorpay options
      const options = {
        key: key,
        amount: amount * 100, // Convert to paise
        currency: currency,
        name: 'NotesHub',
        description: 'Purchase Study Notes',
        order_id: orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            await ordersAPI.verify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            alert('Payment successful! You can now download your notes from My Orders.');
            setCart([]);
            navigate('/my-orders');
          } catch (error: any) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#667eea',
        },
        modal: {
          ondismiss: function() {
            setProcessingPayment(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setProcessingPayment(false);
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.response?.data?.message || 'Error creating order. Please try again.');
      setProcessingPayment(false);
    }
  };

  return (
    <div className="shop">
      <div className="shop-header">
        <h1>Browse & Buy Notes</h1>
        <p>All notes in one place - filter instantly by board, stream, or subject</p>
      </div>

      <div className="shop-container">
        <aside className="shop-filters">
          <div className="filter-header">
            <h3>Quick Filters</h3>
            {(selectedBoard || selectedStream || selectedSubject || searchQuery) && (
              <button onClick={clearFilters} className="btn-clear-filters">
                Clear All
              </button>
            )}
          </div>

          <div className="filter-group">
            <label>🔍 Search</label>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label>📚 Board</label>
            <select
              value={selectedBoard}
              onChange={(e) => {
                setSelectedBoard(e.target.value);
                setSelectedStream('');
                setSelectedSubject('');
              }}
            >
              <option value="">All Boards</option>
              {boards.map(board => (
                <option key={board._id} value={board._id}>{board.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>🎓 Stream</label>
            <select
              value={selectedStream}
              onChange={(e) => {
                setSelectedStream(e.target.value);
                setSelectedSubject('');
              }}
              disabled={!selectedBoard}
            >
              <option value="">All Streams</option>
              {getAvailableStreams().map(stream => (
                <option key={stream._id} value={stream._id}>{stream.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>📖 Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={!selectedStream}
            >
              <option value="">All Subjects</option>
              {getAvailableSubjects().map(subject => (
                <option key={subject._id} value={subject._id}>{subject.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-stats">
            <p>Showing {filteredNotes.length} of {notes.length} notes</p>
          </div>

          {cart.length > 0 && (
            <div className="cart-summary">
              <h4>🛒 Cart ({cart.length})</h4>
              <p className="cart-total">Total: ₹{getTotalPrice()}</p>
              <button 
                onClick={handleCheckout} 
                className="btn-checkout"
                disabled={processingPayment}
              >
                {processingPayment ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          )}
        </aside>

        <main className="shop-content">
          {loading ? (
            <div className="loading">Loading notes...</div>
          ) : filteredNotes.length === 0 ? (
            <div className="no-notes">
              <p>No notes found matching your filters</p>
              {(selectedBoard || selectedStream || selectedSubject || searchQuery) && (
                <button onClick={clearFilters} className="btn-clear">
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="notes-grid">
              {filteredNotes.map(note => (
                <div key={note._id} className="note-card">
                  {note.previewImage && (
                    <div className="note-image">
                      <img 
                        src={`http://localhost:5000${note.previewImage}`} 
                        alt={note.title}
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  )}
                  {!note.previewImage && (
                    <div className="note-image note-image-placeholder">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                        <rect fill="#f0f0f0" width="100" height="100"/>
                        <text fill="#999" fontFamily="sans-serif" fontSize="14" x="50%" y="50%" textAnchor="middle" dy=".3em">📄 Note</text>
                      </svg>
                    </div>
                  )}
                  <div className="note-badges">
                    <span className="badge badge-board">{note.board}</span>
                    <span className="badge badge-stream">{note.stream}</span>
                    <span className="badge badge-subject">{note.subject}</span>
                  </div>
                  <h3>{note.title}</h3>
                  <p className="note-description">{note.description}</p>
                  <div className="note-meta">
                    <span className="note-pages">📄 {note.pages} pages</span>
                  </div>
                  <div className="note-footer">
                    <span className="note-price">₹{note.price}</span>
                    {cart.includes(note._id) ? (
                      <button
                        onClick={() => removeFromCart(note._id)}
                        className="btn-remove"
                      >
                        Remove from Cart
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCart(note._id)}
                        className="btn-add"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;
