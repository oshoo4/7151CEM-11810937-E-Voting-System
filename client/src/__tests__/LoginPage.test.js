import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LoginPage from '../pages/LoginPage';
import authService from '../services/authService';

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

jest.mock('../services/authService');


describe('LoginPage', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the login form with all expected fields', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should call authService.login with form data when the form is submitted', async () => {
    const user = userEvent.setup();

    authService.login.mockResolvedValue({ user: { role: 'Staff' } });

    render(<LoginPage />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    await user.type(usernameInput, 'teststaff');
    await user.type(passwordInput, 'password123');
    
    await user.click(loginButton);

    expect(authService.login).toHaveBeenCalledTimes(1);
    
    expect(authService.login).toHaveBeenCalledWith('teststaff', 'password123');
  });
});
