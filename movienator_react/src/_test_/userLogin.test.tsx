import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import React from 'react';
import { getOneUserToUserId } from '../services/UserService';
import { User } from '../types/User';

// mock all the backend calls
jest.mock('../services/UserService');

// mock the 'navigate' function to test calls made to it
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// mock the 'setCookie' function to test calls made to it
const mockSetCookie = jest.fn();
jest.mock('react-cookie', () => ({
  useCookies: jest.fn(() => [{}, mockSetCookie]),
}));

describe('test login page', () => {
  test('renders the login page', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Format: expect(selector).matcher();
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
    const fakeUserDetails = {
      userId: 123,
      userName: 'fakeUser',
      password: 'fakePass',
    };

    const fakeUserFull: User = {
      userId: fakeUserDetails.userId,
      firstName: '',
      lastName: '',
      userName: fakeUserDetails.userName,
      password: fakeUserDetails.password,
      comment: '',
      birthday: new Date(),
      profileImage: null,
      reviews: [],
      following: [],
      followers: [],
      watchlist: [],
    };
    // mock backend call with implementation
    (getOneUserToUserId as jest.Mock).mockResolvedValue(fakeUserFull);

    // arrange
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // act
    act(() => {
      fireEvent.change(screen.getByLabelText(/username/i), {
        target: { value: fakeUserDetails.userName },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: fakeUserDetails.password },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Login'));
    });

    // assert
    expect(getOneUserToUserId as jest.Mock).toHaveBeenCalledWith(
      fakeUserDetails.userName
    );
    expect(mockSetCookie).toHaveBeenCalledWith(
      'userName',
      fakeUserDetails.userName,
      {
        path: '/',
      }
    );
    expect(mockSetCookie).toHaveBeenCalledWith(
      'userId',
      fakeUserDetails.userId,
      {
        path: '/',
      }
    );
    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });
});
