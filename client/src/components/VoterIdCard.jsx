import React from 'react';
import styles from '../pages/Form.module.css';

const VoterIdCard = ({ voter }) => {
  if (!voter) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="printable-area"> 
      <div className={styles.formContainer} style={{ border: '2px solid #007bff' }}>
        <h2>Voter Identification Card</h2>
        <div style={{ textAlign: 'center' }}>
          <img 
            src={voter.PhotoUrl} 
            alt="Voter" 
            style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #ccc' }} 
          />
          <h3>{voter.FullName}</h3>
          <p><strong>Public Voter ID:</strong></p>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px', backgroundColor: '#f4f7f6', padding: '10px', borderRadius: '4px' }}>
            {voter.PublicVoterID}
          </p>
        </div>
        <button type="button" onClick={handlePrint} className={styles.submitButton}>
          Print ID Card
        </button>
      </div>
    </div>
  );
};

export default VoterIdCard;