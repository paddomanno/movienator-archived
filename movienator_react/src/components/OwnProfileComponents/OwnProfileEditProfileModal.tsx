import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import EditIcon from '@mui/icons-material/Edit';
import { SingleUserProps } from '../../props/UserProps';
import { Card, CardContent, IconButton, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { useState } from 'react';
import { User } from '../../types/User';
import { updateUser } from '../../services/UserService';
import FeedbackSnackbar from '../GeneralComponents/FeedbackSnackbar';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { orange } from '@mui/material/colors';
import { ProfileImage } from '../../types/ProfileImage';
import {
  deleteUserImage,
  postImage,
  setUserImage,
} from '../../services/ProfileImageService';

export default function OwnProfileEditProfileModal({ user }: SingleUserProps) {
  type UserAttributes = {
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    birthday: Date;
    comment: string;
    image: string | undefined;
  };

  let defaultData: UserAttributes = {
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    password: user.password,
    birthday: user.birthday,
    comment: user.comment,
    image: user.profileImage?.ressourceLink,
  };

  const [userAttributes, setUserAttributes] =
    useState<UserAttributes>(defaultData);
  const [oldData, setOldData] = useState<UserAttributes>(defaultData);

  const [activateToggle, setActivateToggle] = useState<boolean>(false);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
    setOldData(userAttributes);
  };

  const handleCloseButton = () => {
    setOpen(false);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

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

  function saveEdit(e: any) {
    if (
      userAttributes.firstName !== '' &&
      userAttributes.lastName !== '' &&
      userAttributes.userName !== '' &&
      userAttributes.password !== ''
    ) {
      if (userAttributes.comment.length < 3000) {
        update();
      } else {
        handleErrorTextToLong();
      }
    } else {
      handleErrorFieldsEmpty();
    }
  }

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  function update() {
    let newUser: User = {
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
    if (userAttributes.image != undefined) {
      let newImage: ProfileImage = {
        name: userAttributes.image.toString(),
        ressourceLink: userAttributes.image.toString(),
        users: [],
      };
      postImage(newImage).then(() => {
        updateUser(newUser).then(() => {
          setUserImage(newImage.ressourceLink, newUser.userId!!).then(() => {
            setActivateToggle(false);
            window.location.reload();
          });
        });
      });
    } else {
      updateUser(newUser).then(() => {
        deleteUserImage(newUser.userId!!).then(() => {
          setActivateToggle(false);
          window.location.reload();
        });
      });
    }
  }

  function cancelEdit(e: any) {
    setUserAttributes(oldData);
    setOpen(false);
  }

  function handleErrorTextToLong() {
    let textField: HTMLElement | null =
      document.getElementById(`comment-input`);
    if (textField != null) {
      textField.style.backgroundColor = 'orange';
    }
  }

  function handleErrorFieldsEmpty() {
    (Object.keys(userAttributes) as (keyof UserAttributes)[]).forEach((key) => {
      if (userAttributes[key] === '') {
        let textField: HTMLElement | null = document.getElementById(
          `${key}-input`
        );
        if (textField != null) {
          textField.style.backgroundColor = 'orange';
        }
      }
    });
  }

  const style = {
    position: 'absolute' as 'absolute',
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
    <>
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
                defaultValue={
                  new Date(defaultData.birthday).getFullYear() +
                  '-' +
                  new Date(defaultData.birthday).getMonth() +
                  '-' +
                  new Date(defaultData.birthday).getDate()
                }
                // InputProps={{
                //   inputProps: { min: '', max: currentDateString },
                // }}
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
        activated={activateToggle}
        message={'Updated your user profile successfully!'}
      />
    </>
  );
}
