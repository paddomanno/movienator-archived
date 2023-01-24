import {
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Recommendation } from '../../types/Recommendation';
import RecommendationView from './SingleRecommendationViews/RecommendationView';

type Props = {
  recs: Recommendation[];
  reloadRecs: () => void;
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
export default function RecommendationListOneLine({
  recs,
  reloadRecs,
  handleClick,
}: Props) {
  return (
    <Card sx={{ backgroundColor: grey.A200 }}>
      <CardContent>
        <Typography>Recommendations from your friends</Typography>
        {recs.length > 0 ? (
          <Stack direction={'row'} spacing={1} justifyContent={'space-between'}>
            <Stack direction={'row'} spacing={1} overflow={'auto'}>
              {recs.map((rec) => (
                <RecommendationView
                  rec={rec}
                  reloadRecs={reloadRecs}
                  variant={'showFromShort'}
                  key={`${rec.sendingUserUserId}.${rec.recommendedMovieMovieId}`}
                />
              ))}
            </Stack>
            <IconButton
              onClick={handleClick}
              size={'large'}
              sx={{ backgroundColor: grey.A400 }}
            >
              <ArrowForwardIcon sx={{ width: 100 }} />
            </IconButton>
          </Stack>
        ) : (
          <Typography>No Recommendations yet</Typography>
        )}
      </CardContent>
    </Card>
  );
}
