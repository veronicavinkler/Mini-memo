import { useState } from 'react';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignup ? '/signup' : '/login';
    
    const res = await fetch(`https://your-fastapi-url.render.com${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      setMessage(isSignup ? "Signup successful! Check email." : "Logged in!");
      // If login, you'd usually save data.session.access_token to localStorage here
    } else {
      setMessage("Error: " + (data.detail || "Something went wrong"));
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '50px auto', textAlign: 'center' }}>
      <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
      </form>

      <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>
        {isSignup ? "Already have an account?" : "Don't have an account?"}
        <button 
          onClick={() => setIsSignup(!isSignup)} 
          style={{ background: 'none', color: 'blue', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isSignup ? " Login here" : " Sign up here"}
        </button>
      </p>
      
      {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
    </div>
  );
}