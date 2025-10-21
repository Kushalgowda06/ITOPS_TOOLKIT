import React from 'react';

interface RadioButtonGroupStyles {
  container: React.CSSProperties;
  label: React.CSSProperties;
  buttonGroup: React.CSSProperties;
  option: React.CSSProperties & {
    '&:hover'?: React.CSSProperties;
  };
  active: React.CSSProperties;
  inactive: React.CSSProperties & {
    '&:hover'?: React.CSSProperties;
  };
  input: React.CSSProperties;
}

interface RadioButtonGroupProps {
  label: string;
  isChecked: boolean;
  onChange: (value: boolean) => void;
}

const styles: RadioButtonGroupStyles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  label: {
    width: '100px',
    fontSize: '0.9rem',
    color: '#475569',
    fontWeight: '500',
  },
  buttonGroup: {
    display: 'flex',
    border: '1px solid #cbd5e1',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  option: {
    padding: '0.3rem 1.25rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '0.9rem',
    fontWeight: '500',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '80px',
  },
  active: {
    backgroundColor: '#2d2d8f',
    color: 'white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  inactive: {
    backgroundColor: '#f8fafc',
    color: '#64748b',
    '&:hover': {
      backgroundColor: '#f1f5f9',
    },
  },
  input: {
    display: 'none',
  },
};

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({ label, isChecked, onChange }): React.ReactElement => (
  <div style={styles.container}>
    {label && <small style={styles.label}>{label}</small>}
    <div style={styles.buttonGroup}>
      <label style={{
        ...styles.option,
        ...(isChecked ? styles.active : styles.inactive),
      }}>
        <input
          type="radio"
          checked={isChecked}
          onChange={() => onChange(true)}
          style={styles.input}
        />
        YES
      </label>
      <label style={{
        ...styles.option,
        ...(!isChecked ? styles.active : styles.inactive),
      }}>
        <input
          type="radio"
          checked={!isChecked}
          onChange={() => onChange(false)}
          style={styles.input}
        />
        NO
      </label>
    </div>
  </div>
);

export default RadioButtonGroup;