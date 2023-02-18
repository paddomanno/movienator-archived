//Route: movienator3000.com/user/:username

import { useState, useEffect, useCallback } from 'react';
import { useCookies } from 'react-cookie';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Stack, Typography } from '@mui/material';
import { User } from '../types/User';
import {
  getOneUserToUserId,
  insertFollowingToUserIdAndUserId,
  removeUserIdBFromFollowingOfUserIdA,
} from '../services/UserService';
import OtherProfileDetails from '../components/OtherProfileComponent/OtherProfileDetails';
import OwnProfileUsersLists from '../components/OwnProfileComponents/OwnProfileUsersLists';
import { Review } from '../types/Review';
import { getAllReviewsToUserId } from '../services/ReviewService';
import ReviewListWithText from '../components/ListComponents/ReviewListWithText';
import OtherProfileMutualWatchlist from '../components/OtherProfileComponent/OtherProfileMutualWatchlist';
import {
  getMutualReviewedToTwoUserIds,
  getMutualWatchlistToTwoUserIds,
} from '../services/MovieService';
import { Movie } from '../types/Movie';
import OtherProfileMutualReviewed from '../components/OtherProfileComponent/OtherProfileMutualReviewed';

export default function OtherProfilePage() {
  const navigate = useNavigate();

  //Gets the viewed user from the url
  const { userId } = useParams();
  const [cookies] = useCookies(['userName', 'userId']);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [viewedUser, setViewedUser] = useState<User | null>(null);
  const [userReviews, setUserReviews] = useState<Review[] | null>(null);
  const [mutualWatchlist, setMutualWatchlist] = useState<Movie[] | null>(null);
  const [mutualReviewed, setMutualReviewed] = useState<Movie[] | null>(null);

  const handleFollow = async () => {
    if (
      !loggedInUser ||
      !loggedInUser.userId ||
      !viewedUser ||
      !viewedUser.userId
    ) {
      return;
    }
    await insertFollowingToUserIdAndUserId(
      loggedInUser.userId,
      viewedUser.userId
    );
    const updatedUser = await getOneUserToUserId(viewedUser.userId);
    setViewedUser(updatedUser);
  };

  const handleUnfollow = async () => {
    if (
      !loggedInUser ||
      !loggedInUser.userId ||
      !viewedUser ||
      !viewedUser.userId
    ) {
      return;
    }
    await removeUserIdBFromFollowingOfUserIdA(
      loggedInUser.userId,
      viewedUser.userId
    );
    const updatedUser = await getOneUserToUserId(viewedUser.userId);
    setViewedUser(updatedUser);
  };

  // get logged-in user from cookies and viewed user from url
  useEffect(() => {
    if (!cookies.userName) {
      navigate('/login');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserData = useCallback(
    async (id: number) => {
      const user = await getOneUserToUserId(id);
      if (!user || !user.userId) {
        return;
      }

      setViewedUser(user);
      getAllReviewsToUserId(user.userId).then((reviews) => {
        setUserReviews(reviews);
      });
      getMutualWatchlistToTwoUserIds(user.userId, cookies.userId).then(
        (movies) => {
          setMutualWatchlist(movies);
        }
      );
      getMutualReviewedToTwoUserIds(user.userId, cookies.userId).then(
        (movies) => {
          setMutualReviewed(movies);
        }
      );
    },
    [cookies.userId]
  );

  useEffect(() => {
    if (viewedUser) {
      document.title = viewedUser?.userName + "'s Profile";
    } else {
      document.title = 'Profile Page';
    }
  }, [viewedUser]);

  useEffect(() => {
    // get logged-in user from cookies
    getOneUserToUserId(cookies.userName).then((user) => {
      setLoggedInUser(user);
    });

    if (!userId) {
      return;
    }

    if (userId === cookies.userId) {
      // forward to own profile page
      navigate('/profile', { replace: true });
    } else {
      // get the viewed user's data
      loadUserData(parseInt(userId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <Stack direction={'column'} spacing={1}>
      {viewedUser != null &&
      loggedInUser != null &&
      userReviews != null &&
      mutualReviewed != null &&
      mutualWatchlist != null ? (
        <Paper>
          <OtherProfileDetails
            viewedUser={viewedUser}
            loggedInUser={loggedInUser}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
          />
          <Stack direction={'row'} spacing={1} justifyContent={'space-evenly'}>
            <OwnProfileUsersLists
              title="Followers of this user:"
              users={viewedUser.followers}
            />
            <OwnProfileUsersLists
              title="This user follows:"
              users={viewedUser.following}
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
        </Paper>
      ) : (
        <Typography>There is no user with this id</Typography>
      )}
    </Stack>
  );
}
