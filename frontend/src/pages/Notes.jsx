import { useState, useEffect } from 'react';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  // Fetch notes from FastAPI on load
  useEffect(() => {
    fetch('https://your-fastapi-url.render.com/notes')
      .then(res => res.json())
      .then(data => setNotes(data));
  }, []);

  const addNote = async () => {
    if (!newNote) return;
    
    // Example POST to your backend
    const response = await fetch('https://your-fastapi-url.render.com/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newNote })
    });

    if (response.ok) {
      const addedNote = await response.json();
      setNotes([...notes, addedNote]);
      setNewNote("");
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>My Notes</h1>
      <input 
        value={newNote} 
        onChange={(e) => setNewNote(e.target.value)}
        placeholder="Write a note..."
      />
      <button onClick={addNote}>Save Note</button>
      <ul>
        {notes.map(note => <li key={note.id}>{note.content}</li>)}
      </ul>
    </div>
  );
}