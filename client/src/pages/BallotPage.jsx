import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import ballotService from '../services/ballotService.js';
import voteService from '../services/voteService.js';
import styles from './Form.module.css';
import { handle403Error } from '../utils/errorHandler';

const BallotPage = () => {
  const { electionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const votingToken = location.state?.votingToken;

  const [ballotData, setBallotData] = useState([]);
  const [selections, setSelections] = useState({});
  const [message, setMessage] = useState('Loading ballot...');
  const [isError, setIsError] = useState(false);

  const [hasVoted, setHasVoted] = useState(
    sessionStorage.getItem(`voted_in_election_${electionId}`) === 'true'
  );

  useEffect(() => {
    if (!votingToken && !hasVoted) {
      navigate('/staff');
      return;
    }

    if (!hasVoted) {
      ballotService.get(electionId)
        .then(response => {
          setBallotData(response.data);
          setMessage('');
        })
        .catch(error => {
          setMessage('Failed to load ballot. Please try again.');
          setIsError(true);
        });
    } else {
        setMessage('Thank you! Your vote has been cast successfully.');
        setIsError(false);
    }
  }, [electionId, votingToken, navigate, hasVoted]);

  const handleSelectionChange = (positionId, candidateId) => {
    setSelections({ ...selections, [positionId]: candidateId });
  };

  const handleCastVote = async (e) => {
    e.preventDefault();
    setMessage('Casting your vote...');
    setIsError(false);
    try {
      await voteService.castVote(selections, votingToken);
      setMessage('Thank you! Your vote has been cast successfully.');
      setHasVoted(true);
      sessionStorage.setItem(`voted_in_election_${electionId}`, 'true');
    } catch (error) {
      handle403Error(error, navigate);
      
      const resMessage = (error.response?.data?.message) || 'An error occurred while casting your vote.';
      setMessage(resMessage);
      setIsError(true);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Official Ballot</h2>
      <form onSubmit={handleCastVote}>
        {ballotData.length > 0 && !hasVoted ? (
          ballotData.map((position) => (
            <div key={position.PositionID} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #ccc', paddingBottom: '1.5rem' }}>
              <h3>{position.Title}</h3>
              {position.candidates.map((candidate) => (
                <div key={candidate.CandidateID} style={{ margin: '0.5rem 0' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}>
                    <input
                      type="radio"
                      name={`position-${position.PositionID}`}
                      value={candidate.CandidateID}
                      onChange={() => handleSelectionChange(position.PositionID, candidate.CandidateID)}
                      required
                    />
                    {candidate.FullName} ({candidate.PartyAffiliation || 'Independent'})
                  </label>
                </div>
              ))}
            </div>
          ))
        ) : null}
        {!hasVoted && ballotData.length > 0 && (
          <button type="submit" className={styles.submitButton}>Cast My Vote</button>
        )}
      </form>
      {message && (
        <div className={`${styles.message} ${isError ? styles.error : styles.success}`} style={{marginTop: '1rem'}}>
          {message}
        </div>
      )}
    </div>
  );
};

export default BallotPage;