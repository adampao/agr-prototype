import React from 'react';

const Input = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  className = '',
  required = false,
  disabled = false,
  fullWidth = false,
  ...props
}) => {
  const inputClasses = `
    input-field
    ${error ? 'border-terracotta focus:ring-terracotta/50' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `;

  return (
    <div className={`mb-4 ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block mb-2 text-sm font-medium text-aegeanBlue"
        >
          {label}{required && <span className="text-terracotta ml-1">*</span>}
        </label>
      )}
      
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={inputClasses}
        {...props}
      />
      
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-terracotta' : 'text-aegeanBlue/70'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;