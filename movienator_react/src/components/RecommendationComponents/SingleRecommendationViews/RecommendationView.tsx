import SentRecommendation from './SentRecommendation';
import { Recommendation } from '../../../types/Recommendation';
import ReceivedRecommendation from './ReceivedRecommendation';

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
  }
  if (variant == 'showFromShort') {
    return <ReceivedRecommendation rec={rec} reloadRecs={reloadRecs} />;
  }
  if (variant == 'showFor') {
    return <SentRecommendation rec={rec} reloadRecs={reloadRecs} />;
  }
  return <></>;
}