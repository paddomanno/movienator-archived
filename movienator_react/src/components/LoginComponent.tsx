import { Button, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { getOneUser } from '../services/UserService';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

type InputValues = {
  userName: string;
  password: string;
};
export default function LoginComponent() {
  const navigate = useNavigate();
  let defaultValues: InputValues = {
    userName: '',
    password: '',
  };
  const [formValues, setFormValues] = useState<InputValues>(defaultValues);
  const [cookies, setCookie] = useCookies(['userName']);
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (value !== '') {
      let textField: HTMLElement | null = document.getElementById(
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

  function handleSubmit(e: any) {
    e.preventDefault();
    if (formValues.password !== '' && formValues.userName !== '') {
      getOneUser(formValues.userName).then((user) => {
        if (user != null) {
          if (user.password === formValues.password) {
            setCookie('userName', user.userName, { path: '/' });
            navigate('/home');
          } else {
            let textField: HTMLElement | null =
              document.getElementById(`password-input`);
            if (textField != null) {
              textField.style.backgroundColor = 'red';
            }
          }
        } else {
          let textField: HTMLElement | null =
            document.getElementById(`userName-input`);
          if (textField != null) {
            textField.style.backgroundColor = 'red';
          }
        }
      });
    } else {
      (Object.keys(formValues) as (keyof InputValues)[]).forEach((key) => {
        if (formValues[key] === '') {
          let textField: HTMLElement | null = document.getElementById(
            `${key}-input`
          );
          if (textField != null) {
            textField.style.backgroundColor = 'orange';
          }
        }
      });
    }
  }
  function handleClick(e: any) {
    e.preventDefault();
    navigate('/signup');
  }

  return (
    <>
      <Stack direction={'column'} spacing={1} alignItems={'center'}>
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
          type={'text'}
          value={formValues.password}
          onChange={handleInputChange}
        />
        <Button variant={'contained'} onClick={handleSubmit}>
          Login
        </Button>
        <Button variant={'contained'} onClick={handleClick}>
          I don't have an account
        </Button>
      </Stack>
    </>
  );
}
