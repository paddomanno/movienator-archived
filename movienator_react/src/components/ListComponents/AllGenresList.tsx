import { Card, CardContent, Typography } from '@mui/material';
import GenreCard from '../SingleItemComponents/GenreCard';
import Grid2 from '@mui/material/Unstable_Grid2';
import { grey } from '@mui/material/colors';
import { GenreListProps } from '../../props/GenreProps';

export default function AllGenresList({ genres }: GenreListProps) {
  return (
    <Card sx={{ backgroundColor: grey.A200 }}>
      <CardContent>
        <Typography variant={'subtitle1'}>Browse our Genres</Typography>
        <Grid2 container spacing={0}>
          {genres.map((genre) => (
            <Grid2>
              <GenreCard genre={genre} />
            </Grid2>
          ))}
        </Grid2>
      </CardContent>
    </Card>
  );
}
