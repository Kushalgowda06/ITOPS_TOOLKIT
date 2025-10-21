import React from "react";
import { Modal, Box, Typography } from '@mui/material';
import Tableedit from "../Table/Tableedit";

const StatusBarsTable = ({ open, handleClose, data }) => {
  if (!data) {
    return <></>;
  }

  return (
    <Modal open={open} onClose={handleClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ ...modalStyle }}>
        <Typography variant="h6" component="h2">
          Detailed Data
        </Typography>
        <Tableedit customData={data} apiUrl={null} />
      </Box>
    </Modal>
  );
};

const modalStyle = {
  width: '90%',
  height: '90%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflow: 'auto',
};

export default StatusBarsTable;
