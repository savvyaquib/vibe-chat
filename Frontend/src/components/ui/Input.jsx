import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Input.css';

const Input = forwardRef(({ 
  label, 
  error, 
  icon: Icon, 
  type = 'text',
  className = '', 
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={`input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <div className="input-container">
        {Icon && (
          <div className="input-icon">
            <Icon size={18} />
          </div>
        )}
        <input 
          ref={ref}
          type={inputType}
          className={`input-field ${Icon ? 'has-icon' : ''} ${isPassword ? 'has-password-toggle' : ''} ${error ? 'has-error' : ''}`}
          {...props} 
        />
        {isPassword && (
          <button 
            type="button" 
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
