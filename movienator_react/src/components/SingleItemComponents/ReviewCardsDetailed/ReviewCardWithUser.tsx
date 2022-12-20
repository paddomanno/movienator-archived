import {
  Avatar,
  Card,
  CardContent,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Review } from '../../../types/Review';
import OtherUserAvatar from '../OtherUserAvatar';

type Props = {
  review: Review;
};

export default function ReviewCardWithUser({ review }: Props) {
  let avatar;
  let titleAndDate;
  let stars;
  if (review.review_user != null) {
    titleAndDate = (
      <Stack direction={'column'}>
        <Typography variant={'body2'}>
          {new Date(review.lastUpdated).toDateString()}
        </Typography>
        <Typography variant={'body1'}>{review.title}</Typography>
      </Stack>
    );
    stars = (
      <Stack direction={'row'}>
        {[...Array(review.rating)].map((x, i) => (
          <StarIcon />
        ))}
        {[...Array(5 - review.rating)].map((x, i) => (
          <StarBorderIcon />
        ))}
      </Stack>
    );
    avatar = <OtherUserAvatar data={review.review_user} />;
  }
  return (
    <Card sx={{ backgroundColor: grey.A200 }}>
      <CardContent>
        <Stack direction={'column'} spacing={1}>
          <Stack direction={'row'} spacing={2} justifyContent={'space-between'}>
            {avatar}
            {titleAndDate}
            {stars}
          </Stack>
          <Paper>
            <Typography variant={'body2'}>{review.content}</Typography>
          </Paper>
        </Stack>
      </CardContent>
    </Card>
  );
}
