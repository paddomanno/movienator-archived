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
import OtherProfileMutualWatchlist from '../components/OtherProfileComponent/OtherProfileMutualWatchlist';
import {
  getMutualReviewed,
  getMutualWatchlist,
} from '../services/MovieService';
import { Movie } from '../types/Movie';
import OtherProfileMutualReviewed from '../components/OtherProfileComponent/OtherProfileMutualReviewed';

type props = {
  user: User;
  reloadHandler: () => void;
};

export default function OtherProfilePage() {
  const navigate = useNavigate();

  //Gets the viewed user from the url
  const { userId } = useParams();

  const [cookies] = useCookies(['userName', 'userId']);
  const [user, setUser] = useState<User | null>(null);
  const [userReviews, setUserReviews] = useState<Review[] | null>(null);
  const [mutualWatchlist, setMutualWatchlist] = useState<Movie[] | null>(null);
  const [mutualReviewed, setMutualReviewed] = useState<Movie[] | null>(null);

  useEffect(() => {
    if (!cookies.userName) {
      navigate('/login');
    }
    getOneUser(userId!).then((user) => {
      setUser(user);
      if (user != null && user.userId != null) {
        getReviewsToUser(user.userId!).then((reviews) => {
          setUserReviews(reviews);
        });
        getMutualWatchlist(user.userId, cookies.userId).then((movies) => {
          setMutualWatchlist(movies);
        });
        getMutualReviewed(user.userId, cookies.userId).then((movies) => {
          setMutualReviewed(movies);
        });
      }
    });
  }, []);

  useEffect(() => {
    if (userId === cookies.userId) {
      navigate('/profile');
    }
  }, [userId]);

  function reloadViewedUser() {
    getOneUser(user?.userName!).then((user) => {
      setUser(user);
      console.log(user?.followers);
    });
  }

  return (
    <Stack direction={'column'} spacing={1}>
      {user != null &&
      userReviews != null &&
      mutualReviewed != null &&
      mutualWatchlist != null ? (
        <>
          <OtherProfileDetails
            user={user}
            reloadViewedUser={reloadViewedUser}
          />
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
          <Stack direction={'row'} spacing={1} justifyContent={'space-evenly'}>
            <OtherProfileMutualWatchlist movies={mutualWatchlist} />
            <OtherProfileMutualReviewed movies={mutualReviewed} />
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
