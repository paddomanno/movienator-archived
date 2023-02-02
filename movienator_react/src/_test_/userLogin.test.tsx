import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import React from 'react';
import { getOneUserToUserId } from '../services/UserService';
import { User } from '../types/User';

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

describe('test login page', () => {
  test('renders the login page', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // expect(selector).matcher();
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

    console.log('## CLICKING LOGIN');
    await act(async () => {
      fireEvent.click(screen.getByText('Login'));
    });
    console.log((getOneUserToUserId as jest.Mock).mock.calls);

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

  // test('navigation to signup Page', async () => {
  //   // testet noch nichts...
  //   // arrange
  //   const loginMock = jest.fn();
  //   render(
  //     <BrowserRouter>
  //       <LoginPage />
  //     </BrowserRouter>
  //   );

  //   // act
  //   const button = screen.getByRole('button', {
  //     name: "I don't have an account",
  //   });
  //   fireEvent.click(button); // navigation to SignUpPage.tsx

  //   // assert
  //   // const newScreen = await screen.findByText('Register a new Account'); // Heading in SignupForm.tsx
  //   // expect(newScreen).toBeOnTheScreen();
  //   // screen.debug();
  // });

  // test('should be able to search and display dog image results', async () => {
  //   render(<App />);

  //   //Simulate selecting an option and verifying its value
  //   const select = screen.getByRole('combobox');
  //   expect(
  //     await screen.findByRole('option', { name: 'cattledog' })
  //   ).toBeInTheDocument();
  //   userEvent.selectOptions(select, 'cattledog');
  //   expect(select).toHaveValue('cattledog');

  //   //Initiate the search request
  //   const searchBtn = screen.getByRole('button', { name: 'Search' });
  //   expect(searchBtn).not.toBeDisabled();
  //   userEvent.click(searchBtn);

  //   //Loading state displays and gets removed once results are displayed
  //   await waitForElementToBeRemoved(() => screen.queryByText(/Loading/i));

  //   //Verify image display and results count
  //   const dogImages = screen.getAllByRole('img');
  //   expect(dogImages).toHaveLength(2);
  //   expect(screen.getByText(/2 Results/i)).toBeInTheDocument();
  //   expect(dogImages[0]).toHaveAccessibleName('cattledog 1 of 2');
  //   expect(dogImages[1]).toHaveAccessibleName('cattledog 2 of 2');
  // });
});
