import React from 'react';
import './Button.css';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseClass = `btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${isLoading ? 'btn-loading' : ''} ${className}`;
  
  return (
    <button className={baseClass} disabled={isLoading} {...props}>
      {isLoading && <Loader2 className="btn-spinner" size={18} />}
      <span className={isLoading ? 'btn-content-hidden' : ''}>{children}</span>
    </button>
  );
};

export default Button;
