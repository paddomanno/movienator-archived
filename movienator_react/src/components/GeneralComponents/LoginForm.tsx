import { Button, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { getOneUserToUserId } from '../../services/UserService';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

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

  function handleLoginClick(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    if (formValues.password !== '' && formValues.userName !== '') {
      getOneUserToUserId(formValues.userName).then((user) => {
        if (user != null) {
          if (user.password === formValues.password) {
            setCookie('userName', user.userName, { path: '/' });
            setCookie('userId', user.userId, { path: '/' });
            navigate('/home');
          } else {
            const textField: HTMLElement | null =
              document.getElementById(`password-input`);
            if (textField != null) {
              textField.style.backgroundColor = 'red';
            }
          }
        } else {
          const textField: HTMLElement | null =
            document.getElementById(`userName-input`);
          if (textField != null) {
            textField.style.backgroundColor = 'red';
          }
        }
      });
    } else {
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
          label={'password'}
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
    </>
  );
}
