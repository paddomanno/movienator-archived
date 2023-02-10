import React, { useEffect, useState } from 'react';
import { Recommendation } from '../types/Recommendation';
import { Review } from '../types/Review';
import { useCookies } from 'react-cookie';
import { getAllReviewsOfFollowingToUserId } from '../services/ReviewService';
import { getAllRecommendationsForUserId } from '../services/RecommendationService';
import { useNavigate } from 'react-router-dom';
import { Stack, Typography } from '@mui/material';
import RecommendationListOneLine from '../components/RecommendationComponents/RecommendationListOneLine';
import ReviewsListHomePage from '../components/ListComponents/ReviewsListHomePage';
import UserSearch from '../components/GeneralComponents/UserSearch';

export default function SocialPage() {
  const MAX_MOVIES_PER_LIST = 10;
  const navigate = useNavigate();
  const [friendRecs, setFriendRecs] = useState<Recommendation[] | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [cookies] = useCookies(['userName', 'userId']);

  useEffect(() => {
    //Rauswerfen wenn nicht eingeloggt
    if (!cookies.userName) {
      navigate('/login');
    }
    document.title = 'Get Social!';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getAllReviewsOfFollowingToUserId(cookies.userId as number).then(
      (reviews) => {
        setReviews(reviews.slice(0, MAX_MOVIES_PER_LIST));
      }
    );
    getAllRecommendationsForUserId(cookies.userId as number).then((recs) => {
      setFriendRecs(recs.slice(0, MAX_MOVIES_PER_LIST));
    });
  }, [cookies.userId]);

  function reloadRecs() {
    getAllRecommendationsForUserId(cookies.userId as number).then((recs) => {
      setFriendRecs(recs.slice(0, MAX_MOVIES_PER_LIST));
    });
  }

  return (
    <>
      {reviews == null || friendRecs == null ? (
        <>
          <Typography>Loading...</Typography>
        </>
      ) : (
        <>
          <Stack direction={'column'} spacing={1}>
            <UserSearch />
            <RecommendationListOneLine
              recs={friendRecs}
              reloadRecs={reloadRecs}
              handleClick={() => navigate('/friendRecommendations')}
            />
            <ReviewsListHomePage reviews={reviews} />
          </Stack>
        </>
      )}
    </>
  );
}
