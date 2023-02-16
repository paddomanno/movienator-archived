//Route: movienator3000.com/signup
//https://onestepcode.com/creating-a-material-ui-form/ <- Guide for forms with mui
import { Card } from '@mui/material';
import { useEffect } from 'react';
import SignupForm from '../components/GeneralComponents/SignupForm';

export default function SignupPage() {
  useEffect(() => {
    document.title = 'Movienator3000 - Signup';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Card>
        <SignupForm />
      </Card>
    </>
  );
}
