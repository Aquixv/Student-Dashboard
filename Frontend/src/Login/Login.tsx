import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For the demo, bypass real auth and jump straight to the dashboard
    navigate('/');
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

          <form onSubmit={handleLogin}>
            <div className="auth-input-group">
              <label>Email Address</label>
              <input type="email" placeholder="student@eduportal.edu.ng" required />
            </div>
            
            <div className="auth-input-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" required />
            </div>

            <button type="submit" className="auth-btn">Sign In</button>
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