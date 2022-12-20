import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { Genre } from '../../types/Genre';
import GenreCard from '../SingleItemComponents/GenreCard';
import Grid2 from '@mui/material/Unstable_Grid2';

export default function AllGenresList(props: any) {
  const genre: Genre[] = props.data as Genre[];

  return (
    <Card sx={{ backgroundColor: 'lightgrey' }}>
      <CardContent>
        <Typography variant={'subtitle1'}>Browse our Genres</Typography>
        <Grid2 container spacing={0}>
          {genre.map((genre) => (
            <Grid2>
              <GenreCard data={genre} />
            </Grid2>
          ))}
        </Grid2>
      </CardContent>
    </Card>
  );
}
