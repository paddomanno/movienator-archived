//Route: movienator3000.com/signup
//https://onestepcode.com/creating-a-material-ui-form/ <- Guide for forms with mui
import { Card } from '@mui/material';
import SignupForm from '../components/GeneralComponents/SignupForm';

export default function SignupPage() {
  return (
    <>
      <Card>
        <SignupForm />
      </Card>
    </>
  );
}
