import { SingleReviewProps } from '../../../props/ReviewProps';

export default function ReviewCardWithMovie({ review }: SingleReviewProps) {
  return (
    <div>
      Showing Single Review in Profile. Not showing User{' '}
      {review.review_movie?.title}
    </div>
  );
}
