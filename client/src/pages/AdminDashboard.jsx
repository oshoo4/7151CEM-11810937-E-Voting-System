import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import electionService from '../services/electionService.js';
import styles from './Form.module.css';
import { handle403Error } from '../utils/errorHandler';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [elections, setElections] = useState([]);

  const [title, setTitle] = useState('');
  const [regStartDate, setRegStartDate] = useState('');
  const [regEndDate, setRegEndDate] = useState('');
  const [votingStartDate, setVotingStartDate] = useState('');
  const [votingEndDate, setVotingEndDate] = useState('');
  
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (user?.user?.role === 'Staff') {
      navigate('/staff');
    }
    
    fetchElections();
  }, []);

  const fetchElections = async () => {
    try {
      const response = await electionService.getAll();
      setElections(response.data);
    } catch (error) {
      handle403Error(error, navigate);

      const resMessage = (error.response?.data?.message) || error.message || error.toString();
      setMessage(`Error fetching elections: ${resMessage}`);
      setIsError(true);
    }
  };

  const handleCreateElection = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    
    try {
      const electionData = {
        Title: title,
        RegistrationStartDate: regStartDate,
        RegistrationEndDate: regEndDate,
        VotingStartDate: votingStartDate,
        VotingEndDate: votingEndDate,
        Status: 'Pending',
      };
      
      await electionService.create(electionData);
      setMessage('Election created successfully!');
      
      setTitle('');
      setRegStartDate('');
      setRegEndDate('');
      setVotingStartDate('');
      setVotingEndDate('');
      
      fetchElections();
    } catch (error) {
      handle403Error(error, navigate);
      
      const resMessage = (error.response?.data?.message) || error.message || error.toString();
      setMessage(resMessage);
      setIsError(true);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/admin/staff-management" className={styles.submitButton} style={{ textDecoration: 'none', display: 'inline-block' }}>
          Manage Staff Accounts
        </Link>
      </div>
      
      <div className={styles.formContainer} style={{ marginBottom: '2rem' }}>
        <h2>Create New Election</h2>
        <form onSubmit={handleCreateElection}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Election Title</label>
            <input
              type="text"
              id="title"
              className={styles.formInput}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="regStartDate">Registration Start Date</label>
            <input type="datetime-local" id="regStartDate" className={styles.formInput} value={regStartDate} onChange={(e) => setRegStartDate(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="regEndDate">Registration End Date</label>
            <input type="datetime-local" id="regEndDate" className={styles.formInput} value={regEndDate} onChange={(e) => setRegEndDate(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="votingStartDate">Voting Start Date</label>
            <input type="datetime-local" id="votingStartDate" className={styles.formInput} value={votingStartDate} onChange={(e) => setVotingStartDate(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="votingEndDate">Voting End Date</label>
            <input type="datetime-local" id="votingEndDate" className={styles.formInput} value={votingEndDate} onChange={(e) => setVotingEndDate(e.target.value)} required />
          </div>
          <button type="submit" className={styles.submitButton}>Create Election</button>
        </form>
        {message && (
          <div className={`${styles.message} ${isError ? styles.error : styles.success}`}>
            {message}
          </div>
        )}
      </div>

      <div>
        <h2>Existing Elections</h2>
        {elections.length > 0 ? (
          <ul>
            {elections.map((election) => (
              <li key={election.ElectionID}>
                <Link to={`/admin/election/${election.ElectionID}`}>
                  {election.Title} ({election.Status})
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No elections found. Create one above.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
