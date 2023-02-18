//Route: movienator3000.com/movie/:movieId
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import MovieDetails from '../components/MoviePageComponents/MovieDetails';
import { getActorsToMovie, getOneMovieToId } from '../services/ExternService';
import { User } from '../types/User';
import { getFollowingToUserIdWithMovieIdOnWatchlist } from '../services/UserService';
import { Review } from '../types/Review';
import {
  getAllReviewsOfFollowingToUserIdAndMovieId,
  getAllReviewsOfNotFollowingToUserIdAndMovieId,
} from '../services/ReviewService';
import { useCookies } from 'react-cookie';
import MovieFollowingReviewsList from '../components/MoviePageComponents/MovieFollowingReviewsList';
import MovieOthersReviewsList from '../components/MoviePageComponents/MovieOthersReviewsList';
import { Paper, Stack } from '@mui/material';
import MovieOnFollowerWatchlistList from '../components/MoviePageComponents/MovieOnFollowerWatchlistList';
import MovieOwnReview from '../components/MoviePageComponents/MovieOwnReview';
import Typography from '@mui/material/Typography';

export default function OneMoviePage() {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [followingWatchlist, setFollowingWatchlist] = useState<User[] | null>(
    []
  );
  const [followingReviews, setFollowingReviews] = useState<Review[] | null>([]);
  const [otherReviews, setOtherReviews] = useState<Review[] | null>([]);
  const [cookies] = useCookies(['userName', 'userId']);

  useEffect(() => {
    if (!cookies.userName) {
      navigate('/login');
    }
  }, [cookies.userName, navigate]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (movie) {
      document.title = movie.title;
    } else {
      document.title = 'Movie Page ';
    }
  }, [movie]);

  async function fetchData() {
    if (typeof movieId !== 'string') {
      return;
    }
    const movie = await getOneMovieToId(parseInt(movieId));
    if (movie) {
      const actors = await getActorsToMovie(movie.movieId);
      movie.actors = actors;

      setMovie(movie);
    }

    const usersFollowingWatchlist =
      await getFollowingToUserIdWithMovieIdOnWatchlist(
        cookies.userId as number,
        parseInt(movieId)
      );
    setFollowingWatchlist(usersFollowingWatchlist);

    const reviewsFollowing = await getAllReviewsOfFollowingToUserIdAndMovieId(
      cookies.userId as number,
      parseInt(movieId)
    );
    setFollowingReviews(reviewsFollowing);

    const reviewsAll = await getAllReviewsOfNotFollowingToUserIdAndMovieId(
      cookies.userId as number,
      parseInt(movieId)
    );
    setOtherReviews(reviewsAll);
  }

  return (
    <Paper>
      {movie != null &&
      followingWatchlist != null &&
      followingReviews != null &&
      otherReviews != null ? (
        <Stack direction={'column'} spacing={1} alignItems={'stretch'}>
          <MovieDetails movie={movie} />
          <Stack direction={'row'} spacing={1} justifyContent={'space-evenly'}>
            <MovieOwnReview movie={movie} />
            <MovieOnFollowerWatchlistList users={followingWatchlist} />
          </Stack>
          <MovieFollowingReviewsList reviews={followingReviews} />
          <MovieOthersReviewsList reviews={otherReviews} />
        </Stack>
      ) : (
        <>
          <Typography>Loading...</Typography>
        </>
      )}
    </Paper>
  );
}
