import {
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
// import mockFetch from './mocks/mockFetch';
import HomePage from '../pages/HomePage';
import '@testing-library/jest-dom';
import LoginPage from '../pages/LoginPage';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../components/GeneralComponents/LoginForm';

beforeEach(() => {
  // jest.spyOn(window, 'fetch').mockImplementation(mockFetch);
});

afterEach(() => {
  // jest.restoreAllMocks();
});
describe('test login page', () => {
  test('renders the login page', async () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    //expect------selector-------------------------------matcher----------------------------
    expect(screen.getByRole('heading')).toHaveTextContent(
      'Sign into your Account'
    );
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: "I don't have an account" })
    ).toBeInTheDocument();
    // expect(screen.getByRole('combobox')).toHaveDisplayValue('Select a breed');
    // expect(
    //   await screen.findByRole('option', { name: 'husky' })
    // ).toBeInTheDocument();
    // expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
    // expect(screen.getByRole('img')).toBeInTheDocument();
  });

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
