import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { BrowserRouter } from 'react-router-dom';
import { getOneUserToUserId } from '../services/UserService';
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

jest.mock('../services/UserService');
jest.mock('../services/MovieService');
jest.mock('../services/ReviewService');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // use actual for all non-hook parts
  useParams: () => ({
    userId: fakeViewedUser.userId,
  }),
  useRouteMatch: () => ({ url: '/company/company-id1/team/team-id1' }),
  useNavigate: () => mockNavigate,
}));

const mockSetCookie = jest.fn();
jest.mock('react-cookie', () => ({
  useCookies: jest.fn(() => [fakeLoggedInUser, mockSetCookie]),
}));

describe('test follow another user', () => {
  test('renders the other user page', async () => {
    /*let cookies = useCookies(['userName', 'userId']);
    cookies.set('userName', "Hallo")
    cookies['userName'] = ('userName', user.userName, { path: '/' });
    setCookie('userId', user.userId, { path: '/' });*/
    // (getOneUserToUserId as jest.Mock).mockResolvedValue(fakeLoggedInUser);
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

  // test('writes into input field Username and Password', async () => {
  //   // arrange
  //   render(
  //     <BrowserRouter>
  //       <LoginPage />
  //     </BrowserRouter>
  //   );

  //   // act
  //   const inputName = screen.getByLabelText(/username/i) as HTMLInputElement;
  //   const inputPwd = screen.getByLabelText(/password/i) as HTMLInputElement;
  //   fireEvent.change(inputName, { target: { value: 'MyUser123' } });
  //   fireEvent.change(inputPwd, { target: { value: 'root' } });

  //   // assert
  //   expect(inputName.value).toBe('MyUser123');
  //   expect(inputPwd.value).toBe('root');
  // });

  // test('shows orange input fields when not filled after login button clicked', () => {
  //   // arrange
  //   render(
  //     <BrowserRouter>
  //       <LoginPage />
  //     </BrowserRouter>
  //   );

  //   // act
  //   const buttonLogin = screen.getByRole(/button/i, { name: 'Login' });
  //   fireEvent.click(buttonLogin);

  //   // assert
  //   const inputName = screen.getByLabelText(/username/i) as HTMLInputElement;
  //   const inputPwd = screen.getByLabelText(/password/i) as HTMLInputElement;
  //   expect(inputName.style.backgroundColor).toBe('orange');
  //   expect(inputPwd.style.backgroundColor).toBe('orange');
  // });

  // test('Login form submits correctly, sets cookies and navigates to HomePage', async () => {
  //   const loggedInUserDetails = {
  //     userId: 123,
  //     userName: 'fakeUser',
  //     password: 'fakePass',
  //   };

  //   const loggedInUserFull: User = {
  //     userId: loggedInUserDetails.userId,
  //     firstName: '',
  //     lastName: '',
  //     userName: loggedInUserDetails.userName,
  //     password: loggedInUserDetails.password,
  //     comment: '',
  //     birthday: new Date(),
  //     profileImage: null,
  //     reviews: [],
  //     following: [],
  //     followers: [],
  //     watchlist: [],
  //   };
  //   (getOneUserToUserId as jest.Mock).mockResolvedValue(loggedInUserFull);

  //   // arrange
  //   render(
  //     <BrowserRouter>
  //       <LoginPage />
  //     </BrowserRouter>
  //   );

  //   // act
  //   act(() => {
  //     fireEvent.change(screen.getByLabelText(/username/i), {
  //       target: { value: loggedInUserDetails.userName },
  //     });
  //     fireEvent.change(screen.getByLabelText(/password/i), {
  //       target: { value: loggedInUserDetails.password },
  //     });
  //   });

  //   console.log('## CLICKING LOGIN');
  //   await act(async () => {
  //     fireEvent.click(screen.getByText('Login'));
  //   });
  //   console.log((getOneUserToUserId as jest.Mock).mock.calls);

  //   // assert
  //   expect(getOneUserToUserId as jest.Mock).toHaveBeenCalledWith(
  //     loggedInUserDetails.userName
  //   );
  //   expect(mockSetCookie).toHaveBeenCalledWith(
  //     'userName',
  //     loggedInUserDetails.userName,
  //     {
  //       path: '/',
  //     }
  //   );
  //   expect(mockSetCookie).toHaveBeenCalledWith(
  //     'userId',
  //     loggedInUserDetails.userId,
  //     {
  //       path: '/',
  //     }
  //   );
  //   expect(mockNavigate).toHaveBeenCalledWith('/home');
  // });
});
