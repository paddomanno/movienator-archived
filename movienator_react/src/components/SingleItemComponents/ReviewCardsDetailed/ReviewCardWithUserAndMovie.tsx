//Figma: Detailansicht einer geschriebenen Review
import { Review } from '../../../types/Review';

type Props = {
  review: Review;
};
export default function ReviewCardWithUserAndMovie({ review }: Props) {
  return (
    <div>
      Showing Movie & User & Review Infos {review.title}{' '}
      {review.review_movie?.title} {review.review_user?.userName}{' '}
    </div>
  );
}
