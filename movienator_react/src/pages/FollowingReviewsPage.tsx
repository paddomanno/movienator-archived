//Route: movienator3000.com/followingReviews
import { useEffect, useState } from 'react';
import { Review } from '../types/Review';
import { getReviewsOfFollowing } from '../services/ReviewService';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import ReviewListWithText from '../components/ListComponents/ReviewListWithText';

export default function FollowingReviewsPage() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [cookies] = useCookies(['userName', 'userId']);

  useEffect(() => {
    if (!cookies.userName) {
      navigate('/login');
    }
    getReviewsOfFollowing(cookies.userId).then((reviews) => {
      setReviews(reviews);
    });
  }, []);

  return (
    <>
      {reviews != null ? (
        <ReviewListWithText
          reviews={reviews}
          showMovie={true}
          showUser={true}
          title={'Your Friends Reviews'}
        />
      ) : (
        <Typography> loading... </Typography>
      )}
    </>
  );
}
