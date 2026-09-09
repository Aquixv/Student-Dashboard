import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';
import { LOGIN_USER } from '../graphql/mutations';
import './Results.css'; 
import type { LoginResponse } from '../types';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [loginAdmin, { loading }] = useMutation<LoginResponse>(LOGIN_USER, {
    onCompleted: (data) => {
      // Assuming your login mutation returns a token and user object
      const user = data.login.user;
      
      if (user.role !== 'Admin') {
        setErrorMsg('Access denied. This portal is restricted to administrative staff.');
        return;
      }

      localStorage.setItem('portal_token', data.login.token);
      navigate('/admin');
    },
    onError: (error) => {
      setErrorMsg(error.message || 'Invalid admin credentials');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    loginAdmin({ variables: { email, password } });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div className="content-card" style={{ maxWidth: '400px', width: '100%', padding: '2.5rem', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: '#2b3674', color: 'white', width: '60px', height: '60px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
            EP
          </div>
          <h2 style={{ color: '#2b3674', margin: 0 }}>Staff Gateway</h2>
          <p style={{ color: '#718096', fontSize: '0.9rem', marginTop: '0.5rem' }}>Authorized personnel only</p>
        </div>

        {errorMsg && (
          <div style={{ background: '#fee2e2', color: '#dc2626', padding: '0.75rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.85rem', textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#4a5568', marginBottom: '0.5rem', fontWeight: 600 }}>Staff Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }}
              placeholder="admin@eduportal.edu.ng"
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#4a5568', marginBottom: '0.5rem', fontWeight: 600 }}>Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', outline: 'none' }}
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="primary-btn" 
            disabled={loading}
            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', background: '#2b3674' }}
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
        
      </div>
    </div>
  );
}