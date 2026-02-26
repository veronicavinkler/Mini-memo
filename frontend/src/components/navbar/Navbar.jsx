import { Link } from 'react-router-dom';

export default function Navbar() {
  const navStyle = {
    display: 'flex',
    gap: '20px',
    padding: '15px',
    background: '#333',
    color: 'white',
    marginBottom: '20px'
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold'
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
    };

  return (
    <nav style={navStyle}>
      <Link style={linkStyle} to="/">Home</Link>
      <Link style={linkStyle} to="/notes">Notes</Link>
      <Link style={linkStyle} to="/diary">Diary</Link>
      <Link style={linkStyle} to="/login">Login</Link>
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}