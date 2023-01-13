//Route: movienator3000.com/home
import ReviewsListHomePage from '../components/ListComponents/ReviewsListHomePage';
import AllGenresList from '../components/ListComponents/AllGenresList';
import React, { useEffect, useState } from 'react';
import { Movie } from '../types/Movie';
import { Review } from '../types/Review';
import { Genre } from '../types/Genre';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { getWatchlistMoviesToUserId } from '../services/MovieService';
import {
  getAllGenres,
  getPopularMoviesToPagenumber,
  getUserRecommendationsToUserId,
} from '../services/ExternService';
import { getAllReviewsOfFollowingToUserId } from '../services/ReviewService';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { grey } from '@mui/material/colors';
import ActorSearchBar from '../components/GeneralComponents/ActorSearchBar';
import MovieSearchBar from '../components/GeneralComponents/MovieSearchbar';
import MoviesListOneLine from '../components/ListComponents/MoviesListOneLine';
import RecommendationListOneLine from '../components/RecommendationComponents/RecommendationListOneLine';
import { Recommendation } from '../types/Recommendation';
import { getAllRecommendationsForUserId } from '../services/RecommendationService';

export default function HomePage() {
  const MAX_MOVIES_PER_LIST = 10;
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState<Movie[] | null>(null);
  const [popular, setPopular] = useState<Movie[] | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[] | null>(null);
  const [friendRecs, setFriendRecs] = useState<Recommendation[] | null>(null);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [genres, setGenres] = useState<Genre[] | null>(null);
  const [cookies] = useCookies(['userName', 'userId']);

  useEffect(() => {
    //Rauswerfen wenn nicht eingeloggt
    if (!cookies.userName) {
      navigate('/login');
    }
    getWatchlistMoviesToUserId(cookies.userId as number).then((movies) => {
      setWatchlist(movies.slice(0, MAX_MOVIES_PER_LIST));
    });
    getPopularMoviesToPagenumber(1).then((movies) => {
      setPopular(movies.slice(0, MAX_MOVIES_PER_LIST));
    });
    getUserRecommendationsToUserId(cookies.userId as number).then((movies) => {
      setRecommendations(movies.slice(0, MAX_MOVIES_PER_LIST));
    });
    getAllReviewsOfFollowingToUserId(cookies.userId as number).then(
      (reviews) => {
        setReviews(reviews.slice(0, MAX_MOVIES_PER_LIST));
      }
    );
    getAllRecommendationsForUserId(cookies.userId as number).then((recs) => {
      setFriendRecs(recs);
    });
    getAllGenres().then((genres) => {
      setGenres(genres);
    });
  }, []);

  function reloadRecs() {
    getAllRecommendationsForUserId(cookies.userId as number).then((recs) => {
      setFriendRecs(recs);
    });
  }

  return (
    <main>
      {watchlist == null ||
      popular == null ||
      recommendations == null ||
      reviews == null ||
      genres == null ||
      friendRecs == null ? (
        <>
          <Typography>Loading...</Typography>
        </>
      ) : (
        <>
          <Stack direction={'column'} spacing={1}>
            <Card sx={{ backgroundColor: grey.A200 }}>
              <CardContent>
                <Stack
                  direction={'row'}
                  spacing={2}
                  justifyContent={'space-around'}
                >
                  <MovieSearchBar />
                  <ActorSearchBar />
                </Stack>
              </CardContent>
            </Card>

            <MoviesListOneLine
              movies={watchlist}
              title="Your Watchlist"
              handleClick={() => navigate('/watchlist')}
            />
            <MoviesListOneLine
              movies={popular}
              title="Popular Movies"
              handleClick={() => navigate('/popular')}
            />
            <MoviesListOneLine
              movies={recommendations}
              title="Recommendations For You"
              handleClick={() => navigate('/recommendations')}
            />
            <RecommendationListOneLine
              recs={friendRecs}
              reloadRecs={reloadRecs}
              handleClick={() => navigate('/friendRecommendations')}
            />
            <ReviewsListHomePage reviews={reviews} />
            <AllGenresList genres={genres} />
          </Stack>
        </>
      )}
    </main>
  );
}
