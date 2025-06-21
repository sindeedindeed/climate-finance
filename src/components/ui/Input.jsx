// ...existing imports...

const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  error = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  rows = 4,
  options = [],
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const baseInputClasses = `
    block w-full px-3 py-2 text-sm rounded-xl border transition-all duration-200
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:border-purple-500 focus:ring-purple-500'
    }
    ${disabled 
      ? 'bg-gray-100 cursor-not-allowed text-gray-500' 
      : 'bg-white hover:border-gray-400'
    }
    focus:ring-2 focus:ring-opacity-20 focus:outline-none
    ${leftIcon ? 'pl-11' : ''}
    ${rightIcon || type === 'password' ? 'pr-11' : ''}
    ${className}
  `;

  const getAriaLabel = () => {
    if (label) return label;
    if (placeholder) return placeholder;
    return `${type} input`;
  };

  // ...existing code...

  <input
    id={name}
    name={name}
    type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
    value={value || ''}
    onChange={handleChange}
    onFocus={() => setIsFocused(true)}
    onBlur={() => setIsFocused(false)}
    placeholder={placeholder}
    required={required}
    disabled={disabled}
    className={baseInputClasses}
    aria-label={getAriaLabel()}
    aria-invalid={error ? 'true' : 'false'}
    {...props}
  />

  // ...existing code...
};
