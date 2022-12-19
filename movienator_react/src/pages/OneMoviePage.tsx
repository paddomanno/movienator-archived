//Route: movienator3000.com/movie/:movieId
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import MovieDetailsComponent from '../components/MoviePageComponents/MovieDetailsComponent';
import MovieOwnReviewComponent from '../components/MoviePageComponents/MovieOwnReviewComponent';
import MovieOnFollowerWatchlistComponent from '../components/MoviePageComponents/MovieOnFollowerWatchlistComponent';
import MovieFollowerReviewed from '../components/MoviePageComponents/MovieFollowerReviewed';
import MovieOthersReviews from '../components/MoviePageComponents/MovieOthersReviews';
import { getActorsToMovie, getMovieById } from '../services/ExternService';
import { User } from '../types/User';
import { getFollowingWithMovieWatchlist } from '../services/UserService';
import { Review } from '../types/Review';
import {
  getReviewsOfFollowingToMovie,
  getReviewsOfNotFollowingToMovie,
  getReviewsToMovie,
} from '../services/ReviewService';
import { useCookies } from 'react-cookie';
import { Stack } from '@mui/material';

export default function OneMoviePage() {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [followingWatchlist, setFollowingWatchlist] = useState<User[] | null>(
    []
  );
  const [followingReviews, setFollowingReviews] = useState<Review[] | null>([]);
  const [otherReviews, setOtherReviews] = useState<Review[] | null>([]);
  const [cookies, setCookies] = useCookies(['userName', 'userId']);

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
        <Stack direction={'column'} spacing={1} alignItems={'center'}>
          <MovieDetailsComponent data={movie} />
          <MovieOwnReviewComponent data={movie} />
          <MovieOnFollowerWatchlistComponent data={followingWatchlist} />
          <MovieFollowerReviewed data={followingReviews} />
          <MovieOthersReviews data={otherReviews} />
        </Stack>
      ) : (
        <></>
      )}
      <div>Hier ist die One Movie Page von {movieId} </div>
    </>
  );
}
