import React from 'react';

const Card = ({ 
  children, 
  variant = 'default', 
  className = '',
  onClick,
  ...props 
}) => {
  const variantClasses = {
    default: 'card bg-white',
    philosophical: 'philosophical-card',
    oracle: 'oracle-card',
    elevated: 'bg-white rounded-lg shadow-lg p-6 border border-aegeanBlue/10',
    interactive: 'bg-white rounded-lg shadow-md p-6 border border-aegeanBlue/10 hover:shadow-lg transition-shadow cursor-pointer',
  };
  
  const classes = `${variantClasses[variant]} ${className}`;
  
  return (
    <div 
      className={classes} 
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;