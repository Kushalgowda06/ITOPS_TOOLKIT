import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
 
interface SelectStyles extends React.CSSProperties {
  '&:hover'?: React.CSSProperties;
  '&:focus'?: React.CSSProperties;
}
 
interface CustomSelectStyles {
  container: React.CSSProperties;
  select: SelectStyles;
  selectHover: React.CSSProperties;
  selectFocus: React.CSSProperties;
  selectError: React.CSSProperties;
  icon: React.CSSProperties;
}
 
interface CustomSelectProps<T extends string> {
  id: T;
  options: string[];
  value: string;
  onChange: (id: T, value: string) => void;
  placeholder: string;
  error?: string;
}
 
const styles: CustomSelectStyles = {
  container: {
    position: 'relative',
    width: '100%',
  },
  select: {
    width: '100%',
    padding: '0.45rem 1rem',
    paddingRight: '2.5rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#cbd5e1',
    borderRadius: '0.5rem',
    fontSize: '0.9rem',
    backgroundColor: 'white',
    color: '#1e293b',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    appearance: 'none',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    outline: 'none',
  },
  selectHover: {
    borderColor: '#94a3b8',
  },
  selectFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.25)',
  },
  selectError: {
    borderColor: '#ef4444',
    boxShadow: '0 0 0 1px #ef4444',
  },
  icon: {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
    pointerEvents: 'none',
  },
};
 
function CustomSelect<T extends string>({
  id,
  options,
  value,
  onChange,
  placeholder,
  error
}: CustomSelectProps<T>): React.ReactElement {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
 
  const selectStyle = {
    ...styles.select,
    ...(isHovered ? styles.selectHover : {}),
    ...(isFocused ? styles.selectFocus : {}),
    ...(error ? styles.selectError : {}),
  };
 
  return (
    <div style={styles.container}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        style={selectStyle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown size={16} style={styles.icon} />
    </div>
  );
}
 
export default CustomSelect;
 