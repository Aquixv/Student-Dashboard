import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import {REGISTER_USER} from '../graphql/mutations'
import './auth.css';
import type { RegisterResponse } from '../types';
import Logo from '../assets/Logo.png'

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [registerUser, { loading, error }] = useMutation<RegisterResponse>(REGISTER_USER, {
    onCompleted: (data) => {
      localStorage.setItem('portal_token', data?.registerUser.token);
      navigate('/');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser({
        variables: {
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
        },
      });
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-brand-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', textAlign: 'center' }}>
  <img 
    src={Logo} 
    alt="Institute Logo" 
    style={{ 
      height: '120px', 
      width: 'auto', 
      maxWidth: '80%', 
      objectFit: 'contain', 
      cursor: 'pointer' 
    }} 
    onClick={() => navigate("/")}
  />
  {/* <p style={{ margin: 0, fontSize: '1.1rem', color: '#e2e8f0' }}>
    Create an account to become a Student
  </p> */}
</div>
      
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <h2>Create Account</h2>
          <p>Register below to generate your portal credentials.</p>

          {error && <div className="auth-error" style={{ color: 'red', marginBottom: '1rem' }}>{error.message}</div>}

          <form onSubmit={handleSignup}>
            <div className="auth-input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="fullName"
                placeholder="John Doe" 
                value={formData.fullName}
                onChange={handleChange}
                required 
              />
            </div>

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
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="auth-redirect">
            Already have an account? 
            <Link to="/login" className="auth-link">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}