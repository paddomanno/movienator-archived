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
import { SingleUserProps } from '../../props/UserProps';
import OwnProfileEditProfileModal from './OwnProfileEditProfileModal';
import FeedbackSnackbar from '../GeneralComponents/FeedbackSnackbar';
import { useState } from 'react';
import React from 'react';

export default function OwnProfileDetails({ user }: SingleUserProps) {
  const SIZE_PROFILEIMAGE = 300;
  const [activated, setActivated] = useState<boolean>(false);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms)); // eher nicht die beste Lösung https://timmousk.com/blog/typescript-sleep/

  const url = 'http://localhost:3000/user/' + user.userName; // movienator3000.com/

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url); // https://www.kindacode.com/article/react-copy-to-clipboard-when-click-a-button-link/
    // alert('Link successfully copied!'); // besser: https://mui.com/material-ui/react-snackbar/#CustomizedSnackbars.tsx
    setActivated(true);
    await sleep(1000);
    setActivated(false);
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
              <OwnProfileEditProfileModal user={user} />
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
        activated={activated}
        message={'Copied the link successfully!'}
      />
    </Card>
  );
}
