import React, { useEffect, useState } from 'react';
import { boardsAPI, Board } from '../api/boards';
import './Boards.css';

const Boards: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className="loading">Loading boards...</div>;
  }

  return (
    <div className="boards-section">
      <h2 className="section-title">Available Boards</h2>
      <div className="boards-grid">
        {boards.map((board) => (
          <div key={board._id} className="board-card">
            <h3>{board.name}</h3>
            <p>{board.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Boards;
