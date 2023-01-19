import { grey } from '@mui/material/colors';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Recommendation } from '../../types/Recommendation';
import RecommendationView from './SingleRecommendationViews/RecommendationView';

type Props = {
  recs: Recommendation[];
  reloadRecs: () => void;
};
export default function OwnProfileRecommendationList({
  recs,
  reloadRecs,
}: Props) {
  return (
    <Card sx={{ backgroundColor: grey.A200 }}>
      <CardContent>
        <Typography>Movies you recommended</Typography>
        <Stack direction={'row'} spacing={1} overflow={'auto'}>
          {recs.map((rec) => (
            <Grid2 maxWidth={'33%'} minWidth={'33%'}>
              <RecommendationView
                rec={rec}
                reloadRecs={reloadRecs}
                variant={'showFor'}
              />
            </Grid2>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
