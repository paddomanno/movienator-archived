import {
  AlertColor,
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { getOneUserToUserId } from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import FeedbackSnackbar from './FeedbackSnackbar';

type InputValues = {
  userName: string;
  password: string;
};
export default function LoginForm() {
  const navigate = useNavigate();
  const defaultValues: InputValues = {
    userName: '',
    password: '',
  };
  const [formValues, setFormValues] = useState<InputValues>(defaultValues);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cookies, setCookie] = useCookies(['userName', 'userId']);

  //To handle the hate speech reminder snackbar
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackColor, setFeedbackColor] = useState<AlertColor>('info');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    if (value !== '') {
      const textField: HTMLElement | null = document.getElementById(
        `${name}-input`
      );
      if (textField != null) {
        textField.style.backgroundColor = 'white';
      }
    }
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  async function handleLoginClick(
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> {
    e.preventDefault();
    if (formValues.password === '' || formValues.userName === '') {
      // mark empty fields with color
      (Object.keys(formValues) as (keyof InputValues)[]).forEach((key) => {
        if (formValues[key] === '') {
          const textField: HTMLElement | null = document.getElementById(
            `${key}-input`
          );
          if (textField != null) {
            textField.style.backgroundColor = 'orange';
          }
        }
      });
      return;
    }

    // check login credentials
    try {
      const user = await getOneUserToUserId(formValues.userName);
      if (user === null) {
        // user not found
        // this does the same as wrong password on purpose
        const textFieldPassw: HTMLElement | null =
          document.getElementById(`password-input`);
        if (textFieldPassw != null) {
          textFieldPassw.style.backgroundColor = 'red';
        }
        const textFieldUser: HTMLElement | null =
          document.getElementById(`userName-input`);
        if (textFieldUser != null) {
          textFieldUser.style.backgroundColor = 'red';
        }
        setFeedbackMessage('Invalid username or password');
        setFeedbackColor('warning');
        setSnackbarOpen(true);
        return;
      }
      // user found, now check password
      if (user.password === formValues.password) {
        setCookie('userName', user.userName, { path: '/' });
        setCookie('userId', user.userId, { path: '/' });
        navigate('/home');
      } else {
        // wrong password
        // this does the same as user not found on purpose
        const textFieldPassw: HTMLElement | null =
          document.getElementById(`password-input`);
        if (textFieldPassw != null) {
          textFieldPassw.style.backgroundColor = 'red';
        }
        const textFieldUser: HTMLElement | null =
          document.getElementById(`userName-input`);
        if (textFieldUser != null) {
          textFieldUser.style.backgroundColor = 'red';
        }
        setFeedbackMessage('Invalid username or password');
        setFeedbackColor('warning');
        setSnackbarOpen(true);
      }
    } catch (err: unknown) {
      if (!(err instanceof Error)) {
        throw err;
      }
      setFeedbackMessage(err.message);
      setFeedbackColor('error');
      setSnackbarOpen(true);
    }
  }

  function handleSignupClick(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    navigate('/signup');
  }

  return (
    <>
      <Stack direction={'column'} spacing={1} alignItems={'center'}>
        <Typography variant={'h5'}>Sign into your Account</Typography>
        <TextField
          sx={{ width: '50%' }}
          id={'userName-input'}
          name={'userName'}
          label={'Username'}
          type={'text'}
          value={formValues.userName}
          onChange={handleInputChange}
        />
        <TextField
          sx={{ width: '50%' }}
          id={'password-input'}
          name={'password'}
          label={'Password'}
          type={'password'}
          value={formValues.password}
          onChange={handleInputChange}
        />
        <Button variant={'contained'} onClick={handleLoginClick}>
          Login
        </Button>
        <Button variant={'contained'} onClick={handleSignupClick}>
          I don&apos;t have an account
        </Button>
      </Stack>
      <FeedbackSnackbar
        isOpen={snackbarOpen}
        setOpen={setSnackbarOpen}
        message={feedbackMessage}
        severity={feedbackColor}
      />
    </>
  );
}
