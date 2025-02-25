import React, { useState } from 'react';
import {
  AlertColor,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getOneUserToUserId, createUser } from '../../services/UserService';
import { NullableUser } from '../../types/User';
import FeedbackSnackbar from './FeedbackSnackbar';

type InputValues = {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  repeatPassword: string;
  birthday: string;
};

export default function SignupForm() {
  const navigate = useNavigate();
  const defaultValues: InputValues = {
    firstName: '',
    lastName: '',
    userName: '',
    password: '',
    repeatPassword: '',
    birthday: '',
  };
  const [formValues, setFormValues] = useState<InputValues>(defaultValues);

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

  async function handleSubmit(e: React.MouseEvent): Promise<void> {
    e.preventDefault();
    // check for empty fields in the form
    if (Object.values(formValues).some((value) => value === '')) {
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

    try {
      const user = await getOneUserToUserId(formValues.userName);
      if (user !== null) {
        // username already taken
        const textField: HTMLElement | null =
          document.getElementById(`userName-input`);
        if (textField != null) {
          textField.style.backgroundColor = 'red';
        }
        setFeedbackMessage('Username already taken');
        setFeedbackColor('warning');
        setSnackbarOpen(true);
        return;
      }

      // username not taken yet
      if (formValues.password !== formValues.repeatPassword) {
        // password and repeat password don't match
        const textField: HTMLElement | null =
          document.getElementById(`repeatPassword-input`);
        if (textField != null) {
          textField.style.backgroundColor = 'red';
        }
        setFeedbackMessage("Passwords don't match");
        setFeedbackColor('warning');
        setSnackbarOpen(true);
        return;
      }

      // all good, create user
      const newUser: NullableUser = {
        userId: null,
        lastName: formValues.lastName,
        firstName: formValues.firstName,
        userName: formValues.userName,
        password: formValues.password,
        birthday: new Date(formValues.birthday),
        comment: '',
        profileImage: null,
        watchlist: [],
        followers: [],
        following: [],
        reviews: [],
      };
      //Save user to db and redirect to login
      const result = await createUser(newUser);
      if (result) {
        navigate('/login');
      } else {
        throw 'Error inserting User';
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

  return (
    <Paper>
      <Stack direction={'column'} spacing={1} alignItems={'center'}>
        <Typography variant={'h5'}>Register a new Account</Typography>
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
          type={'password'}
          value={formValues.password}
          onChange={handleInputChange}
        />
        <TextField
          sx={{ width: '50%' }}
          id={'repeatPassword-input'}
          name={'repeatPassword'}
          label={'repeatPassword'}
          type={'password'}
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
      <FeedbackSnackbar
        isOpen={snackbarOpen}
        setOpen={setSnackbarOpen}
        message={feedbackMessage}
        severity={feedbackColor}
      />
    </Paper>
  );
}
