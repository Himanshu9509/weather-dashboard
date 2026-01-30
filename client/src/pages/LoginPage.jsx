// client/src/pages/LoginPage.js

// 1. Import everything we need: hooks, context, and libraries.
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Import our AuthContext

function LoginPage() {
  const navigate = useNavigate();

  // 2. GET THE `login` FUNCTION FROM OUR CONTEXT.
  // The `useContext` hook subscribes to the context and returns the `value`
  // object from the closest `AuthProvider`. We destructure the `login` function from it.
  const { login } = useContext(AuthContext);

  // 3. State management for the form and errors is identical to the RegisterPage.
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. The `onSubmit` handler for the login form.
  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const user = { email, password };

    try {
      // 5. Make the API call to the login endpoint.
      const res = await axios.post('/api/auth/login', user);

      // 6. THE CRITICAL STEP: HANDLE SUCCESSFUL LOGIN
      if (res.data.token) {
        // The backend sends back a response object with a `token` property.
        // We pass this token to our `login` function from the AuthContext.
        login(res.data.token, res.data.user);
        
        // After logging in, we redirect the user to the main dashboard page.
        navigate('/');
      }
    } catch (err) {
      // 7. Error handling is the same as registration.
      // We expect "Invalid Credentials" for failed login attempts.
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  // 8. The JSX is updated to be interactive, just like the registration page.
  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h2>Welcome Back!</h2>
        <form className="auth-form" onSubmit={onSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <button type="submit" className="btn-submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;