import { SingleUserProps } from '../../props/UserProps';
import { RecommendationListProps } from '../../props/RecommendationProps';
import { grey } from '@mui/material/colors';
import { Card, CardContent, Typography } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import ReviewCardDetailed from '../SingleItemComponents/ReviewCardDetailed';
import SentRecommendation from './SingleRecommendationViews/SentRecommendation';
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
        <Grid2 container spacing={1}>
          {recs.map((rec) => (
            <Grid2 maxWidth={'33%'} minWidth={'33%'}>
              <RecommendationView
                rec={rec}
                reloadRecs={reloadRecs}
                variant={'showFor'}
              />
            </Grid2>
          ))}
        </Grid2>
      </CardContent>
    </Card>
  );
}
