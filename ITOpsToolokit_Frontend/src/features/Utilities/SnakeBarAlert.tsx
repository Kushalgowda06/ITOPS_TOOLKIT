import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const SnakeBarAlert = ({ open, message, onClose, severity,anchorOrigin,autoHideDuration,variantStyle="filled" }) => {
  return (
    <Snackbar
      anchorOrigin={anchorOrigin}
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnakeBarAlert;
