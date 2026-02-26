import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Notes({ supabase }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  const fetchNotes = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/login');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/notes`, {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      
      if (res.status === 401) throw new Error("Unauthorized");
      
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [API_URL, navigate, supabase]);

  const addNote = async () => {
    if (!newNote) return;

    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
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
        {notes.length > 0 ? (
          notes.map(note => (
            <li key={note.id} style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>
              {note.content}
            </li>
          ))
        ) : (
          <p>No notes found. Start writing!</p>
        )}
      </ul>
    </div>
  );
}