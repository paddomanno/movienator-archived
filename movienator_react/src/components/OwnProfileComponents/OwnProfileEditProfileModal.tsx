import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import EditIcon from '@mui/icons-material/Edit';
import { SingleUserProps } from '../../props/UserProps';
import { TextField } from '@mui/material';
import { Stack } from '@mui/system';
import { useState } from 'react';
import { User } from '../../types/User';
import { updateUser } from '../../services/UserService';

export default function OwnProfileEditProfileModal({ user }: SingleUserProps) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '0.5px solid #000',
    boxShadow: 24,
    p: 4,
  };

  type UserAttributes = {
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    birthday: Date;
    comment: string;
  };

  let defaultData: UserAttributes = {
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    password: user.password,
    birthday: user.birthday,
    comment: user.comment,
  };

  const [userAttributes, setUserAttributes] =
    useState<UserAttributes>(defaultData);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setUserAttributes({
      ...userAttributes,
      [name]: value,
    });
  };

  function saveEdit(e: any) {
    if (
      userAttributes.firstName !== '' &&
      userAttributes.lastName !== '' &&
      userAttributes.userName !== '' &&
      userAttributes.password !== ''
    ) {
      if (userAttributes.comment.length < 3000) {
        // check if username already exists -> error
        update();
        // refresh page
        // window.location.reload();
        setOpen(false);
      } else {
        // handleErrorTextToLong();
      }
    } else {
      // handleErrorFieldsEmpty();
    }
  }

  function update() {
    let newUser: User = {
      userId: user.userId,
      firstName: userAttributes.firstName,
      lastName: userAttributes.lastName,
      userName: userAttributes.userName,
      password: userAttributes.password,
      comment: userAttributes.comment,
      birthday: userAttributes.birthday, //
      profileImage: user.profileImage,
      reviews: user.reviews,
      following: user.following,
      followers: user.followers,
      watchlist: user.watchlist,
    };

    updateUser(newUser).then((user) => {
      if (!user) {
        console.log('Error updating user!');
      } else {
        console.log(newUser);
        window.location.reload();
      }
    });
  }

  function cancelEdit(e: any) {
    setOpen(false);
  }

  return (
    <div>
      <Button variant="outlined" startIcon={<EditIcon />} onClick={handleOpen}>
        Edit Profile
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update your user profile
          </Typography>
          <TextField
            sx={{ width: '50%', padding: '1' }}
            id={'firstName-input'}
            name={'firstName'}
            label={'First Name'}
            type={'text'}
            defaultValue={defaultData.firstName}
            onChange={handleInputChange}
          />
          <TextField
            sx={{ width: '50%' }}
            id={'lastName-input'}
            name={'lastName'}
            label={'Last Name'}
            type={'text'}
            defaultValue={defaultData.lastName}
            onChange={handleInputChange}
          />
          <TextField
            sx={{ width: '50%', padding: '1' }}
            id={'userName-input'}
            name={'userName'}
            label={'Username'}
            type={'text'}
            defaultValue={defaultData.userName}
            onChange={handleInputChange}
          />
          <TextField
            sx={{ width: '50%', padding: '1' }}
            id={'password-input'}
            name={'password'}
            label={'password'}
            type={'text'}
            defaultValue={defaultData.password}
            onChange={handleInputChange}
          />
          <TextField
            sx={{ width: '50%', padding: '1' }}
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
          <TextField
            sx={{ width: '50%', padding: '1' }}
            id={'birthday-input'}
            name={'birthday'}
            type={'date'}
            defaultValue={defaultData.birthday}
            onChange={handleInputChange}
          />
          <Stack direction={'row'}>
            <Button
              variant={'contained'}
              onClick={cancelEdit}
              sx={{ width: '50%' }}
            >
              Cancel
            </Button>
            <Button
              variant={'contained'}
              onClick={saveEdit}
              sx={{ width: '50%' }}
            >
              Update
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
