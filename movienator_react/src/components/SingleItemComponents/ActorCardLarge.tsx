import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from '@mui/material';
import { SingleActorProps } from '../../props/ActorProps';

export default function ActorCardLarge({ actor }: SingleActorProps) {
  const navigate = useNavigate();
  function manageClick() {
    navigate('/actor/' + actor.actorId);
  }
  //Bilder sind 421 x 632. Also muss gelten: Breite * 1.5 = Höhe
  return (
    <IconButton onClick={manageClick}>
      <Card sx={{ maxWidth: 175, minWidth: 175 }}>
        <CardMedia
          component="img"
          alt={actor.imagePath != null ? actor.name : 'No image available'}
          height="260"
          image={`https://image.tmdb.org/t/p/h632${actor.imagePath}`}
        />
        <CardContent>
          <Typography
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            variant={'body2'}
          >
            {actor.name}
          </Typography>
        </CardContent>
      </Card>
    </IconButton>
  );
}
