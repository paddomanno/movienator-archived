import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { Genre } from '../../types/Genre';
import SingleGenreFrameComponent from '../SingleItemComponents/SingleGenreFrameComponent';
import Grid2 from '@mui/material/Unstable_Grid2';

export default function GenreListComponent(props: any) {
  const genre: Genre[] = props.data as Genre[];

  return (
    <Card sx={{ backgroundColor: 'lightgrey' }}>
      <CardContent>
        <Typography variant={'subtitle1'}>Browse our Genres</Typography>
        <Grid2 container spacing={1}>
          {genre.map((genre) => (
            <Grid2>
              <SingleGenreFrameComponent data={genre} />
            </Grid2>
          ))}
        </Grid2>
      </CardContent>
    </Card>
  );
}
