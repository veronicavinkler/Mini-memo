import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import Navbar from './components/navbar/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Notes from './pages/Notes';

// Initialize Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <Navbar session={session} supabase={supabase} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!session ? <Login supabase={supabase} /> : <Navigate to="/notes" />} />
        
        <Route 
          path="/notes" 
          element={session ? <Notes session={session} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </>
  );
}