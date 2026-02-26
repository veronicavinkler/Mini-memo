import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ session, supabase }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      padding: '1rem', 
      background: '#333', 
      color: 'white' 
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold' }}>
        MiniMemo
      </Link>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {session ? (
          <>
            <Link to="/notes" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>
              My Notes
            </Link>
            
            <Link to="/diary" style={{ color: 'white', marginRight: '15px', textDecoration: 'none' }}>
              Diary
            </Link>

            <button 
              onClick={handleLogout}
              style={{ background: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}