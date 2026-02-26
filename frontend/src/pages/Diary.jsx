import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Diary() {
  const [entries, setEntries] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetch(`${API_URL}/diary`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.status === 401) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => {
        setEntries(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Diary fetch error:", err);
        setLoading(false);
      });
  }, [API_URL, token, navigate]);

  const saveEntry = async () => {
    if (!text) return;

    const res = await fetch(`${API_URL}/diary`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        content: text, 
        date: new Date().toISOString() 
      })
    });

    if (res.ok) {
      const newItem = await res.json();
      const entryToAdd = Array.isArray(newItem) ? newItem[0] : newItem;
      setEntries([entryToAdd, ...entries]);
      setText("");
    }
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading your secrets...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>Daily Diary</h1>
      <textarea 
        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
        rows="5" 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder="How was your day?"
      />
      <button 
        onClick={saveEntry}
        style={{ marginTop: '10px', padding: '10px 20px', background: '#333', color: 'white', borderRadius: '5px', cursor: 'pointer' }}
      >
        Lock Entry
      </button>
      
      <div style={{ marginTop: '30px' }}>
        {entries.length === 0 ? (
          <p>No entries yet. Start writing!</p>
        ) : (
          entries.map(item => (
            <div key={item.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px', marginBottom: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <small style={{ color: '#888' }}>
                {new Date(item.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </small>
              <p style={{ fontSize: '1.1rem', marginTop: '10px', whiteSpace: 'pre-wrap' }}>{item.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}