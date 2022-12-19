import { Review } from '../../types/Review';

export default function MovieReviewDetails(props: any) {
  const review: Review = props.data as Review;
  return <div>{review.content}</div>;
}
