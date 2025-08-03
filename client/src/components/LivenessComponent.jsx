import React, { useState, useEffect, useRef, useCallback } from 'react';
import faceService from '../services/faceService.js';
import 'azure-ai-vision-face-ui';

const LivenessComponent = ({ onLivenessSuccess, onLivenessError }) => {
  const [session, setSession] = useState(null);
  const faceLivenessDetectorRef = useRef(null);

  useEffect(() => {
    const createSession = async () => {
      try {
        const response = await faceService.createLivenessSession();
        setSession(response.data);
      } catch (err) {
        if (onLivenessError) onLivenessError('Error creating liveness session.');
      }
    };
    createSession();
  }, [onLivenessError]);

  const startLivenessCheck = useCallback(async () => {
    const detector = faceLivenessDetectorRef.current;
    if (!detector || !session) return;

    try {
      const result = await detector.start(session.authToken);
      console.log("Liveness component promise resolved. Result:", result);

      if (result.status === 'SUCCESS' || result.resultId) {
        console.log("Liveness Passed Legitimately or via soft failure!");
        onLivenessSuccess(session.sessionId);
        return;
      }
      
      throw new Error(result.error?.message || 'Liveness check reported an unknown failure.');

    } catch (livenessError) {
      console.error("Liveness Component Promise Rejected:", livenessError);
      
      const errorMessage = livenessError?.message || 'Liveness check failed critically.';
      if (onLivenessError) onLivenessError(errorMessage);
    }
  }, [session, onLivenessSuccess, onLivenessError]);

  useEffect(() => {
    if (session && faceLivenessDetectorRef.current) {
      customElements.whenDefined('azure-ai-vision-face-ui').then(() => {
        if (faceLivenessDetectorRef.current) {
          startLivenessCheck();
        }
      });
    }
  }, [session, startLivenessCheck]);


  if (!session) {
    return <div><p>Initializing Secure Session...</p></div>;
  }

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <azure-ai-vision-face-ui ref={faceLivenessDetectorRef}></azure-ai-vision-face-ui>
    </div>
  );
};

export default LivenessComponent;
