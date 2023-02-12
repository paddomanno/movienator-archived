import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import OneMoviePage from '../pages/OneMoviePage';
import {
  getAllWatchProvidersForMovie,
  getOneMovieToId,
} from '../services/ExternService';
import { getActorsToMovie } from '../services/ExternService';
import {
  getFollowingOfUserIdInFollowers,
  getFollowingToUserIdWithMovieIdOnWatchlist,
  getOneUserToUserId,
  insertMovieIdOnWatchlistToUserId,
} from '../services/UserService';
import {
  getAllReviewsOfFollowingToUserIdAndMovieId,
  getAllReviewsOfNotFollowingToUserIdAndMovieId,
  getOneReviewToUserIdAndMovieId,
} from '../services/ReviewService';
import { Movie } from '../types/Movie';
import { User } from '../types/User';
import { createMovie } from '../services/MovieService';
const fakeLoggedInUser: User = {
  userName: 'fakeName',
  userId: 1234,
  firstName: 'Loggedin',
  lastName: 'Fakeuser',
  password: 'abc',
  comment: '',
  birthday: new Date(),
  profileImage: null,
  reviews: [],
  following: [],
  followers: [],
  watchlist: [],
};
const fakeMovie: Movie = {
  movieId: 55555,
  title: 'Fake Movie',
  overview: 'Fake Overview',
  releaseDate: new Date(),
  lengthMinutes: 120,
  adultContent: false,
  imagePath: 'nix',
  videoPath: 'nix',
  actors: [],
  reviews: [],
  genres: [],
};

jest.mock('../services/UserService');
jest.mock('../services/MovieService');
jest.mock('../services/ExternService');
jest.mock('../services/ReviewService');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    movieId: fakeMovie.movieId.toString(),
  }),
  useNavigate: () => mockNavigate,
}));

const mockSetCookie = jest.fn();
jest.mock('react-cookie', () => ({
  useCookies: jest.fn(() => [
    {
      userName: fakeLoggedInUser.userName,
      userId: fakeLoggedInUser.userId,
    },
    mockSetCookie,
  ]),
}));

describe('test adding movie to watchlist', () => {
  test('should render movie page', async () => {
    (getOneUserToUserId as jest.Mock).mockResolvedValue(fakeLoggedInUser);
    (getOneMovieToId as jest.Mock).mockResolvedValue(fakeMovie);
    (getActorsToMovie as jest.Mock).mockResolvedValue([]);
    (getFollowingToUserIdWithMovieIdOnWatchlist as jest.Mock).mockResolvedValue(
      []
    );
    (getAllReviewsOfFollowingToUserIdAndMovieId as jest.Mock).mockResolvedValue(
      []
    );
    (
      getAllReviewsOfNotFollowingToUserIdAndMovieId as jest.Mock
    ).mockResolvedValue([]);
    (getOneReviewToUserIdAndMovieId as jest.Mock).mockResolvedValue(null);
    (getAllWatchProvidersForMovie as jest.Mock).mockResolvedValue({
      country: '',
      providers: [],
    });
    (getFollowingOfUserIdInFollowers as jest.Mock).mockResolvedValue([]);

    // arrange
    act(() => {
      render(
        <BrowserRouter>
          <OneMoviePage />
        </BrowserRouter>
      );
    });

    // act

    // assert
    await waitFor(() => {
      expect(screen.getByRole('heading')).toHaveTextContent(fakeMovie.title);
      expect(
        screen.getByRole('button', { name: /add to watchlist/i })
      ).toBeInTheDocument();
    });
  });

  test('should add movie to watchlist on click', async () => {
    (getOneUserToUserId as jest.Mock).mockResolvedValue(fakeLoggedInUser);
    (getOneMovieToId as jest.Mock).mockResolvedValue(fakeMovie);
    (getActorsToMovie as jest.Mock).mockResolvedValue([]);
    (getFollowingToUserIdWithMovieIdOnWatchlist as jest.Mock).mockResolvedValue(
      []
    );
    (getAllReviewsOfFollowingToUserIdAndMovieId as jest.Mock).mockResolvedValue(
      []
    );
    (
      getAllReviewsOfNotFollowingToUserIdAndMovieId as jest.Mock
    ).mockResolvedValue([]);
    (getOneReviewToUserIdAndMovieId as jest.Mock).mockResolvedValue(null);
    (getAllWatchProvidersForMovie as jest.Mock).mockResolvedValue({
      country: '',
      providers: [],
    });
    (createMovie as jest.Mock).mockResolvedValue(true);
    (insertMovieIdOnWatchlistToUserId as jest.Mock).mockResolvedValue(true);
    (getFollowingOfUserIdInFollowers as jest.Mock).mockResolvedValue([]);

    // arrange
    act(() => {
      render(
        <BrowserRouter>
          <OneMoviePage />
        </BrowserRouter>
      );
    });

    // act
    await waitFor(() => {
      expect(screen.getByRole('heading')).toHaveTextContent(fakeMovie.title);
      expect(
        screen.getByRole('button', { name: /add to watchlist/i })
      ).toBeInTheDocument();
    });
    await act(async () => {
      fireEvent.click(
        screen.getByRole('button', { name: /add to watchlist/i })
      );
    });

    // assert
    await waitFor(() => {
      expect(
        insertMovieIdOnWatchlistToUserId as jest.Mock
      ).toHaveBeenCalledWith(fakeLoggedInUser.userId, fakeMovie.movieId);
    });
  });
});
