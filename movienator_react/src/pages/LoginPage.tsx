//Route: movienator3000.com/login
import { Card, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginComponent from '../components/LoginComponent';

export default function LoginPage() {
  return (
    <>
      <Card>
        <Typography>Sign into your Account</Typography>
        <LoginComponent />
      </Card>
    </>
  );
}
