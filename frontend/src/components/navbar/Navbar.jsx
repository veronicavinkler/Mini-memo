import { Link, useNavigate } from 'react-router-dom';
import { UserButton, useAuth, useClerk } from "@clerk/clerk-react";

export default function Navbar() {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { isSignedIn } = useAuth();

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    background: '#333',
    color: 'white',
    marginBottom: '20px'
  };

  const linkGroupStyle = { display: 'flex', gap: '20px' };
  const linkStyle = { color: 'white', textDecoration: 'none', fontWeight: 'bold' };

  const logoutButtonStyle = {
    background: '#ff4d4d',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={navStyle}>
      <div style={linkGroupStyle}>
        <Link style={linkStyle} to="/">Home</Link>
        
        {isSignedIn && (
          <>
            <Link style={linkStyle} to="/notes">Notes</Link>
            <Link style={linkStyle} to="/diary">Diary</Link>
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {isSignedIn ? (
          <>
            <UserButton afterSignOutUrl="/login" />
            <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
          </>
        ) : (
          <Link style={linkStyle} to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}