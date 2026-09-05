import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { LOGIN_USER } from '../graphql/mutations';
import './Auth.css';
import type { LoginResponse } from '../types';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loginUser, { loading, error}] = useMutation<LoginResponse>(LOGIN_USER, {
    onCompleted: (data) => {
      localStorage.setItem('portal_token', data.login.token);
      navigate('/');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginUser({
        variables: {
          email: formData.email,
          password: formData.password,
        },
      });
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-brand-panel">
        <h1>EduPortal</h1>
        <p>Manage your academic journey, track fee payments, and register for courses all in one unified platform.</p>
      </div>
      
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <h2>Welcome Back</h2>
          <p>Enter your credentials to access your account.</p>

          {error && <div className="auth-error" style={{ color: 'red', marginBottom: '1rem' }}>{error.message}</div>}

          <form onSubmit={handleLogin}>
            <div className="auth-input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email"
                placeholder="student@eduportal.edu.ng" 
                value={formData.email}
                onChange={handleChange}
                required 
              />
            </div>
            
            <div className="auth-input-group">
              <label>Password</label>
              <input 
                type="password" 
                name="password"
                placeholder="••••••••" 
                value={formData.password}
                onChange={handleChange}
                required 
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-redirect">
            Don't have an account? 
            <Link to="/signup" className="auth-link">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}