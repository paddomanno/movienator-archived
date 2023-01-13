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
import OwnProfileUserSearch from '../components/GeneralComponents/OwnProfileUserSearch';

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
    getAllReviewsOfFollowingToUserId(cookies.userId as number).then(
      (reviews) => {
        setReviews(reviews.slice(0, MAX_MOVIES_PER_LIST));
      }
    );
    getAllRecommendationsForUserId(cookies.userId as number).then((recs) => {
      setFriendRecs(recs);
    });
  }, []);

  function reloadRecs() {
    getAllRecommendationsForUserId(cookies.userId as number).then((recs) => {
      setFriendRecs(recs);
    });
  }

  return (
    <main>
      {reviews == null || friendRecs == null ? (
        <>
          <Typography>Loading...</Typography>
        </>
      ) : (
        <>
          <Stack direction={'column'} spacing={1}>
            <OwnProfileUserSearch />
            <RecommendationListOneLine
              recs={friendRecs}
              reloadRecs={reloadRecs}
              handleClick={() => navigate('/friendRecommendations')}
            />
            <ReviewsListHomePage reviews={reviews} />
          </Stack>
        </>
      )}
    </main>
  );
}
