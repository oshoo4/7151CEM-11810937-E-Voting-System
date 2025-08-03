import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import voterService from '../services/voterService.js';
import electionService from '../services/electionService.js';
import styles from './Form.module.css';
import LivenessComponent from '../components/LivenessComponent.jsx';
import VoterIdCard from '../components/VoterIdCard.jsx';
import { handle403Error } from '../utils/errorHandler';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState('menu');
  
  const [regFullName, setRegFullName] = useState('');
  const [regDob, setRegDob] = useState('');
  const [searchId, setSearchId] = useState('');
  const [foundVoter, setFoundVoter] = useState(null);
  const [capturedImgSrc, setCapturedImgSrc] = useState(null);
  const [newlyRegisteredVoter, setNewlyRegisteredVoter] = useState(null);
  const [activeElection, setActiveElection] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const webcamRef = useRef(null);
  const capture = useCallback(() => setCapturedImgSrc(webcamRef.current.getScreenshot()), [webcamRef]);

  useEffect(() => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (user?.user?.role === 'Admin') {
      navigate('/admin');
    }
  }, []);
  
  const resetAll = () => {
    setWorkflow('menu');
    setRegFullName('');
    setRegDob('');
    setSearchId('');
    setFoundVoter(null);
    setCapturedImgSrc(null);
    setNewlyRegisteredVoter(null);
    setMessage('');
    setIsError(false);
  };
  
  const dataURItoBlob = (dataURI) => {
    if (!dataURI) return null;
    try {
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const byteString = atob(dataURI.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeString });
    } catch (error) {
        console.error("Error converting data URI to Blob:", error);
        return null;
    }
  };
  
  const startEnrolmentWorkflow = (e) => {
    e.preventDefault();
    setWorkflow('liveness_register');
  };

  const startVerificationWorkflow = async (e) => {
    e.preventDefault();
    setMessage('Searching...'); setIsError(false);
    try {
      const voterResponse = await voterService.findByPublicId(searchId);
      setFoundVoter(voterResponse.data);
      const electionResponse = await electionService.getActive();
      setActiveElection(electionResponse.data);
      setWorkflow('liveness_verify');
    } catch (error) {
      handle403Error(error, navigate);

      setMessage(error.response?.data?.message || 'Could not find voter or active election.');
      setIsError(true);
    }
  };

  const handleLivenessSuccess = () => {
    setMessage('Liveness check passed. Please capture a clear photo for the record.');
    setWorkflow(workflow === 'liveness_register' ? 'capture_register' : 'capture_verify');
  };

  const handleLivenessError = (errorMessage) => {
    setMessage(`Process failed: ${errorMessage}`);
    setIsError(true);
    setWorkflow('menu');
  };

  const handleFinalEnrolment = async (e) => {
    e.preventDefault();
    if (!capturedImgSrc) return;
    setMessage('Enrolling voter...'); setIsError(false);
    try {
      const imageBlob = dataURItoBlob(capturedImgSrc);
      const response = await voterService.register(regFullName, regDob, imageBlob);
      setNewlyRegisteredVoter(response.data.voter);
      setMessage('Voter registered successfully!');
      setWorkflow('finished_register');
    } catch (error) { 
      handle403Error(error, navigate);

      setMessage(error.response?.data?.message || 'Enrolment failed.'); setIsError(true); 
    }
  };
  
  const handleFinalVerification = async (e) => {
    e.preventDefault();
    if (!capturedImgSrc) return;
    setMessage('Verifying voter...'); setIsError(false);
    console.log("handleFinalVerification: Captured Image Source (first 100 chars):", capturedImgSrc.substring(0, 100));
    try {
      const imageBlob = dataURItoBlob(capturedImgSrc);
      const response = await voterService.verify(foundVoter.PublicVoterID, imageBlob);
      if (response.data.success) {
        navigate(`/vote/${response.data.electionId}`, {
          state: { votingToken: response.data.votingToken }
        });
      } else { 
        throw new Error('Verification failed.'); 
      }
    } catch (error) { 
      handle403Error(error, navigate);

      setMessage(error.response?.data?.error || 'Verification failed.'); setIsError(true); 
    }
  };

  const videoConstraints = { width: 1280, height: 720, facingMode: "user" };

  const renderWorkflow = () => {
    switch (workflow) {
      case 'liveness_register':
      case 'liveness_verify':
        return (
          <div className={styles.formContainer}>
            <h2>{workflow === 'liveness_register' ? `Registering: ${regFullName}` : `Verifying: ${foundVoter?.FullName}`}</h2>
            <p>Please follow the on-screen instructions.</p>
            <LivenessComponent onLivenessSuccess={handleLivenessSuccess} onLivenessError={handleLivenessError} />
            <button onClick={resetAll} className={styles.submitButton} style={{backgroundColor: '#6c757d', marginTop: '1rem'}}>Cancel</button>
          </div>
        );
      case 'capture_register':
      case 'capture_verify':
        const isRegistering = workflow === 'capture_register';
        return (
          <div className={styles.formContainer}>
            <h2>Capture Final Photo</h2>
            <p>Please ensure the image is clear and well-lit.</p>
            {message && <div className={`${styles.message} ${isError ? styles.error : styles.success}`}>{message}</div>}
            <div style={{ margin: '1rem 0' }}>
              {!capturedImgSrc ? (
                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" width="100%" videoConstraints={videoConstraints} />
              ) : (
                <img src={capturedImgSrc} alt="Final capture" style={{maxWidth: '100%'}}/>
              )}
            </div>
            <button onClick={capture} className={styles.submitButton} style={{width: '100%', marginBottom: '1rem'}}>{capturedImgSrc ? 'Retake Photo' : 'Capture'}</button>
            {capturedImgSrc &&
              <form onSubmit={isRegistering ? handleFinalEnrolment : handleFinalVerification}>
                <button type="submit" className={styles.submitButton} style={{width: '100%'}}>
                  {isRegistering ? 'Complete Enrolment' : 'Complete Verification'}
                </button>
              </form>
            }
          </div>
        );
      case 'finished_register':
        return (
            <div className={styles.formContainer}>
              <h2>Registration Complete</h2>
              <VoterIdCard voter={newlyRegisteredVoter} />
              <button onClick={resetAll} className={styles.submitButton} style={{marginTop: '1rem'}}>Register Another Voter</button>
            </div>
        );
      default:
        return (
          <>
            <div className={styles.formContainer} style={{ marginBottom: '2rem' }}>
              <h2>Voter Registration</h2>
              <form onSubmit={startEnrolmentWorkflow}>
                 <div className={styles.formGroup}>
                    <label htmlFor="regFullName">Full Name</label>
                    <input type="text" id="regFullName" className={styles.formInput} value={regFullName} onChange={e => setRegFullName(e.target.value)} required/>
                </div>
                 <div className={styles.formGroup}>
                    <label htmlFor="regDob">Date of Birth</label>
                    <input type="date" id="regDob" className={styles.formInput} value={regDob} onChange={e => setRegDob(e.target.value)} required/>
                </div>
                <button type="submit" className={styles.submitButton}>Start Enrolment</button>
              </form>
            </div>
            <div className={styles.formContainer}>
              <h2>Voter Authentication</h2>
              <form onSubmit={startVerificationWorkflow}>
                <div className={styles.formGroup}>
                  <label htmlFor="searchId">Public Voter ID</label>
                  <input type="text" id="searchId" className={styles.formInput} value={searchId} onChange={(e) => setSearchId(e.target.value)} required />
                </div>
                <button type="submit" className={styles.submitButton}>Search and Verify</button>
              </form>
            </div>
          </>
        );
    }
  };

  return (
    <div>
      <h1>Staff Dashboard</h1>
      {renderWorkflow()}
      {workflow === 'menu' && message && <div className={`${styles.message} ${isError ? styles.error : styles.success}`}>{message}</div>}
    </div>
  );
};

export default StaffDashboard;
