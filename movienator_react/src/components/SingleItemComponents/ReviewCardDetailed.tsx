import React from 'react';
import ReviewCardShort from './ReviewCardShort';
import ReviewCardWithUser from './ReviewCardsDetailed/ReviewCardWithUser';
import ReviewCardWithUserAndMovie from './ReviewCardsDetailed/ReviewCardWithUserAndMovie';
import ReviewCardWithMovie from './ReviewCardsDetailed/ReviewCardWithMovie';
import { Review } from '../../types/Review';

type Props = {
  showUser: boolean;
  showMovie: boolean;
  review: Review;
};

function ReviewCardDetailed({ showUser, showMovie, review }: Props) {
  if (showUser && showMovie) {
    return <ReviewCardWithUserAndMovie review={review} />;
  } else if (showUser) {
    return <ReviewCardWithUser review={review} />;
  } else if (showMovie) {
    return <ReviewCardWithMovie review={review} />;
  } else {
    return <ReviewCardShort review={review} />;
  }
}

export default ReviewCardDetailed;
