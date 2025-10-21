import React from 'react';
import { Autocomplete, TextField, Radio, Paper, Tooltip } from '@mui/material';

const CustomAutoCompleteRadio = ({ id, options, value, onChange, placeholder,FiledLabel="",widthStyle = {}, error, clearvalue=false, PaperStyle={}}) => {
  // Function to calculate the maximum length based on the width of the dropdown
  const calculateMaxLength = (width) => {
    // Assuming each character roughly takes 8 pixels in width
    const charWidth = 11;
    return Math.floor(width / charWidth);
  };
  // Get the width from the widthStyle prop or set a default width
  const dropdownWidth = widthStyle["width"] ? parseInt(widthStyle["width"], 10) : 200;
  const maxLength = calculateMaxLength(dropdownWidth);

  return (
    <div>
      <Autocomplete
        id={id}
        options={options.sort()}
        disableClearable = {clearvalue}
        value={value}
        onChange={(event, newValue) => onChange(newValue)}
        renderInput={(params) => <TextField {...params} label={FiledLabel} style={widthStyle} placeholder={placeholder} error={error} />}
        renderOption={(props, option, { selected }) => (
          <li {...props} className='ps-0 pt-0 fs-6 cursor-pointer autoCompleteHover'>
            <Radio checked={selected} sx={{ fontSize: '1px' }} />
            <Tooltip title={option} placement="top">
              <span className="cursor-pointer text-capitalize">
                {option.length > maxLength ? `${option.substring(0, maxLength)}...` : option}
              </span>
            </Tooltip>
          </li>
        )}
        PaperComponent={({ children }) => (
          <Paper
            elevation={8}
            style={PaperStyle}
          >
            {children}
          </Paper>
        )}
      />
    </div>
  );
};

export default CustomAutoCompleteRadio;
