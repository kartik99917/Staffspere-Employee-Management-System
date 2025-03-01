import React from 'react';
import { Box, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';

const Logo = ({ size = 'medium', showText = true }) => {
  const logoSizes = {
    small: { icon: 24, text: 'h6' },
    medium: { icon: 32, text: 'h5' },
    large: { icon: 40, text: 'h4' }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: logoSizes[size].icon * 1.5,
          height: logoSizes[size].icon * 1.5,
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
        }}
      >
        <BusinessIcon
          sx={{
            fontSize: logoSizes[size].icon,
            color: '#ffffff',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          }}
        />
      </Box>
      {showText && (
        <Typography
          variant={logoSizes[size].text}
          sx={{
            fontWeight: 700,
            fontFamily: "'Poppins', sans-serif",
            background: 'linear-gradient(45deg, #1e3a8a, #3b82f6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.5px',
          }}
        >
          StaffSphere
        </Typography>
      )}
    </Box>
  );
};

export default Logo; 