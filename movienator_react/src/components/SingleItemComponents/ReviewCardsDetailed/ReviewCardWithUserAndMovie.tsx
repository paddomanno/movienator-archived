//Figma: Detailansicht einer geschriebenen Review
import { SingleReviewProps } from '../../../props/ReviewProps';

export default function ReviewCardWithUserAndMovie({
  review,
}: SingleReviewProps) {
  return (
    <div>
      Showing Movie & User & Review Infos {review.title}{' '}
      {review.review_movie?.title} {review.review_user?.userName}{' '}
    </div>
  );
}
