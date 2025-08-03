import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

import StaffDashboard from '../pages/StaffDashboard.jsx';

import voterService from '../services/voterService.js';
import electionService from '../services/electionService.js';

jest.mock('../services/voterService.js');
jest.mock('../services/electionService.js');
jest.mock('../components/LivenessComponent.jsx', () => () => <div data-testid="liveness-component">Mock Liveness Component</div>);
jest.mock('../components/VoterIdCard.jsx', () => ({ voter }) => <div data-testid="voter-id-card">ID Card for {voter.FullName}</div>);

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));


describe('StaffDashboard', () => {

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <StaffDashboard />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the main menu with registration and authentication forms', () => {
    renderComponent();

    expect(screen.getByRole('heading', { name: /staff dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /voter registration/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /voter authentication/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start enrolment/i })).toBeInTheDocument();

    expect(electionService.getActive).not.toHaveBeenCalled();
  });

  it('should switch to the liveness component when starting enrolment', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    await user.type(screen.getByLabelText(/full name/i), 'New Voter');
    await user.type(screen.getByLabelText(/date of birth/i), '2002-02-02');
    await user.click(screen.getByRole('button', { name: /start enrolment/i }));

    expect(screen.getByTestId('liveness-component')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /registering: new voter/i })).toBeInTheDocument();
  });

  it('should call voterService and electionService when searching for a voter', async () => {
    const user = userEvent.setup();
    const mockVoter = { PublicVoterID: 'VOTER-123', FullName: 'Test Voter' };
    const mockElection = { ElectionID: 3, Title: 'Active Election' };

    voterService.findByPublicId.mockResolvedValue({ data: mockVoter });
    electionService.getActive.mockResolvedValue({ data: mockElection });
    
    renderComponent();

    await user.type(screen.getByLabelText(/public voter id/i), 'VOTER-123');
    await user.click(screen.getByRole('button', { name: /search and verify/i }));

    await waitFor(() => {
      expect(voterService.findByPublicId).toHaveBeenCalledWith('VOTER-123');
      expect(electionService.getActive).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByTestId('liveness-component')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /verifying: test voter/i })).toBeInTheDocument();
  });
});
