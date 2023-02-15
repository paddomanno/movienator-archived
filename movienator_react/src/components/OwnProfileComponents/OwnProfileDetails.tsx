import {
  Avatar,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import { grey } from '@mui/material/colors';
import OwnProfileEditProfileModal from './OwnProfileEditProfileModal';
import FeedbackSnackbar from '../GeneralComponents/FeedbackSnackbar';
import { useState } from 'react';
import React from 'react';
import { User } from '../../types/User';

type props = {
  user: User;
  reloadHandler: () => void;
};
export default function OwnProfileDetails({ user, reloadHandler }: props) {
  const SIZE_PROFILEIMAGE = 300;
  //To handle the hate speech reminder snackbar
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const url = 'http://localhost:3000/user/' + user.userId; // movienator3000.com/

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url); // https://www.kindacode.com/article/react-copy-to-clipboard-when-click-a-button-link/
    setSnackbarOpen(true);
  };

  return (
    <Card sx={{ backgroundColor: grey.A200 }}>
      <CardContent>
        <Stack direction={'row'} spacing={1} justifyContent={'space-evenly'}>
          <Card
            sx={{ backgroundColor: grey.A200 }}
            style={{ border: 'none', boxShadow: 'none' }}
          >
            <>
              {user.profileImage != null ? (
                <Avatar
                  sx={{ width: SIZE_PROFILEIMAGE, height: SIZE_PROFILEIMAGE }}
                  alt={user.firstName + ' ' + user.lastName}
                  src={`${process.env.PUBLIC_URL}/Images/ProfileImages/${user.profileImage.ressourceLink}.png`}
                />
              ) : (
                <Avatar
                  sx={{ width: SIZE_PROFILEIMAGE, height: SIZE_PROFILEIMAGE }}
                >
                  {user.firstName.at(0)}
                  {user.lastName.at(0)}
                </Avatar>
              )}
            </>
          </Card>
          <Card
            sx={{ backgroundColor: grey.A200 }}
            style={{ border: 'none', boxShadow: 'none' }}
          >
            <CardContent>
              <Typography variant="h5">{user.userName}</Typography>
              <Typography variant={'body1'}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant={'body1'}>
                {new Date(user.birthday).getDate()}/
                {new Date(user.birthday).getMonth() + 1}/
                {new Date(user.birthday).getFullYear()}
              </Typography>
              <Typography variant={'body1'}>{user.comment}</Typography>
            </CardContent>
          </Card>
          <Card
            sx={{ backgroundColor: grey.A200 }}
            style={{ border: 'none', boxShadow: 'none' }}
          >
            <Stack direction={'column'} spacing={1}>
              <OwnProfileEditProfileModal
                user={user}
                reloadHandler={reloadHandler}
              />
              <Button
                variant="outlined"
                startIcon={<ShareIcon />}
                onClick={copyUrl}
              >
                Copy Profilelink
              </Button>
            </Stack>
          </Card>
        </Stack>
      </CardContent>
      <FeedbackSnackbar
        isOpen={snackbarOpen}
        setOpen={setSnackbarOpen}
        message={'Copied the link successfully!'}
        severity={'success'}
      />
    </Card>
  );
}
