import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Stack } from '@mui/material';

type Props = {
  rating: number;
  max: number;
};

export default function RatingStars({ rating, max }: Props) {
  return (
    <Stack direction={'row'}>
      {[...Array(rating)].map((_, i) => (
        <StarIcon key={i} />
      ))}
      {[...Array(max - rating)].map((_, i) => (
        <StarBorderIcon key={i} />
      ))}
    </Stack>
  );
}
