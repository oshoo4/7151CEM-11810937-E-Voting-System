import React, { useState, useEffect } from 'react';
import userService from '../services/userService.js';
import styles from './Form.module.css';
import { useNavigate } from 'react-router-dom';
import { handle403Error } from '../utils/errorHandler';

const UserManagementPage = () => {
  const navigate = useNavigate();

  const [staffList, setStaffList] = useState([]);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await userService.getAllStaff();
      setStaffList(response.data);
    } catch (error) {
      handle403Error(error, navigate);

      setMessage('Failed to fetch staff list.');
      setIsError(true);
    }
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    try {
      await userService.createStaff({ fullName, username, password });
      setMessage('Staff account created successfully!');
      setFullName('');
      setUsername('');
      setPassword('');
      fetchStaff();
    } catch (error) {
      handle403Error(error, navigate);

      setMessage(error.response?.data?.message || 'Failed to create staff account.');
      setIsError(true);
    }
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    setMessage('');
    setIsError(false);
    try {
      await userService.updateUserStatus(userId, !currentStatus);
      setMessage('Staff status updated successfully.');
      fetchStaff();
    } catch (error) {
      handle403Error(error, navigate);
      
      setMessage('Failed to update staff status.');
      setIsError(true);
    }
  };

  return (
    <div>
      <h1>Admin: Staff Management</h1>

      <div className={styles.formContainer} style={{ marginBottom: '2rem' }}>
        <h2>Create New Staff Account</h2>
        <form onSubmit={handleCreateStaff}>
          <div className={styles.formGroup}>
            <label>Full Name</label>
            <input type="text" className={styles.formInput} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label>Username</label>
            <input type="text" className={styles.formInput} value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label>Password</label>
            <input type="password" className={styles.formInput} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className={styles.submitButton}>Create Staff</button>
        </form>
      </div>
      
      {message && (
        <div className={`${styles.message} ${isError ? styles.error : styles.success}`} style={{marginTop: '1rem', marginBottom: '1rem'}}>
          {message}
        </div>
      )}

      <div className={styles.formContainer}>
        <h2>Existing Staff Accounts</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ccc' }}>Full Name</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ccc' }}>Username</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ccc' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ccc' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((staff) => (
              <tr key={staff.UserID}>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{staff.FullName}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{staff.Username}</td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                  <span style={{ color: staff.IsActive ? 'green' : 'red' }}>
                    {staff.IsActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
                  <button onClick={() => handleStatusToggle(staff.UserID, staff.IsActive)}>
                    {staff.IsActive ? 'Deactivate' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;
