import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

export default function Signup() {
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate a successful registration and redirect to dashboard
    navigate('/');
  };

  return (
    <div className="auth-layout">
      <div className="auth-brand-panel">
        <h1>Start Your Journey</h1>
        <p>Create your student account to securely access your timetable, grades, and financial records.</p>
      </div>
      
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <h2>Create Account</h2>
          <p>Register below to generate your portal credentials.</p>

          <form onSubmit={handleSignup}>
            <div className="auth-input-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" required />
            </div>

            <div className="auth-input-group">
              <label>Email Address</label>
              <input type="email" placeholder="student@eduportal.edu.ng" required />
            </div>
            
            <div className="auth-input-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" required />
            </div>

            <button type="submit" className="auth-btn">Sign Up</button>
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