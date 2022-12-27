import { Review } from '../../../types/Review';

type Props = {
  review: Review;
};
export default function ReviewCardWithMovie({ review }: Props) {
  return (
    <div>
      Showing Single Review in Profile. Not showing User{' '}
      {review.review_movie?.title}
    </div>
  );
}
