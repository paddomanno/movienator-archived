import SentRecommendationCard from './SentRecommendationCard';
import { Recommendation } from '../../../types/Recommendation';
import ReceivedRecommendationCard from './ReceivedRecommendationCard';
import { Paper } from '@mui/material';

type Props = {
  variant: 'showFrom' | 'showFromShort' | 'showFor';
  reloadRecs: () => void;
  rec: Recommendation;
};
export default function RecommendationView({
  variant,
  reloadRecs,
  rec,
}: Props) {
  if (variant == 'showFrom') {
    // TODO: implement longer ReceivedRecommendationCard component
  }
  if (variant == 'showFromShort') {
    return <ReceivedRecommendationCard rec={rec} reloadRecs={reloadRecs} />;
  }
  if (variant == 'showFor') {
    return <SentRecommendationCard rec={rec} reloadRecs={reloadRecs} />;
  }
  return <Paper></Paper>;
}
