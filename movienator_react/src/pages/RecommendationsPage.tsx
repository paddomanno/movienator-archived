//Route: movienator3000.com/recommendations
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { useCookies } from 'react-cookie';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import MoviesList from '../components/ListComponents/MoviesList';
import { getUserRecommendationsToUserId } from '../services/ExternService';

export default function RecommendationsPage() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [cookies] = useCookies(['userName', 'userId']);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    if (!cookies.userName) {
      navigate('/login');
    }
    document.title = 'Your Recommendations';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getUserRecommendationsToUserId(cookies.userId).then((movies) => {
      setMovies(movies);
    });
  }, [cookies.userId]);

  useEffect(() => {
    setMovies(null);
    getUserRecommendationsToUserId(cookies.userId).then((movies) => {
      setMovies(movies);
    });
  }, [cookies.userId, page]);

  function decrementPage(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function incrementPage(e: React.MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
    setPage(page + 1);
  }

  return (
    <Stack direction={'column'} spacing={1}>
      <Card>
        <CardContent>
          <Typography>
            Your Recommendations. Review more Movies to receive more
            recommendations.
          </Typography>
        </CardContent>
      </Card>
      {movies != null ? (
        <>
          <MoviesList movies={movies} />
        </>
      ) : (
        <>
          <Typography>Loading...</Typography>
        </>
      )}
      <Card>
        <CardContent>
          <Stack direction={'row'} spacing={2}>
            <Button
              variant={'contained'}
              onClick={decrementPage}
              disabled={page == 1}
            >
              Prev Page
            </Button>
            <Button
              variant={'contained'}
              onClick={incrementPage}
              disabled={movies == null || movies.length < 20}
            >
              Next Page
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
