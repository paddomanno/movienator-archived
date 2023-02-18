//Route: movienator3000.com/login
import { Card, Paper } from '@mui/material';
import React, { useEffect } from 'react';
import LoginForm from '../components/GeneralComponents/LoginForm';

export default function LoginPage() {
  useEffect(() => {
    document.title = 'Movienator3000 - Login';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Paper>
      <Card>
        <LoginForm />
      </Card>
    </Paper>
  );
}
