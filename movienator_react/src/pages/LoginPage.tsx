//Route: movienator3000.com/login
import { Button, Card, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginComponent from '../components/LoginComponent';

export default function LoginPage() {
  const navigate = useNavigate();
  function handleClick(e: any) {
    e.preventDefault();
    navigate('/signup');
  }
  return (
    <>
      <Card>
        <Typography>Sign into your Account</Typography>
        <LoginComponent />
        <Button variant={'contained'} onClick={handleClick}>
          I don't have an account
        </Button>
      </Card>
    </>
  );
}
