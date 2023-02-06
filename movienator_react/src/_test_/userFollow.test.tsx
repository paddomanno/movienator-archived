import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import { getOneUserToUserId } from '../services/UserService';
import { User } from '../types/User';

import { useCookies } from 'react-cookie';

jest.mock('../services/UserService');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockNavigate,
}));

const mockSetCookie = jest.fn();
jest.mock('react-cookie', () => ({
  useCookies: jest.fn(() => [{}, mockSetCookie]),
}));

describe('test follow another user', () => {
  test('renders the other user page', async () => {
    /*let cookies = useCookies(['userName', 'userId']);
    cookies.set('userName', "Hallo")
    cookies['userName'] = ('userName', user.userName, { path: '/' });
    setCookie('userId', user.userId, { path: '/' });*/

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading')).toHaveTextContent(
      'Sign into your Account'
    );
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: "I don't have an account" })
    ).toBeInTheDocument();
  });

  test('writes into input field Username and Password', async () => {
    // arrange
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // act
    const inputName = screen.getByLabelText(/username/i) as HTMLInputElement;
    const inputPwd = screen.getByLabelText(/password/i) as HTMLInputElement;
    fireEvent.change(inputName, { target: { value: 'MyUser123' } });
    fireEvent.change(inputPwd, { target: { value: 'root' } });

    // assert
    expect(inputName.value).toBe('MyUser123');
    expect(inputPwd.value).toBe('root');
  });

  test('shows orange input fields when not filled after login button clicked', () => {
    // arrange
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // act
    const buttonLogin = screen.getByRole(/button/i, { name: 'Login' });
    fireEvent.click(buttonLogin);

    // assert
    const inputName = screen.getByLabelText(/username/i) as HTMLInputElement;
    const inputPwd = screen.getByLabelText(/password/i) as HTMLInputElement;
    expect(inputName.style.backgroundColor).toBe('orange');
    expect(inputPwd.style.backgroundColor).toBe('orange');
  });

  test('Login form submits correctly, sets cookies and navigates to HomePage', async () => {
    const loggedInUserDetails = {
      userId: 123,
      userName: 'fakeUser',
      password: 'fakePass',
    };

    const loggedInUserFull: User = {
      userId: loggedInUserDetails.userId,
      firstName: '',
      lastName: '',
      userName: loggedInUserDetails.userName,
      password: loggedInUserDetails.password,
      comment: '',
      birthday: new Date(),
      profileImage: null,
      reviews: [],
      following: [],
      followers: [],
      watchlist: [],
    };
    (getOneUserToUserId as jest.Mock).mockResolvedValue(loggedInUserFull);

    // arrange
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // act
    act(() => {
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: loggedInUserDetails.userName },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: loggedInUserDetails.password },
      });
    });

    console.log('## CLICKING LOGIN');
    await act(async () => {
      fireEvent.click(screen.getByText('Login'));
    });
    console.log((getOneUserToUserId as jest.Mock).mock.calls);

    // assert
    expect(getOneUserToUserId as jest.Mock).toHaveBeenCalledWith(
      loggedInUserDetails.userName
    );
    expect(mockSetCookie).toHaveBeenCalledWith(
      'userName',
      loggedInUserDetails.userName,
      {
        path: '/',
      }
    );
    expect(mockSetCookie).toHaveBeenCalledWith(
      'userId',
      loggedInUserDetails.userId,
      {
        path: '/',
      }
    );
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});
