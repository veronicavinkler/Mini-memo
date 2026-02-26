import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetch(`${API_URL}/notes`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => setNotes(data))
      .catch(err => console.error("Fetch error:", err));
  }, [API_URL, token, navigate]);

  const addNote = async () => {
    if (!newNote) return;
    
    const response = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content: newNote })
    });

    if (response.ok) {
      const addedNote = await response.json();
      const noteToDisplay = Array.isArray(addedNote) ? addedNote[0] : addedNote;
      setNotes([...notes, noteToDisplay]);
      setNewNote("");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>My Notes</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          style={{ flex: 1, padding: '10px' }}
          value={newNote} 
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a note..."
        />
        <button onClick={addNote} style={{ padding: '10px 20px' }}>Save Note</button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notes.map(note => (
          <li key={note.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
            {note.content}
          </li>
        ))}
      </ul>
    </div>
  );
}