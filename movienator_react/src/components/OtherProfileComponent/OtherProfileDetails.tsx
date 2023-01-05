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
import ReviewsIcon from '@mui/icons-material/Reviews';
import { grey } from '@mui/material/colors';
import { User } from '../../types/User';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {
  deleteFollowing,
  getFollowingToUser,
  getOneUser,
  insertFollowing,
} from '../../services/UserService';

type Props = {
  user: User;
};

export default function OtherProfileDetails({ user }: Props) {
  const SIZE_PROFILEIMAGE = 150;
  //Boolean that says if the logged in user is following the viewed user or not
  const [following, setFollowing] = useState<boolean>(false);
  //Is needed to check if the logged in user already is following the viewed user
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [viewedUser, setViewedUser] = useState<User | null>(user);

  const [cookies] = useCookies(['userName', 'userId']);

  useEffect(() => {
    //We dont check if there is a username in the cookies, since the parent component already does that
    getOneUser(cookies.userName).then((user) => {
      getFollowingToUser(user?.userId as number).then((following) => {
        console.log(following);
        //If the currently viewed user is contained in 'following' of the logged in user, the state following is set to true
        let followingTemp: boolean = false;
        following.forEach((user) => {
          if (user.userId === viewedUser!.userId) followingTemp = true;
        });
        setFollowing(followingTemp);
      });
      setLoggedInUser(user);
    });
  }, [following]);

  //Function to handle follow toggle
  function toggleFollowing(e: any) {
    e.preventDefault();
    //Change state following
    if (following === true) {
      //The logged in user unfollows the viewed user
      deleteFollowing(loggedInUser!.userId!, viewedUser!.userId!);
      setFollowing(false);
    } else {
      //The logged in user now follows the viewed user
      insertFollowing(loggedInUser!.userId!, viewedUser!.userId!);
      setFollowing(true);
    }
  }

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
              <Button variant={'outlined'} onClick={toggleFollowing}>
                {following == true ? 'Unfollow' : 'Follow'}
              </Button>
              {/* <Button variant="outlined" startIcon={<ReviewsIcon />}>
                My Reviews
              </Button> */}
            </Stack>
          </Card>
        </Stack>
      </CardContent>
    </Card>
  );
}
