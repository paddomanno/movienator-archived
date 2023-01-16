import {
  Avatar,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { User } from '../../types/User';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import {
  removeUserIdBFromFollowingOfUserIdA,
  getFollowingToUserId,
  getOneUserToUserId,
  insertFollowingToUserIdAndUserId,
} from '../../services/UserService';
import { getRecommendationForUserList } from '../../services/RecommendationService';

type props = {
  user: User;
  reloadViewedUser: () => void;
};

export default function OtherProfileDetails({ user, reloadViewedUser }: props) {
  const SIZE_PROFILEIMAGE = 300;
  //Boolean that says if the logged in user is following the viewed user or not
  const [following, setFollowing] = useState<boolean>(true);
  //Is needed to check if the logged in user already is following the viewed user
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [viewedUser, setViewedUser] = useState<User | null>(user);

  const [cookies] = useCookies(['userName', 'userId']);

  useEffect(() => {
    //let testInput: User[] = [];
    //testInput.push(viewedUser!);

    //We dont check if there is a username in the cookies, since the parent component already does that
    getOneUserToUserId(cookies.userName).then((user) => {
      console.log(
        'Amount of users the logged in user is following ' +
          user?.following.length
      );
      let testInput: User[] = user?.following!;
      getRecommendationForUserList(testInput);
      getFollowingToUserId(user?.userId as number).then((following) => {
        //If the currently viewed user is contained in 'following' of the logged in user, the state following is set to true
        let followingTemp: boolean = false;
        following.forEach((user) => {
          if (user.userId === viewedUser!.userId) followingTemp = true;
        });
        setFollowing(followingTemp);
      });
      setLoggedInUser(user);
    });
  }, [following, user]);

  //Function to handle follow toggle
  function toggleFollowing(e: any) {
    e.preventDefault();
    //Change state following
    if (following === true) {
      //The logged in user unfollows the viewed user
      removeUserIdBFromFollowingOfUserIdA(
        loggedInUser!.userId!,
        viewedUser!.userId!
      ).then((success) => {
        reloadViewedUser();
        setFollowing(false);
      });
    } else {
      //The logged in user now follows the viewed user
      insertFollowingToUserIdAndUserId(
        loggedInUser!.userId!,
        viewedUser!.userId!
      ).then((success) => {
        reloadViewedUser();
        setFollowing(true);
      });
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
                  sx={{ width: SIZE_PROFILEIMAGE, height: SIZE_PROFILEIMAGE }}
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
                {following ? 'Unfollow' : 'Follow'}
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
