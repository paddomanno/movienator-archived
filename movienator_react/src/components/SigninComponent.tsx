import React, { useState } from 'react';
import { Button, Stack, TextField } from '@mui/material';

type InputValues = {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  repeatPassword: string;
  birthday: string;
};

export default function SigninComponent() {
  const defaultValues: InputValues = {
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
    repeatPassword: '',
    birthday: '',
  };
  const [formValues, setFormValues] = useState<InputValues>(defaultValues);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    if (value != '') {
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
    if (
      formValues.firstName != '' &&
      formValues.lastName != '' &&
      formValues.userName != '' &&
      formValues.password != '' &&
      formValues.repeatPassword != '' &&
      formValues.birthday != ''
    ) {
      //Check if username exists
      //Safe user
      //Redirect to login
    } else {
      (Object.keys(formValues) as (keyof InputValues)[]).forEach((key) => {
        if (formValues[key] == '') {
          let textField: HTMLElement | null = document.getElementById(
            `${key}-input`
          );
          if (textField != null) {
            textField.style.backgroundColor = 'orange';
          }
        }
      });
    }
    console.log(formValues);
  }

  return (
    <>
      <Stack direction={'column'} spacing={1} alignItems={'center'}>
        <TextField
          sx={{ width: '50%' }}
          id={'firstName-input'}
          name={'firstName'}
          label={'First Name'}
          type={'text'}
          value={formValues.firstName}
          onChange={handleInputChange}
        />
        <TextField
          sx={{ width: '50%' }}
          id={'lastName-input'}
          name={'lastName'}
          label={'Last Name'}
          type={'text'}
          value={formValues.lastName}
          onChange={handleInputChange}
        />
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
        <TextField
          sx={{ width: '50%' }}
          id={'repeatPassword-input'}
          name={'repeatPassword'}
          label={'repeatPassword'}
          type={'text'}
          value={formValues.repeatPassword}
          onChange={handleInputChange}
        />
        <TextField
          sx={{ width: '50%' }}
          id={'birthday-input'}
          name={'birthday'}
          type={'date'}
          onChange={handleInputChange}
        />
        <Button
          variant={'contained'}
          onClick={handleSubmit}
          sx={{ width: '50%' }}
        >
          Register
        </Button>
      </Stack>
    </>
  );
}
