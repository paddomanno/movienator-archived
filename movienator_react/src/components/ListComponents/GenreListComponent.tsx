import { Card, CardContent, Stack, Typography } from '@mui/material';
import { Genre } from '../../types/Genre';
import SingleGenreFrameComponent from '../SingleItemComponents/SingleGenreFrameComponent';

export default function GenreListComponent(props: any) {
  const genre: Genre[] = props.data as Genre[];

  return (
    <Card sx={{ backgroundColor: 'lightgrey' }}>
      <CardContent>
        <Typography>Browse our Genres</Typography>
        <Stack direction={'row'} spacing={1} flexWrap={'wrap'}>
          {genre.map((genre) => (
            <SingleGenreFrameComponent data={genre} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
