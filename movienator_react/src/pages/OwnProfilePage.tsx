//Route: movienator3000.com/profile
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import { User } from '../types/User';
import { getOneUser } from '../services/UserService';
import OwnProfileDetails from '../components/OwnProfileComponents/OwnProfileDetails';
import OwnProfileUsersLists from '../components/OwnProfileComponents/OwnProfileUsersLists';
import { Review } from '../types/Review';
import { getReviewsToUser } from '../services/ReviewService';
import ReviewListWithText from '../components/ListComponents/ReviewListWithText';
import OwnProfileUserSearch from '../components/OwnProfileComponents/OwnProfileUserSearch';

export default function OwnProfilePage() {
  const navigate = useNavigate();
  const [cookies] = useCookies(['userName', 'userId']);
  const [user, setUser] = useState<User | null>(null);
  const [userReviews, setUserReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    if (!cookies.userName) {
      navigate('/login');
    }
    getOneUser(cookies.userName).then((user) => {
      setUser(user);
    });
    getReviewsToUser(cookies.userId).then((reviews) => {
      setUserReviews(reviews);
    });
  }, []);

  function reloadUser() {
    getOneUser(cookies.userName).then((user) => {
      setUser(user);
    });
  }

  return (
    <Stack direction={'column'} spacing={1}>
      {user != null && userReviews != null ? (
        <>
          <OwnProfileDetails user={user} reloadHandler={reloadUser} />
          <Stack direction={'row'} spacing={1} justifyContent={'space-evenly'}>
            <OwnProfileUsersLists
              title="Your Followers:"
              users={user.followers}
            />
            <OwnProfileUsersLists title="You follow:" users={user.following} />
          </Stack>
          <OwnProfileUserSearch />
          <ReviewListWithText
            reviews={userReviews}
            showMovie={true}
            showUser={false}
            title={'Your Reviews'}
          />
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Stack>
  );
}
