import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import resultsService from '../services/resultsService.js';
import electionService from '../services/electionService.js';
import styles from './Form.module.css';

const ResultsPage = () => {
  const { electionId } = useParams();
  const [results, setResults] = useState([]);
  const [electionTitle, setElectionTitle] = useState('');
  const [message, setMessage] = useState('Loading initial results...');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [resultsResponse, detailsResponse] = await Promise.all([
          resultsService.get(electionId),
          electionService.getById(electionId)
        ]);

        setResults(resultsResponse.data);
        setElectionTitle(detailsResponse.data.Title);
        setMessage('Results are live and up-to-date.');
      } catch (error) {
        setMessage('Could not load initial results. Waiting for live updates...');
      }
    };
    
    fetchInitialData();

    const SOCKET_URL = import.meta.env.VITE_API_BASE_URL 
      ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
      : 'http://localhost:5000';

    const socket = io(SOCKET_URL);
    socket.on(`results_updated_${electionId}`, (newResults) => {
      setResults(newResults);
      setMessage('Results are live and up-to-date.');
    });

    return () => {
      socket.disconnect();
    };
  }, [electionId]);

  return (
    <div className={styles.formContainer} style={{maxWidth: '800px'}}>
      <h2>Live Results: {electionTitle || `Election ID ${electionId}`}</h2>
      <p>{message}</p>
      <div style={{width: '100%'}}>
        {results.length > 0 ? (
          Object.values(results.reduce((acc, result) => {
            acc[result.PositionTitle] = acc[result.PositionTitle] || { title: result.PositionTitle, candidates: [] };
            acc[result.PositionTitle].candidates.push(result);
            return acc;
          }, {})).map(positionGroup => (
            <div key={positionGroup.title} style={{marginBottom: '2rem'}}>
              <h3>{positionGroup.title}</h3>
              {positionGroup.candidates.map((result) => (
                <div key={result.CandidateID} style={{ marginBottom: '1rem' }}>
                  <strong>{result.FullName} ({result.PartyAffiliation || 'Independent'})</strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                        height: '24px', 
                        backgroundColor: '#007bff', 
                        width: `${result.VoteCount * 30}px`,
                        minWidth: '2px',
                        transition: 'width 0.5s ease-in-out'
                    }}></div>
                    <span style={{fontWeight: 'bold', fontSize: '1.1rem'}}>{result.VoteCount}</span>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No votes have been cast yet for this election.</p>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
