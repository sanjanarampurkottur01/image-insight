import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { signUp, confirmSignup } from '../utils/auth';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [open, setOpen] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [cognitoUser, setCognitoUser] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      window.alert("Passwords do not match");
      return;
    }

    try {
      const user = await signUp(name, email, password);
      setCognitoUser(user);
      setOpen(true);
    } catch (err) {
      console.error("Error signing up:", err);
      window.alert(`Issue during Signup:\r\n${err.message || JSON.stringify(err)}`);
    }
  };

  const handleConfirm = async () => {
    if (!cognitoUser) {
      window.alert("No user to confirm");
      return;
    }

    try {
      const result = await confirmSignup(cognitoUser, confirmationCode);
      console.log('Confirmation result:', result);
      setOpen(false);
      window.alert("Signup confirmed! You can now log in.");
    } catch (err) {
      console.error("Error confirming signup:", err);
      window.alert(`Issue during Signup confirmation:\r\n${err.message || JSON.stringify(err)}`);
    }
  };

  return (
    <Box className="SignupPage" textAlign="center" mt={5}>
      <Typography variant="h4" gutterBottom>Sign Up</Typography>
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
          label="Full Name" 
          type="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          fullWidth 
          margin="normal"
        />
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
        <TextField 
          label="Confirm Password" 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
          fullWidth 
          margin="normal"
        />
        <Button type="submit" variant="contained" color="secondary" sx={{ mt: 2 }}>
          Sign Up
        </Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Confirm Signup</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the confirmation code sent to your email.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Confirmation Code"
            type="text"
            fullWidth
            variant="standard"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SignupPage;
