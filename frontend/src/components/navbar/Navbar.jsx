import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const navStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    background: '#333',
    color: 'white',
    marginBottom: '20px'
  };

  const linkGroupStyle = {
    display: 'flex',
    gap: '20px'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold'
  };

  const logoutButtonStyle = {
    background: '#ff4d4d',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
    window.location.reload(); 
  };

  return (
    <nav style={navStyle}>
      <div style={linkGroupStyle}>
        <Link style={linkStyle} to="/">Home</Link>
        
        {/* Only show these if logged in */}
        {isLoggedIn && (
          <>
            <Link style={linkStyle} to="/notes">Notes</Link>
            <Link style={linkStyle} to="/diary">Diary</Link>
          </>
        )}
      </div>

      <div>
        {isLoggedIn ? (
          <button onClick={handleLogout} style={logoutButtonStyle}>Logout</button>
        ) : (
          <Link style={linkStyle} to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}