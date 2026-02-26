import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ supabase }) { // Receive supabase client as a prop
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Processing...");

    try {
      let result;
      if (isSignup) {
          result = await supabase.auth.signUp({
          email,
          password,
        });
      } else {
          result = await supabase.auth.signInWithPassword({
          email,
          password,
        });
      }

      const { data, error } = result;

      if (error) {
        setMessage("Error: " + error.message);
      } else {
        if (isSignup) {
          setMessage("Signup successful! Check your email for a confirmation link.");
        } else {
          setMessage("Logged in! Redirecting...");
          setTimeout(() => navigate('/notes'), 1000);
        }
      }
    } catch (err) {
      setMessage("An unexpected error occurred.");
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: '300px', margin: '50px auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button 
            type="submit" 
            style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p style={{ marginTop: '15px', fontSize: '0.9rem' }}>
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button 
            onClick={() => { setIsSignup(!isSignup); setMessage(""); }} 
            style={{ background: 'none', color: '#007bff', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: '5px' }}
          >
            {isSignup ? " Login here" : " Sign up here"}
          </button>
        </p>
        
        {message && (
          <p style={{ 
            color: message.includes("Error") ? "red" : "green", 
            marginTop: '10px', 
            fontSize: '0.85rem' 
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}