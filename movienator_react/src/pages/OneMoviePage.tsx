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
  getReviewsToMovie,
} from '../services/ReviewService';
import { useCookies } from 'react-cookie';
import ReviewEditForm from '../components/MoviePageComponents/ReviewEditForm';
import UsersList from '../components/ListComponents/UsersList';
import MovieFollowingReviewsList from '../components/MoviePageComponents/MovieFollowingReviewsList';
import MovieOthersReviewsList from '../components/MoviePageComponents/MovieOthersReviewsList';

export default function OneMoviePage() {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [followingWatchlist, setFollowingWatchlist] = useState<User[] | null>(
    []
  );
  const [followingReviews, setFollowingReviews] = useState<Review[] | null>([]);
  const [otherReviews, setOtherReviews] = useState<Review[] | null>([]);
  const [cookies, setCookies] = useCookies(['userName']);

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
      getFollowingWithMovieWatchlist(1, parseInt(movieId)).then((users) => {
        setFollowingWatchlist(users);
      });
      getReviewsOfFollowingToMovie(1, parseInt(movieId)).then((reviews) => {
        setFollowingReviews(reviews);
      });
      getReviewsToMovie(parseInt(movieId)).then((reviews) => {
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
        <>
          <MovieDetails data={movie} />
          <ReviewEditForm data={movie} />
          <UsersList users={followingWatchlist} />
          <MovieFollowingReviewsList reviews={followingReviews} />
          <MovieOthersReviewsList reviews={otherReviews} />
        </>
      ) : (
        <></>
      )}
      <div>Hier ist die One Movie Page von {movieId} </div>
    </>
  );
}
