import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import EditIcon from '@mui/icons-material/Edit';
import { Card, CardContent, IconButton, Paper, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { useState } from 'react';
import { User } from '../../types/User';
import { updateUser } from '../../services/UserService';
import FeedbackSnackbar from '../GeneralComponents/FeedbackSnackbar';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { orange } from '@mui/material/colors';
import { ProfileImage } from '../../types/ProfileImage';
import {
  deleteUserImageToUserId,
  createImage,
  updateUserImageToImageIdAndUserId,
} from '../../services/ProfileImageService';
import { AlertColor } from '@mui/material/Alert';
import moment from 'moment';

type UserAttributes = {
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
  birthday: Date;
  comment: string;
  image: string | undefined;
  [key: string]: string | Date | undefined; // index signature helps to maintain type safety by providing a more specific type for the properties accessed by string keys
};
type props = {
  user: User;
  reloadHandler: () => void;
};
export default function OwnProfileEditProfileModal({
  user,
  reloadHandler,
}: props) {
  const defaultData: UserAttributes = {
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    password: user.password,
    birthday: user.birthday,
    comment: user.comment,
    image: user.profileImage?.ressourceLink,
  };

  const requiredFields = ['firstName', 'lastName', 'userName', 'password'];

  const MAX_COMMENT_LENGTH = 3000;

  const [userAttributes, setUserAttributes] =
    useState<UserAttributes>(defaultData);
  const [oldData, setOldData] = useState<UserAttributes>(defaultData);
  const [open, setOpen] = useState<boolean>(false);

  //To handle the hate speech reminder snackbar
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackColor, setFeedbackColor] = useState<AlertColor>('info');

  const handleOpen = () => {
    setOpen(true);
    setOldData(userAttributes);
  };

  const handleCloseButton = () => {
    setOpen(false);
  };

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
    setUserAttributes({
      ...userAttributes,
      [name]: value,
    });
  };

  function handleImageClick(newImage: number) {
    setUserAttributes({
      ...userAttributes,
      ['image']: newImage.toString(),
    });
  }

  function handleRemoveClick() {
    setUserAttributes({
      ...userAttributes,
      ['image']: undefined,
    });
  }

  function saveEdit(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    // check for empty required fields
    if (
      requiredFields.some((field): boolean => {
        const value = userAttributes[field];
        return typeof value === 'string' && value.trim() === '';
      })
    ) {
      handleErrorFieldsEmpty();
      return;
    }
    // check comment length
    if (userAttributes.comment.length > MAX_COMMENT_LENGTH) {
      handleErrorTextToLong();
      return;
    }
    processUpdate();
  }

  async function processUpdate() {
    if (!user || !user.userId) {
      return;
    }
    const newUser: User = {
      userId: user.userId,
      firstName: userAttributes.firstName,
      lastName: userAttributes.lastName,
      userName: user.userName,
      password: userAttributes.password,
      comment: userAttributes.comment,
      birthday: userAttributes.birthday,
      profileImage: user.profileImage,
      reviews: user.reviews,
      following: user.following,
      followers: user.followers,
      watchlist: user.watchlist,
    };

    try {
      // update user in db and create/remove image as neccessary
      if (userAttributes.image === undefined) {
        await updateUser(newUser);
        await deleteUserImageToUserId(newUser.userId);
      } else {
        const newImage: ProfileImage = {
          name: userAttributes.image.toString(),
          ressourceLink: userAttributes.image.toString(),
          users: [],
        };
        await createImage(newImage);
        await updateUser(newUser);
        await updateUserImageToImageIdAndUserId(
          newImage.ressourceLink,
          newUser.userId
        );
      }
      setFeedbackMessage('Changes saved');
      setFeedbackColor('success');
      setSnackbarOpen(true);
      reloadHandler();
      return;
    } catch (error) {
      setFeedbackMessage('Error saving changes');
      setFeedbackColor('error');
      setSnackbarOpen(true);
      reloadHandler();
      return;
    }
  }

  function cancelEdit(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    setUserAttributes(oldData);
    setOpen(false);
  }

  function handleErrorTextToLong() {
    const textField: HTMLElement | null =
      document.getElementById(`comment-input`);
    if (textField != null) {
      textField.style.backgroundColor = 'orange';
      setFeedbackMessage(
        `Text is too long (max ${MAX_COMMENT_LENGTH} characters)`
      );
      setFeedbackColor('warning');
      setSnackbarOpen(true);
    }
  }

  function handleErrorFieldsEmpty() {
    (Object.keys(userAttributes) as (keyof UserAttributes)[]).forEach((key) => {
      if (userAttributes[key] === '') {
        const textField: HTMLElement | null = document.getElementById(
          `${key}-input`
        );
        if (textField != null) {
          textField.style.backgroundColor = 'orange';
        }
      }
    });
    setFeedbackMessage('Please fill out all fields');
    setFeedbackColor('warning');
    setSnackbarOpen(true);
  }

  const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '50%',
    bgcolor: 'background.paper',
    border: '0.5px solid #585858',
    boxShadow: 24,
    p: 6,
    overflow: 'hidden',
    overflowY: 'scroll',
  };

  const textFieldStyle = {
    width: '50%',
    p: 0.5,
  };

  const nestedBoxSytle = {
    mt: 2,
  };

  return (
    <Paper>
      <Button variant="outlined" startIcon={<EditIcon />} onClick={handleOpen}>
        Edit Profile
      </Button>
      <Modal
        open={open}
        onClose={handleCloseButton}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update your user profile
          </Typography>
          <Box sx={nestedBoxSytle}>
            <Stack direction={'row'}>
              <TextField
                sx={textFieldStyle}
                id={'firstName-input'}
                name={'firstName'}
                label={'First Name'}
                InputLabelProps={{ shrink: true, required: true }}
                type={'text'}
                defaultValue={defaultData.firstName}
                onChange={handleInputChange}
              />
              <TextField
                sx={textFieldStyle}
                id={'lastName-input'}
                name={'lastName'}
                label={'Last Name'}
                InputLabelProps={{ shrink: true, required: true }}
                type={'text'}
                defaultValue={defaultData.lastName}
                onChange={handleInputChange}
              />
            </Stack>
          </Box>
          <Box sx={nestedBoxSytle}>
            <Stack direction={'row'}>
              <TextField
                sx={textFieldStyle}
                id={'birthday-input'}
                name={'birthday'}
                label={'birthday'}
                InputLabelProps={{ shrink: true, required: true }}
                type={'date'}
                defaultValue={moment(defaultData.birthday).format('YYYY-MM-DD')}
                onChange={handleInputChange}
              />
              <TextField
                sx={textFieldStyle}
                id={'password-input'}
                name={'password'}
                label={'password'}
                InputLabelProps={{ shrink: true, required: true }}
                type={'text'}
                defaultValue={defaultData.password}
                onChange={handleInputChange}
              />
            </Stack>
          </Box>
          <Box sx={nestedBoxSytle}>
            <TextField
              sx={{ width: '98%', p: 1 }}
              id={'comment-input'}
              name={'comment'}
              label={'comment'}
              type={'text'}
              defaultValue={defaultData.comment}
              multiline={true}
              minRows={7}
              maxRows={12}
              onChange={handleInputChange}
            />
          </Box>
          <Card>
            <CardContent>
              <Stack direction={'row'} justifyContent={'space-evenly'}>
                {[...Array(5)].map((x, i) => (
                  <IconButton
                    key={i}
                    sx={{
                      backgroundColor:
                        userAttributes.image != undefined &&
                        i + 1 == parseInt(userAttributes.image)
                          ? orange.A200
                          : '',
                    }}
                    onClick={() => {
                      handleImageClick(i + 1);
                    }}
                  >
                    <Box
                      component={'img'}
                      sx={{ height: 100, width: 100 }}
                      src={`${process.env.PUBLIC_URL}/Images/ProfileImages/${
                        i + 1
                      }.png`}
                    />
                  </IconButton>
                ))}
                <IconButton
                  onClick={() => {
                    handleRemoveClick();
                  }}
                >
                  <HighlightOffIcon fontSize={'large'} />
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
          <Stack direction={'row'} justifyContent={'space-evenly'}>
            <Button
              variant={'contained'}
              onClick={cancelEdit}
              sx={{ width: '30%', p: 1 }}
            >
              Cancel
            </Button>
            <Button
              variant={'contained'}
              onClick={saveEdit}
              sx={{ width: '30%', p: 1 }}
            >
              Update
            </Button>
          </Stack>
        </Box>
      </Modal>
      <FeedbackSnackbar
        isOpen={snackbarOpen}
        setOpen={setSnackbarOpen}
        message={feedbackMessage}
        severity={feedbackColor}
      />
    </Paper>
  );
}
