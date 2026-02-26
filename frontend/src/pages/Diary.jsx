import { useState, useEffect } from 'react';

export default function Diary() {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");
  const API_URL = "https://your-render-app.onrender.com";

  useEffect(() => {
    fetch(`${API_URL}/diary`)
      .then(res => res.json())
      .then(data => setEntries(data));
  }, []);

  const saveEntry = async () => {
    const res = await fetch(`${API_URL}/diary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text, date: new Date().toISOString() })
    });
    if (res.ok) {
      const newItem = await res.json();
      setEntries([newItem, ...entries]);
      setText("");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Daily Diary</h1>
      <textarea 
        rows="5" 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="How was your day?"
      />
      <button onClick={saveEntry}>Lock Entry</button>
      
      <div style={{ marginTop: '20px' }}>
        {entries.map(item => (
          <div key={item.id} className="card">
            <small>{new Date(item.date).toLocaleDateString()}</small>
            <p>{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}