import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

import AdminDashboard from '../pages/AdminDashboard';
import electionService from '../services/electionService';

jest.mock('../services/electionService');

describe('AdminDashboard', () => {
  const renderComponent = () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all static elements and forms correctly', () => {
    electionService.getAll.mockResolvedValue({ data: [] });
    renderComponent();
    expect(screen.getByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /create new election/i })).toBeInTheDocument();
  });

  it('should fetch and display a list of elections on mount', async () => {
    const mockElections = [
      { ElectionID: 1, Title: 'Spring Election 2025', Status: 'Pending' },
      { ElectionID: 2, Title: 'Fall Election 2025', Status: 'VotingOpen' },
    ];
    electionService.getAll.mockResolvedValue({ data: mockElections });
    renderComponent();
    expect(await screen.findByText(/spring election 2025/i)).toBeInTheDocument();
    expect(await screen.findByText(/fall election 2025/i)).toBeInTheDocument();
    expect(electionService.getAll).toHaveBeenCalledTimes(1);
  });

  it('should call create service on form submission and refresh the list', async () => {
    const user = userEvent.setup();
    electionService.getAll.mockResolvedValue({ data: [] });
    electionService.create.mockResolvedValue({ data: { message: 'Success' } });

    renderComponent();
    
    await user.type(screen.getByLabelText(/election title/i), 'New Test Election');
    await user.type(screen.getByLabelText(/registration start date/i), '2025-01-01T10:00');
    await user.type(screen.getByLabelText(/registration end date/i), '2025-01-31T17:00');
    await user.type(screen.getByLabelText(/voting start date/i), '2025-02-01T09:00');
    await user.type(screen.getByLabelText(/voting end date/i), '2025-02-02T20:00');
    
    await user.click(screen.getByRole('button', { name: /create election/i }));

    await waitFor(() => {
      expect(electionService.create).toHaveBeenCalledTimes(1);
      expect(electionService.create).toHaveBeenCalledWith(expect.objectContaining({
        Title: 'New Test Election',
        Status: 'Pending'
      }));
    });

    await waitFor(() => {
      expect(electionService.getAll).toHaveBeenCalledTimes(2);
    });
  });
});
