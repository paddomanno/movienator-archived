import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';

import { BrowserRouter } from 'react-router-dom';
import {
  getOneUserToUserId,
  insertFollowingToUserIdAndUserId,
} from '../services/UserService';
import { User } from '../types/User';
import OtherProfilePage from '../pages/OtherProfilePage';
import {
  getMutualWatchlistToTwoUserIds,
  getMutualReviewedToTwoUserIds,
} from '../services/MovieService';
import { getAllReviewsToUserId } from '../services/ReviewService';

const fakeLoggedInUser = {
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
const fakeViewedUser: User = {
  userId: 5678,
  firstName: 'Maggus',
  lastName: 'Ruehl',
  userName: 'maggus',
  password: 'abc',
  comment: '',
  birthday: new Date(),
  profileImage: null,
  reviews: [],
  following: [],
  followers: [],
  watchlist: [],
};

// mock all the backend calls
jest.mock('../services/UserService');
jest.mock('../services/MovieService');
jest.mock('../services/ReviewService');

// make 'params' equal to fakeViewedUser.userId (for testing component pages where a viewedUser id is required in the url)
// also mock the 'navigate' function to test calls made to it
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    userId: fakeViewedUser.userId,
  }),
  useNavigate: () => mockNavigate,
}));

// make 'cookies' always equal to the fakeLoggedInUser
const mockSetCookie = jest.fn();
jest.mock('react-cookie', () => ({
  useCookies: jest.fn(() => [fakeLoggedInUser, mockSetCookie]),
}));

describe('test follow another user', () => {
  test('renders the other user page', async () => {
    // mock backend calls with implementation if neccessary
    (getOneUserToUserId as jest.Mock).mockImplementation((id) => {
      if (id === fakeLoggedInUser.userId || id === fakeLoggedInUser.userName) {
        return Promise.resolve(fakeLoggedInUser);
      } else {
        return Promise.resolve(fakeViewedUser);
      }
    });
    (getAllReviewsToUserId as jest.Mock).mockResolvedValue([]);
    (getMutualWatchlistToTwoUserIds as jest.Mock).mockResolvedValue([]);
    (getMutualReviewedToTwoUserIds as jest.Mock).mockResolvedValue([]);

    // arrange
    act(() => {
      render(
        <BrowserRouter>
          <OtherProfilePage />
        </BrowserRouter>
      );
    });

    // assert
    await waitFor(() => {
      expect(screen.getByText(fakeViewedUser.userName)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Follow' })
      ).toBeInTheDocument();
    });
  });

  test('clicking follow updates the user in backend', async () => {
    // mock backend calls with implementation if neccessary
    (getOneUserToUserId as jest.Mock).mockResolvedValueOnce(fakeLoggedInUser); // <-- the component expects this on the first call
    (getOneUserToUserId as jest.Mock).mockResolvedValueOnce(fakeViewedUser); // <-- the component expects this on the second call
    (getOneUserToUserId as jest.Mock).mockResolvedValue({
      ...fakeViewedUser,
      followers: [fakeLoggedInUser],
    }); // <-- the component expects this on the third call
    (getAllReviewsToUserId as jest.Mock).mockResolvedValue([]);
    (getMutualWatchlistToTwoUserIds as jest.Mock).mockResolvedValue([]);
    (getMutualReviewedToTwoUserIds as jest.Mock).mockResolvedValue([]);

    // arrange
    act(() => {
      render(
        <BrowserRouter>
          <OtherProfilePage />
        </BrowserRouter>
      );
    });

    // act
    await waitFor(() => {
      expect(screen.getByText(fakeViewedUser.userName)).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /follow/i })
      ).toBeInTheDocument();
    }); // only click the button once the ui is loaded
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Follow' }));
    });

    // assert
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /unfollow/i })
      ).toBeInTheDocument();
      expect(insertFollowingToUserIdAndUserId).toHaveBeenCalledWith(
        fakeLoggedInUser.userId,
        fakeViewedUser.userId
      );
      expect(screen.getByText('You')).toBeInTheDocument();
    });
  });
});
