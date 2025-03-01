import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import './Splash.css';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 3000); // 3 seconds loading time

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box className="splash-container">
      <div className="splash-content">
        <Typography variant="h1" className="splash-title">
          Staff<span className="splash-title-highlight">Sphere</span>
        </Typography>
        
        <Typography variant="h6" className="splash-subtitle">
          Transform Workforce into Success Force
        </Typography>
        
        <div className="loading-container">
          <div className="simple-loader">
            <div className="circle"></div>
            <div className="circle"></div>
            <div className="circle"></div>
          </div>
        </div>
      </div>

      <div className="splash-background">
        <div className="sphere sphere-1"></div>
        <div className="sphere sphere-2"></div>
        <div className="sphere sphere-3"></div>
      </div>
    </Box>
  );
};

export default Splash; 