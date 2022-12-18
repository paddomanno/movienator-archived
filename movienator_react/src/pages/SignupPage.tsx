//Route: movienator3000.com/signup
//https://onestepcode.com/creating-a-material-ui-form/ <- Guide for forms with mui
import React, { useState } from 'react';
import { Card, Typography } from '@mui/material';
import SigninComponent from '../components/SigninComponent';

export default function SignupPage() {
  return (
    <>
      <Card>
        <Typography>Register a new Account</Typography>
        <SigninComponent />
      </Card>
    </>
  );
}
