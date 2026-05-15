import React, { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import axiosInstance from '../lib/axios';
import '../styles/Login.css';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
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
      const response = await axiosInstance.post('/auth/signup', formData);
      console.log('Signup successful:', response.data);
      alert('Signup Successful!');
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || 'Failed to sign up. Please try again.');
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
              Create an account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Join Vibe Chat and start connecting.
            </motion.p>
          </div>

          <motion.form 
            className="login-form" 
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {error && <div style={{ color: 'var(--error-color)', fontSize: '0.9rem', marginBottom: '0.5rem', textAlign: 'center' }}>{error}</div>}
            
            <Input 
              label="Full Name" 
              name="name"
              type="text" 
              placeholder="John Doe" 
              icon={User} 
              value={formData.name}
              onChange={handleChange}
              required
            />

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
              placeholder="At least 6 characters" 
              icon={Lock} 
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button type="submit" fullWidth isLoading={isLoading} style={{ marginTop: '1rem' }}>
              Sign Up
            </Button>
            
          </motion.form>

          <motion.div 
            className="signup-prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Already have an account? <Link to="/login">Sign in</Link>
          </motion.div>
        </div>
        
        <div className="login-graphic-section" style={{ background: 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)' }}>
          <motion.div 
            className="login-graphic-content"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2>Join the Community</h2>
            <p>Sign up now to get started.<br/>It's quick and easy.</p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
