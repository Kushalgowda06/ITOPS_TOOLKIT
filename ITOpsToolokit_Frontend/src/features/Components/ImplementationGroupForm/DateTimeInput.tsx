import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";
 
interface DateTimeInputStyles {
  container: React.CSSProperties;
  label: React.CSSProperties;
  inputWrapper: React.CSSProperties;
  baseInput: React.CSSProperties & {
    '&:focus'?: React.CSSProperties;
  };
  inputHover: React.CSSProperties;
  inputFocus: React.CSSProperties;
  icon: React.CSSProperties;
  errorText: React.CSSProperties;
}
 
interface DateTimeInputProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}
 
const styles: DateTimeInputStyles = {
  container: {
    marginBottom: '1rem',
    position: 'relative',
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    color: '#64748b',
    marginBottom: '0.375rem',
    fontWeight: '500',
  },
  inputWrapper: {
    position: 'relative',
    width: '100%',
  },
  baseInput: {
    width: '100%',
    padding: '0.45rem 1rem',
    paddingRight: '2.5rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '#cbd5e1',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    color: '#1e293b',
    backgroundColor: 'white',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    outline: 'none',
  },
  inputHover: {
    borderColor: '#94a3b8',
  },
  inputFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.25)',
  },
  icon: {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#64748b',
    cursor: 'pointer',
  },
  errorText: {
    color: '#ef4444',
    fontSize: '0.75rem',
    marginTop: '0.375rem',
    fontWeight: '500',
  },
};
 
const DateTimeInput: React.FC<DateTimeInputProps> = ({ label, value, onChange }) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(formatDateTime(value));
  const [error, setError] = useState<string>('');
 
  const inputStyle = {
    ...styles.baseInput,
    ...(isHovered ? styles.inputHover : {}),
    ...(isFocused ? styles.inputFocus : {}),
  };
 
  function formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
 
  function parseDateTime(input: string): Date | null {
    const regex = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/;
    const match = input.match(regex);
 
    if (!match) {
      return null;
    }
 
    const [_, year, month, day, hours, minutes] = match;
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );
 
    return isNaN(date.getTime()) ? null : date;
  }
 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setError('');
 
    if (newValue.length === 16) {
      const parsedDate = parseDateTime(newValue);
      if (parsedDate) {
        onChange(parsedDate);
      } else {
        setError('Invalid date format. Use YYYY-MM-DD HH:mm');
      }
    }
  };
 
  const handleDatePickerChange = (date: Date | null): void => {
    if (date) {
      setInputValue(formatDateTime(date));
      onChange(date);
      setShowPicker(false);
    }
  };
 
  return (
    <div style={styles.container}>
      <label style={styles.label}>{label}</label>
      <div style={styles.inputWrapper}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="YYYY-MM-DD HH:mm"
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (!inputValue) {
              setInputValue(formatDateTime(value));
            }
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
        <Calendar
          size={16}
          style={styles.icon}
          onClick={() => setShowPicker(!showPicker)}
        />
        {showPicker && (
          <div style={{ position: 'absolute', zIndex: 1 }}>
            <DatePicker
              selected={value}
              onChange={handleDatePickerChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="yyyy-MM-dd HH:mm"
              inline
            />
          </div>
        )}
        {error && <div style={styles.errorText}>{error}</div>}
      </div>
    </div>
  );
};
 
export default DateTimeInput;
 