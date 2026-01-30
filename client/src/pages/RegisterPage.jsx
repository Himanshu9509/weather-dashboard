// client/src/pages/RegisterPage.js

// 1. Import the necessary hooks and libraries.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
  // 2. Initialize the navigate function for redirection.
  const navigate = useNavigate();

  // 3. Use useState to manage the form's input fields.
  // We use a single state object to hold both email and password for convenience.
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // 4. Create state variables for handling errors and success messages from the API.
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 5. Destructure email and password from the formData state for easier access.
  const { email, password } = formData;

  // 6. Create an onChange handler to update the state as the user types.
  // This function is connected to both input fields.
  // The `[e.target.name]` syntax is a computed property name, allowing us to
  // update the corresponding key ('email' or 'password') in our formData state.
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 7. Create the onSubmit handler that will be called when the form is submitted.
  // We make this an `async` function because the API call is an asynchronous operation.
  const onSubmit = async (e) => {
    // Prevent the default form submission behavior which causes a page reload.
    e.preventDefault();
    
    // Clear previous error/success messages on a new submission.
    setError('');
    setSuccess('');

    // We'll create a new user object to send to the backend.
    const newUser = { email, password };

    try {
      // 8. Make the API call using axios.
      // We send a POST request to our backend's registration endpoint.
      // The second argument to `axios.post` is the request body (our `newUser` object).
      // The Vite proxy configured earlier will automatically route this to `http://localhost:5000/api/auth/register`.
      await axios.post('/api/auth/register', newUser);

      // If the request is successful, we set a success message.
      setSuccess('Registration successful! Redirecting to login...');
      
      // We then redirect the user to the login page after a short delay.
      setTimeout(() => {
        navigate('/login');
      }, 2000); // 2-second delay

    } catch (err) {
      // 9. Handle errors from the API call.
      // Axios places the server's response in `err.response`. If the backend
      // sends a specific error message (like "User already exists"), it will be in `err.response.data.message`.
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        // For other types of errors (e.g., network failure), we show a generic message.
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  // 10. Update the JSX to be interactive.
  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h2>Create Your Account</h2>
        {/* We attach our onSubmit handler to the form element. */}
        <form className="auth-form" onSubmit={onSubmit}>
          {/* Conditionally render error and success messages */}
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email} // Bind the input's value to our state.
              onChange={onChange} // Connect the onChange handler.
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
              value={password} // Bind the input's value to our state.
              onChange={onChange} // Connect the onChange handler.
              required
            />
          </div>
          <button type="submit" className="btn-submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;

// P.S. Don't forget to add some basic styling for your new error/success messages in App.css!
/*
.error-message { color: #ef4444; background-color: #fee2e2; padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 1rem; }
.success-message { color: #16a34a; background-color: #dcfce7; padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 1rem; }
*/