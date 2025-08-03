import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import authService from './services/authService.js';
import electionService from './services/electionService.js';

import LoginPage from './pages/LoginPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import StaffDashboard from './pages/StaffDashboard.jsx';
import ElectionDetailPage from './pages/ElectionDetailPage.jsx';
import BallotPage from './pages/BallotPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import UserManagementPage from './pages/UserManagementPage.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const [activeElectionId, setActiveElectionId] = useState(null);

  useEffect(() => {
    const findActiveElection = async () => {
      try {
        const response = await electionService.getActive();
        if (response.data) {
          setActiveElectionId(response.data.ElectionID);
        }
      } catch (error) {
        console.log("No active election found for nav link.");
      }
    };
    findActiveElection();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
    window.location.reload();
  };

  return (
    <div>
      <nav>
        {activeElectionId && <Link to={`/results/${activeElectionId}`}>View Live Results</Link>}

        {currentUser ? (
          <>
            {currentUser.user.role === 'Admin' && <Link to="/admin">Admin Dashboard</Link>}
            {currentUser.user.role === 'Staff' && <Link to="/staff">Staff Dashboard</Link>}
            <button onClick={handleLogout} style={{ marginLeft: '1rem' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
          </>
        )}
      </nav>
      <main>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/results/:electionId" element={<ResultsPage />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/election/:electionId" element={<ElectionDetailPage />} />
            <Route path="/admin/staff-management" element={<UserManagementPage />} />
            <Route path="/staff" element={<StaffDashboard />} />
            <Route path="/vote/:electionId" element={<BallotPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;