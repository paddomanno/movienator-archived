import { Genre } from '../../types/Genre';
import {
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Paper,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function GenreCard(props: any) {
  let genre: Genre = props.data as Genre;
  const navigate = useNavigate();
  function manageClick() {
    navigate('/genreMovies/' + genre.genreId);
  }
  return (
    <IconButton onClick={manageClick}>
      <Card
        sx={{
          maxWidth: 175,
          minWidth: 175,
        }}
      >
        <CardMedia
          component="img"
          alt={genre.genreName}
          height="125"
          image={`${process.env.PUBLIC_URL}/Images/${genre.genreName}.jpg`}
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
            {genre.genreName}
          </Typography>
        </CardContent>
      </Card>
    </IconButton>
  );
}
