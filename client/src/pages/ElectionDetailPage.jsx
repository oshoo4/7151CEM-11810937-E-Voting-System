import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import positionService from '../services/positionService.js';
import electionService from '../services/electionService.js';
import styles from './Form.module.css';
import PositionManager from '../components/PositionManager.jsx';
import { handle403Error } from '../utils/errorHandler';

const ElectionDetailPage = () => {
  const { electionId } = useParams();
  const navigate = useNavigate();
  
  const [electionDetails, setElectionDetails] = useState(null);
  const [positions, setPositions] = useState([]);
  const [positionTitle, setPositionTitle] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const fetchElectionData = useCallback(async () => {
    try {
      const detailsResponse = await electionService.getById(electionId);
      setElectionDetails(detailsResponse.data);
      setNewStatus(detailsResponse.data.Status);

      const positionsResponse = await positionService.getPositionsForElection(electionId);
      setPositions(positionsResponse.data);
    } catch (error) {
      handle403Error(error, navigate);

      setMessage('Failed to load election data.');
      setIsError(true);
    }
  }, [electionId]);

  useEffect(() => {
    fetchElectionData();
  }, [fetchElectionData]);

  const handleAddPosition = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    try {
      await positionService.create(electionId, positionTitle);
      setPositionTitle('');
      fetchElectionData();
    } catch (error) {
      handle403Error(error, navigate);

      setMessage('Failed to add position.');
      setIsError(true);
    }
  };

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    try {
      const response = await electionService.updateStatus(electionId, newStatus);
      setElectionDetails(response.data);
      setMessage('Status updated successfully!');
    } catch (error) {
      handle403Error(error, navigate);
      
      setMessage('Failed to update status.');
      setIsError(true);
    }
  };

  return (
    <div>
      <h1>Manage Election: {electionDetails ? electionDetails.Title : `ID ${electionId}`}</h1>

      <div className={styles.formContainer} style={{ marginBottom: '2rem', border: '2px solid #6c757d' }}>
        <h2>Election Status</h2>
        <p>Current Status: <strong>{electionDetails ? electionDetails.Status : 'Loading...'}</strong></p>
        <form onSubmit={handleStatusUpdate}>
          <div className={styles.formGroup}>
            <label>Change Status To:</label>
            <select className={styles.formSelect} value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="RegistrationOpen">Registration Open</option>
              <option value="VotingOpen">Voting Open</option>
              <option value="Closed">Closed</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <button type="submit" className={styles.submitButton}>Update Status</button>
        </form>
      </div>
      
      <div className={styles.formContainer} style={{ marginBottom: '2rem', backgroundColor: '#e9ecef' }}>
        <h2>Add New Position to Election</h2>
        <form onSubmit={handleAddPosition}>
          <div className={styles.formGroup}>
            <label htmlFor="positionTitle">Position Title</label>
            <input
              type="text"
              id="positionTitle"
              className={styles.formInput}
              value={positionTitle}
              onChange={(e) => setPositionTitle(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>Add Position</button>
        </form>
      </div>
      
      {message && (
        <div className={`${styles.message} ${isError ? styles.error : styles.success}`} style={{marginTop: '1rem', marginBottom: '1rem'}}>
          {message}
        </div>
      )}

      <div>
        <h2>Manage Positions and Candidates</h2>
        {positions.length > 0 ? (
          positions.map((pos) => (
            <PositionManager 
              key={pos.PositionID} 
              electionId={electionId} 
              position={pos} 
              refreshPositions={fetchElectionData} 
            />
          ))
        ) : (
          <p>No positions have been added to this election yet.</p>
        )}
      </div>
    </div>
  );
};

export default ElectionDetailPage;
