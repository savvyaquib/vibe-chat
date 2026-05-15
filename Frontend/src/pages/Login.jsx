import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import axiosInstance from '../lib/axios';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axiosInstance.post('/auth/login', formData);
      console.log('Login successful:', response.data);
      // For now we just log it and maybe redirect to a dummy dashboard or chat
      // navigate('/chat'); 
      alert('Login Successful!');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <motion.div 
        className="login-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="login-form-section">
          <div className="login-header">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Welcome back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Please enter your details to sign in.
            </motion.p>
          </div>

          <motion.form 
            className="login-form" 
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {error && <div style={{ color: 'var(--error-color)', fontSize: '0.9rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
            <Input 
              label="Email" 
              name="email"
              type="email" 
              placeholder="Enter your email" 
              icon={Mail} 
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <Input 
              label="Password" 
              name="password"
              type="password" 
              placeholder="••••••••" 
              icon={Lock} 
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div className="login-options">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: 'var(--primary-color)' }} />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading} style={{ marginTop: '1rem' }}>
              Sign In
            </Button>
            
          </motion.form>

          <motion.div 
            className="signup-prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Don't have an account? <Link to="/signup">Sign up</Link>
          </motion.div>
        </div>
        
        <div className="login-graphic-section">
          <motion.div 
            className="login-graphic-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2>Vibe Chat</h2>
            <p>Connect with your friends in real-time.<br/>Experience seamless communication.</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
