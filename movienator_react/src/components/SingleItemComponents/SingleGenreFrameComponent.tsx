import { Genre } from '../../types/Genre';
import { Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function SingleGenreFrameComponent(props: any) {
  let genre: Genre = props.data as Genre;
  const navigate = useNavigate();
  function manageClick() {
    navigate('/genreMovies/' + genre.genreId);
  }
  return (
    <Paper
      onClick={manageClick}
      elevation={6}
      variant={'outlined'}
      sx={{
        minWidth: 100,
        maxWidth: 100,
        minHeight: 100,
        maxHeight: 100,
        textAlign: 'center',
        verticalAlign: 'middle',
      }}
    >
      <Typography>{genre.genreName}</Typography>
    </Paper>
  );
}
