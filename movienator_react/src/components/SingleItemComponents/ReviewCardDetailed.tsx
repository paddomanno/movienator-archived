import React from 'react';
import ReviewCardShort from './ReviewCardShort';
import ReviewCardWithUser from './ReviewCardsDetailed/ReviewCardWithUser';
import ReviewCardWithUserAndMovie from './ReviewCardsDetailed/ReviewCardWithUserAndMovie';
import ReviewCardWithMovie from './ReviewCardsDetailed/ReviewCardWithMovie';

type Props = {
  showUser: boolean;
  showMovie: boolean;
};

function ReviewCardDetailed({ showUser, showMovie }: Props) {
  if (showUser && showMovie) {
    return <ReviewCardWithUserAndMovie />;
  } else if (showUser) {
    return <ReviewCardWithUser />;
  } else if (showMovie) {
    return <ReviewCardWithMovie />;
  } else {
    return <ReviewCardShort />;
  }
}

export default ReviewCardDetailed;
