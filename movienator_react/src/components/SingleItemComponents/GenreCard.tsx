import { Genre } from '../../types/Genre';
import { IconButton, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function GenreCard(props: any) {
  let genre: Genre = props.data as Genre;
  const navigate = useNavigate();
  function manageClick() {
    navigate('/genreMovies/' + genre.genreId);
  }
  return (
    <IconButton onClick={manageClick}>
      <Paper
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
    </IconButton>
  );
}
