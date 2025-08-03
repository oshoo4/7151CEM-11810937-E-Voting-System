import React, { useState, useEffect } from 'react';
import candidateService from '../services/candidateService.js';
import positionService from '../services/positionService.js';
import styles from '../pages/Form.module.css';

const PositionManager = ({ electionId, position, refreshPositions }) => {
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState('');
  
  const [candidateFullName, setCandidateFullName] = useState('');
  const [candidateParty, setCandidateParty] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [newPositionTitle, setNewPositionTitle] = useState(position.Title);

  useEffect(() => {
    fetchCandidates();
  }, [electionId, position.PositionID]);

  const fetchCandidates = async () => {
    try {
      const response = await candidateService.getCandidatesForPosition(electionId, position.PositionID);
      setCandidates(response.data);
    } catch (error) {
      setMessage('Failed to fetch candidates');
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    try {
      await candidateService.create(electionId, position.PositionID, { fullName: candidateFullName, partyAffiliation: candidateParty });
      setCandidateFullName('');
      setCandidateParty('');
      fetchCandidates();
    } catch (error) {
      setMessage('Failed to add candidate');
    }
  };

  const handleUpdatePosition = async (e) => {
    e.preventDefault();
    try {
      await positionService.update(electionId, position.PositionID, newPositionTitle);
      setIsEditing(false); 
      refreshPositions(); 
    } catch (error) {
      setMessage('Failed to update position title.');
    }
  };

  const handleDeletePosition = async () => {
    if (window.confirm(`Are you sure you want to delete the position "${position.Title}"? This will also delete all its candidates.`)) {
      try {
        await positionService.deleteById(electionId, position.PositionID);
        refreshPositions();
      } catch (error) {
        setMessage('Failed to delete position.');
      }
    }
  };

  return (
    <div className={styles.formContainer} style={{ borderLeft: '4px solid #007bff', marginTop: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        {!isEditing ? (
          <h3>{position.Title}</h3>
        ) : (
          <form onSubmit={handleUpdatePosition} style={{ flex: 1, display: 'flex', gap: '10px' }}>
            <input 
              type="text" 
              className={styles.formInput}
              value={newPositionTitle}
              onChange={(e) => setNewPositionTitle(e.target.value)}
            />
            <button type="submit" className={styles.submitButton}>Save</button>
          </form>
        )}
        <div>
          <button onClick={() => setIsEditing(!isEditing)} style={{ marginRight: '10px' }}>{isEditing ? 'Cancel' : 'Edit'}</button>
          <button onClick={handleDeletePosition} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
        </div>
      </div>
      <hr />
      
      <div>
        <h4>Candidates</h4>
        {candidates.length > 0 ? (
          <ul>
            {candidates.map((cand) => (
              <li key={cand.CandidateID}>{cand.FullName} ({cand.PartyAffiliation || 'Independent'})</li>
            ))}
          </ul>
        ) : <p>No candidates added yet.</p>}
      </div>

      <form onSubmit={handleAddCandidate} style={{ marginTop: '1rem' }}>
        <h4>Add New Candidate</h4>
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input type="text" className={styles.formInput} value={candidateFullName} onChange={(e) => setCandidateFullName(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Party Affiliation</label>
          <input type="text" className={styles.formInput} value={candidateParty} onChange={(e) => setCandidateParty(e.target.value)} />
        </div>
        <button type="submit" className={styles.submitButton}>Add Candidate</button>
      </form>
      {message && <p style={{ color: 'red', marginTop: '1rem' }}>{message}</p>}
    </div>
  );
};

export default PositionManager;
