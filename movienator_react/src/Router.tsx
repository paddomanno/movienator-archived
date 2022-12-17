import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './pages/ErrorPage';
import RootPage from './pages/RootPage';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import FollowingReviewsPage from './pages/FollowingReviewsPage';
import WatchlistPage from './pages/WatchlistPage';
import RecommendationsPage from './pages/RecommendationsPage';
import GenreMoviesPage from './pages/GenreMoviesPage';
import OneMoviePage from './pages/OneMoviePage';
import OwnProfilePage from './pages/OwnProfilePage';
import OtherProfilePage from './pages/OtherProfilePage';

let router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        path: '/home',
        element: <HomePage />,
      },
      {
        path: '/followingReviews',
        element: <FollowingReviewsPage />,
      },
      {
        path: '/watchlist',
        element: <WatchlistPage />,
      },
      {
        path: '/recommendations',
        element: <RecommendationsPage />,
      },
      {
        path: '/genreMovies/:genreId',
        element: <GenreMoviesPage />,
      },
      {
        path: '/movie/:movieId',
        element: <OneMoviePage />,
      },
      {
        path: '/profile',
        element: <OwnProfilePage />,
      },
      {
        path: '/user/:userId',
        element: <OtherProfilePage />,
      },
    ],
  },
]);

export default router;
