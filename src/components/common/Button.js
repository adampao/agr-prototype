import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  className = '',
  disabled = false,
  type = 'button',
  fullWidth = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none transition-colors';
  
  const variantClasses = {
    primary: 'bg-oliveGold text-marbleWhite hover:bg-oliveGold/90 focus:ring-2 focus:ring-oliveGold/50',
    secondary: 'bg-aegeanBlue text-marbleWhite hover:bg-aegeanBlue/90 focus:ring-2 focus:ring-aegeanBlue/50',
    tertiary: 'bg-philosophicalPurple text-marbleWhite hover:bg-philosophicalPurple/90 focus:ring-2 focus:ring-philosophicalPurple/50',
    outline: 'border border-aegeanBlue text-aegeanBlue bg-transparent hover:bg-aegeanBlue/10 focus:ring-2 focus:ring-aegeanBlue/50',
    ghost: 'text-aegeanBlue hover:bg-aegeanBlue/10 focus:ring-2 focus:ring-aegeanBlue/50',
  };
  
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClasses} ${className}`;
  
  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;