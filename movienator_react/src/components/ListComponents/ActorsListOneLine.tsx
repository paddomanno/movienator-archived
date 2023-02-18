import {
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Actor } from '../../types/Actor';
import ActorCardLarge from '../SingleItemComponents/ActorCardLarge';

type Props = {
  actors: Actor[];
  title: string;
  handleClick: () => void;
};

export default function ActorsListOneLine({
  title,
  actors,
  handleClick,
}: Props) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography>{title}</Typography>
        {actors.length > 0 ? (
          <Stack direction={'row'} spacing={1} justifyContent={'space-between'}>
            <Stack direction={'row'} spacing={1} overflow={'auto'}>
              {actors.map((actor) => (
                <ActorCardLarge actor={actor} key={actor.actorId} />
              ))}
            </Stack>
            <IconButton onClick={handleClick} size={'large'} color="secondary">
              <ArrowForwardIcon sx={{ width: 100 }} />
            </IconButton>
          </Stack>
        ) : (
          <Typography>No actors here</Typography>
        )}
      </CardContent>
    </Card>
  );
}
