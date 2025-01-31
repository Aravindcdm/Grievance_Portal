import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import styles from './Admin.module.css'; // Import the renamed CSS Module file

const Admin = () => {
  const [grievances, setGrievances] = useState([]);
  const [notification, setNotification] = useState('');
  const [departmentCounts, setDepartmentCounts] = useState({});

  // Declare chart instances at the top of the component
  let departmentChartInstance = null;
  let subjectChartInstance = null;

  useEffect(() => {
    loadGrievances();
  }, []);

  const loadGrievances = () => {
    const storedGrievances = JSON.parse(localStorage.getItem('grievances')) || [];
    setGrievances(storedGrievances);
    updateStatistics(storedGrievances);
    updateCharts(storedGrievances);
  };

  const updateStatistics = (grievances) => {
    const total = grievances.length;
    const solved = grievances.filter(g => g.solved).length;
    const unsolved = total - solved;

    const departmentCounts = grievances.reduce((counts, grievance) => {
      const department = grievance.department || 'Anonymous';
      counts[department] = (counts[department] || 0) + 1;
      return counts;
    }, {});

    setDepartmentCounts(departmentCounts);

    const solvedProgress = (solved / total) * 100;
    const unsolvedProgress = (unsolved / total) * 100;

    return {
      total,
      solved,
      unsolved,
      solvedProgress,
      unsolvedProgress,
    };
  };

  const updateCharts = (grievances) => {
    if (departmentChartInstance) {
      departmentChartInstance.destroy();
      departmentChartInstance = null;
    }

    if (subjectChartInstance) {
      subjectChartInstance.destroy();
      subjectChartInstance = null;
    }

    const departmentCounts = grievances.reduce((acc, g) => {
      acc[g.department || 'Anonymous'] = (acc[g.department || 'Anonymous'] || 0) + 1;
      return acc;
    }, {});

    const departmentCanvas = document.getElementById('departmentChartCanvas');
    if (departmentCanvas) {
      departmentCanvas.getContext('2d').clearRect(0, 0, departmentCanvas.width, departmentCanvas.height);

      departmentChartInstance = new Chart(departmentCanvas.getContext('2d'), {
        type: 'pie',
        data: {
          labels: Object.keys(departmentCounts),
          datasets: [{
            data: Object.values(departmentCounts),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#F39C12'],
          }],
        },
      });
    }

    const subjectCounts = grievances.reduce((acc, g) => {
      acc[g.subject] = (acc[g.subject] || 0) + 1;
      return acc;
    }, {});

    const subjectCanvas = document.getElementById('subjectChartCanvas');
    if (subjectCanvas) {
      subjectCanvas.getContext('2d').clearRect(0, 0, subjectCanvas.width, subjectCanvas.height);

      subjectChartInstance = new Chart(subjectCanvas.getContext('2d'), {
        type: 'pie',
        data: {
          labels: Object.keys(subjectCounts),
          datasets: [{
            data: Object.values(subjectCounts),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#F39C12'],
          }],
        },
      });
    }
  };

  const toggleStatus = (index) => {
    const updatedGrievances = [...grievances];
    updatedGrievances[index].solved = !updatedGrievances[index].solved;
    localStorage.setItem('grievances', JSON.stringify(updatedGrievances));
    setGrievances(updatedGrievances);
    updateStatistics(updatedGrievances);
    updateCharts(updatedGrievances);
  };

  const addReply = (index, reply) => {
    const updatedGrievances = [...grievances];
    updatedGrievances[index].reply = reply;
    localStorage.setItem('grievances', JSON.stringify(updatedGrievances));
    setGrievances(updatedGrievances);
  };

  const sendMessage = (index) => {
    const updatedGrievances = [...grievances];
    const grievance = updatedGrievances[index];
    const message = grievance.reply || '';

    if (!message.trim()) {
      alert('Please enter a message before sending.');
      return;
    }

    showNotification(`Message Sent to ${grievance.department || 'Anonymous'}`);
    updatedGrievances[index].replySent = true;
    localStorage.setItem('grievances', JSON.stringify(updatedGrievances));
    setGrievances(updatedGrievances);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 3000);
  };

  const deleteGrievance = (index) => {
    const updatedGrievances = [...grievances];
    updatedGrievances.splice(index, 1);
    localStorage.setItem('grievances', JSON.stringify(updatedGrievances));
    setGrievances(updatedGrievances);
    updateStatistics(updatedGrievances);
    updateCharts(updatedGrievances);
  };

  return (
    <div className={styles.adminBody}>
      <h1 className={styles.adminTitle}>Admin Dashboard</h1>

      {notification && <div className={styles.notification}>{notification}</div>}

      <div className={styles.adminStatistics}>
        <h2>Statistics</h2>
        <div className={styles.countBox}>
          <div className={styles.countItem}>
            <i className="fas fa-th-list"></i>
            <p>Total Grievances</p>
            <p>{grievances.length}</p>
          </div>
          <div className={styles.countItem}>
            <i className="fas fa-check-circle"></i>
            <p>Solved Grievances</p>
            <p>{grievances.filter(g => g.solved).length}</p>
          </div>
          <div className={styles.countItem}>
            <i className="fas fa-times-circle"></i>
            <p>Unsolved Grievances</p>
            <p>{grievances.filter(g => !g.solved).length}</p>
          </div>
        </div>

        <p>Grievances Status:</p>
        <div className={styles.progressBarSolved}>
          <div style={{ width: `${(grievances.filter(g => g.solved).length / grievances.length) * 100}%` }} className={styles.filled}></div>
        </div>
        <div className={styles.progressBarUnsolved}>
          <div style={{ width: `${(grievances.filter(g => !g.solved).length / grievances.length) * 100}%` }} className={styles.filled}></div>
        </div>

        <p>Grievances by Department:</p>
        <ul className={styles.departmentList}>
          {Object.entries(departmentCounts).map(([department, count]) => (
            <li key={department}>{department}: {count} grievances</li>
          ))}
        </ul>
      </div>

      <table className={styles.adminTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Subject</th>
            <th>Details</th>
            <th>Department</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Reply</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {grievances.map((grievance, index) => (
            <tr key={grievance.id}>
              <td>{grievance.id}</td>
              <td>{grievance.subject}</td>
              <td>{grievance.details}</td>
              <td>{grievance.department || 'Anonymous'}</td>
              <td>{grievance.priority}</td>
              <td>
                <button
                  className={`${styles.statusBtn} ${grievance.solved ? styles.solved : styles.unsolved}`}
                  onClick={() => toggleStatus(index)}>
                  {grievance.solved ? 'Solved' : 'Unsolved'}
                </button>
              </td>
              <td>
                <div className={styles.replyContainer}>
                  <textarea
                    placeholder="Enter reply"
                    value={grievance.reply || ''}
                    onChange={(e) => addReply(index, e.target.value)} />
                  <button onClick={() => sendMessage(index)} className={styles.sendBtn}>Send</button>
                </div>
              </td>
              <td>
                <button onClick={() => deleteGrievance(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.chartContainer}>
        <div>
          <h3 className={styles.chartTitle}>Grievances by Department</h3>
          <canvas id="departmentChartCanvas" className={styles.chart}></canvas>
        </div>
        <div>
          <h3 className={styles.chartTitle}>Grievances by Subject</h3>
          <canvas id="subjectChartCanvas" className={styles.chart}></canvas>
        </div>
      </div>
    </div>
  );
};

export default Admin;
