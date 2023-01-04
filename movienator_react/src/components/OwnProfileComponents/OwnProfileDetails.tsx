import {
  Avatar,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import { grey } from '@mui/material/colors';
import { SingleUserProps } from '../../props/UserProps';
import OwnProfileEditProfileModal from './OwnProfileEditProfileModal';

export default function OwnProfileDetails({ user }: SingleUserProps) {
  const SIZE_PROFILEIMAGE = 300;

  const url = 'http://localhost:3000/user/' + user.userName; // movienator3000.com/

  const copyUrl = async () => {
    await navigator.clipboard.writeText(url); // https://www.kindacode.com/article/react-copy-to-clipboard-when-click-a-button-link/
    // alert('Link successfully copied!'); // besser: https://mui.com/material-ui/react-snackbar/#CustomizedSnackbars.tsx
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
                  alt={user.firstName + ' ' + user.lastName}
                  src={user.profileImage.ressourceLink}
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
                {new Date(user.birthday).getMonth()}/
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
    </Card>
  );
}
