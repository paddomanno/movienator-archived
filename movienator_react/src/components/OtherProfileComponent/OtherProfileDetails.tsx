import {
  Avatar,
  Button,
  Card,
  CardContent,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { User } from '../../types/User';
import { useEffect, useState } from 'react';

interface OtherProfileDetailsProps {
  viewedUser: User | null;
  loggedInUser: User;
  onFollow: () => void;
  onUnfollow: () => void;
}

export default function OtherProfileDetails({
  viewedUser,
  loggedInUser,
  onFollow,
  onUnfollow,
}: OtherProfileDetailsProps) {
  const SIZE_PROFILEIMAGE = 300;
  //Boolean that says if the logged in user is following the viewed user or not
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (viewedUser) {
      setIsFollowing(
        viewedUser.followers.findIndex(
          (follower) => follower.userId === loggedInUser.userId
        ) >= 0
      );
    }
  }, [viewedUser, loggedInUser]);

  const handleFollow = () => {
    onFollow();
    setIsFollowing(true);
  };

  const handleUnfollow = () => {
    onUnfollow();
    setIsFollowing(false);
  };

  return (
    <Card variant="outlined">
      <CardContent>
        {viewedUser ? (
          <Stack direction={'row'} spacing={1} justifyContent={'space-evenly'}>
            <Card sx={{}} style={{ border: 'none', boxShadow: 'none' }}>
              <Paper>
                {viewedUser.profileImage != null ? (
                  <Avatar
                    alt={viewedUser.firstName + ' ' + viewedUser.lastName}
                    sx={{ width: SIZE_PROFILEIMAGE, height: SIZE_PROFILEIMAGE }}
                    src={`${process.env.PUBLIC_URL}/Images/ProfileImages/${viewedUser.profileImage.ressourceLink}.png`}
                  />
                ) : (
                  <Avatar
                    sx={{ width: SIZE_PROFILEIMAGE, height: SIZE_PROFILEIMAGE }}
                  >
                    {viewedUser.firstName.at(0)}
                    {viewedUser.lastName.at(0)}
                  </Avatar>
                )}
              </Paper>
            </Card>
            <Card sx={{}} style={{ border: 'none', boxShadow: 'none' }}>
              <CardContent>
                <Typography variant="h5">{viewedUser.userName}</Typography>
                <Typography variant={'body1'}>
                  {viewedUser.firstName} {viewedUser.lastName}
                </Typography>
                <Typography variant={'body1'}>
                  {new Date(viewedUser.birthday).getDate()}/
                  {new Date(viewedUser.birthday).getMonth()}/
                  {new Date(viewedUser.birthday).getFullYear()}
                </Typography>
                <Typography variant={'body1'}>{viewedUser.comment}</Typography>
              </CardContent>
            </Card>
            <Card sx={{}} style={{ border: 'none', boxShadow: 'none' }}>
              <Stack direction={'column'} spacing={1}>
                {isFollowing ? (
                  <Button variant={'outlined'} onClick={handleUnfollow}>
                    Unfollow
                  </Button>
                ) : (
                  <Button variant={'contained'} onClick={handleFollow}>
                    Follow
                  </Button>
                )}
                {/* <Button variant="outlined" startIcon={<ReviewsIcon />}>
                My Reviews
              </Button> */}
              </Stack>
            </Card>
          </Stack>
        ) : (
          <Typography>User not found</Typography>
        )}
      </CardContent>
    </Card>
  );
}
