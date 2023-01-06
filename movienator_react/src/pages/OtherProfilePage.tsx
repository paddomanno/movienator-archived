//Route: movienator3000.com/user/:username

import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import { User } from '../types/User';
import { getOneUser } from '../services/UserService';
import OtherProfileDetails from '../components/OtherProfileComponent/OtherProfileDetails';
import OwnProfileUsersLists from '../components/OwnProfileComponents/OwnProfileUsersLists';
import { Review } from '../types/Review';
import { getReviewsToUser } from '../services/ReviewService';
import ReviewListWithText from '../components/ListComponents/ReviewListWithText';

export default function OtherProfilePage() {
  const navigate = useNavigate();

  //Gets the viewed user from the url
  const { userName } = useParams();

  const [cookies] = useCookies(['userName', 'userId']);
  const [user, setUser] = useState<User | null>(null);
  const [userReviews, setUserReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    if (!cookies.userName) {
      navigate('/login');
    }
    //if user is viewing his own user-url he will be redirected to his profile page
    if (userName === cookies.userName) {
      navigate('/profile');
    }
    getOneUser(userName!).then((user) => {
      setUser(user);
      getReviewsToUser(user!.userId!).then((reviews) => {
        setUserReviews(reviews);
      });
    });
  }, []);

  return (
    <Stack direction={'column'} spacing={1}>
      {user != null && userReviews != null ? (
        <>
          <OtherProfileDetails user={user} />
          <Stack direction={'row'} spacing={1} justifyContent={'space-evenly'}>
            <OwnProfileUsersLists
              title="Followers of this user:"
              users={user.followers}
            />
            <OwnProfileUsersLists
              title="This user follows:"
              users={user.following}
            />
          </Stack>
          <ReviewListWithText
            reviews={userReviews}
            showMovie={true}
            showUser={false}
            title={'Reviews from this user:'}
          />
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Stack>
  );
}
