import React from 'react';
import { Box, Typography } from '@mui/material';
import '../../styles/Index.css';

const CautionTape = ({ text, reverse }) => (
  <Box className={`caution-tape ${reverse ? 'caution-reverse' : ''}`}>
    <Box className="caution-track">
      {[...Array(10)].map((_, i) => (
        <Typography key={i} variant="h6" className="caution-text">
          {text} {text}
        </Typography>
      ))}
    </Box>
  </Box>
);

export default CautionTape;