import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { signIn } from '../utils/auth';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await signIn(email, password);
      console.log('Login successful:', result);
      Cookies.set("email", result.idToken.payload.email);
      Cookies.set("name", result.idToken.payload.name);
      Cookies.set("userId", result.idToken.payload.sub);
      Cookies.set("token", result);
      navigate("/gallery");
    } catch (err) {
      console.error('Login error:', err);
      window.alert(`Login failed:\r\n${err.message || JSON.stringify(err)}`);
    }
  };

  return (
    <Box className="LoginPage" textAlign="center" mt={5}>
      <Typography variant="h4" gutterBottom>Login</Typography>
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        display="flex" 
        flexDirection="column" 
        alignItems="center"
        width="100%"
        maxWidth="400px" // Adjust this value as needed
        margin="0 auto"
      >
        <TextField 
          label="Email" 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          fullWidth 
          margin="normal"
        />
        <TextField 
          label="Password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          fullWidth 
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
