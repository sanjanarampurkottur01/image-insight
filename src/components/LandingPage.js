import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import photoStorage from '../assets/image-file.png';
import Cookies from 'js-cookie';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if(Cookies.get("email")) {
      navigate("/gallery")
    }
  });

  return (
    <Box className="LandingPage" textAlign="center">
      <header>
        <img src={photoStorage} alt="App for Storage" />
        <Typography variant="h2" gutterBottom>Welcome to ImageInsight</Typography>
        <Box mt={2}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="primary" style={{ margin: '0 10px' }}>Login</Button>
          </Link>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <Button variant="contained" color="secondary" style={{ margin: '0 10px' }}>Sign Up</Button>
          </Link>
        </Box>
      </header>
    </Box>
  );
};

export default LandingPage;
