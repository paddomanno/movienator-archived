//Route: movienator3000.com/movie/:movieId
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import MovieDetails from '../components/MoviePageComponents/MovieDetails';
import { getActorsToMovie, getMovieById } from '../services/ExternService';
import { User } from '../types/User';
import { getFollowingWithMovieWatchlist } from '../services/UserService';
import { Review } from '../types/Review';
import {
  getReviewsOfFollowingToMovie,
  getReviewsOfNotFollowingToMovie,
} from '../services/ReviewService';
import { useCookies } from 'react-cookie';
import MovieFollowingReviewsList from '../components/MoviePageComponents/MovieFollowingReviewsList';
import MovieOthersReviewsList from '../components/MoviePageComponents/MovieOthersReviewsList';
import { Stack } from '@mui/material';
import MovieOnFollowerWatchlistList from '../components/MoviePageComponents/MovieOnFollowerWatchlistList';
import MovieOwnReview from '../components/MoviePageComponents/MovieOwnReview';

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
    if (typeof movieId === 'string') {
      getMovieById(parseInt(movieId)).then((movie) => {
        if (movie != null) {
          getActorsToMovie(movie.movieId).then((actors) => {
            movie.actors = actors;
            setMovie(movie);
          });
        }
      });

      getFollowingWithMovieWatchlist(
        cookies.userId as number,
        parseInt(movieId)
      ).then((users) => {
        setFollowingWatchlist(users);
      });
      getReviewsOfFollowingToMovie(
        cookies.userId as number,
        parseInt(movieId)
      ).then((reviews) => {
        setFollowingReviews(reviews);
      });
      getReviewsOfNotFollowingToMovie(
        cookies.userId as number,
        parseInt(movieId)
      ).then((reviews) => {
        setOtherReviews(reviews);
      });
    }
  }, []);

  return (
    <>
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
        <></>
      )}
    </>
  );
}
