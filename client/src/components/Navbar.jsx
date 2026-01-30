// client/src/components/Navbar.js

// 1. Import `useContext` from React and our custom `AuthContext`.
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  // 2. Use the useContext hook to get the values from our AuthContext.
  // We destructure `isAuthenticated` to check the login status and `logout`
  // to give our button a function to call.
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // 3. Create a handler function for the logout action.
  // This function will call the logout function from our context and then
  // redirect the user to the homepage.
  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to homepage after logout for a clean user experience.
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Weather Dashboard</Link>
      </div>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/">Dashboard</Link>
            {/* 4. Attach the `handleLogout` function to the button's onClick event. */}
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
