import React from 'react';
import "../styles/Statistics.css";
import { FaThList, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Statistics = ({ grievances }) => {
    const total = grievances.length;
    const solved = grievances.filter(g => g.solved).length;
    const unsolved = total - solved;

    const solvedPercentage = total > 0 ? (solved / total) * 100 : 0;
    const unsolvedPercentage = total > 0 ? (unsolved / total) * 100 : 0;

    // Calculate department-wise grievance counts
    const departmentCounts = grievances.reduce((acc, grievance) => {
        const dept = grievance.department || "Unknown"; // Handle cases where department is not provided
        acc[dept] = (acc[dept] || 0) + 1;
        return acc;
    }, {});

    return (
        <div id="statistics-container">
            <h2 id="statistics-title">Statistics</h2>

            {/* Count Box */}
            <div className="count-box">
                <div className="count-item">
                    <FaThList className="count-icon" />
                    <p>Total Grievances</p>
                    <p className="count-number">{total}</p>
                </div>
                <div className="count-item">
                    <FaCheckCircle className="count-icon solved" />
                    <p>Solved Grievances</p>
                    <p className="count-number">{solved}</p>
                </div>
                <div className="count-item">
                    <FaTimesCircle className="count-icon unsolved" />
                    <p>Unsolved Grievances</p>
                    <p className="count-number">{unsolved}</p>
                </div>
            </div>

            {/* Department-wise Grievance Count */}
            <div className="department-section">
                <h3>Grievances by Department</h3>
                {Object.entries(departmentCounts).map(([department, count]) => (
                    <div className="department-item" key={department}>
                        <p><strong>{department}:</strong> {count}</p>
                    </div>
                ))}
            </div>

            {/* Progress Bars */}
            <div className="progress-section">
                <p>Grievances Status:</p>
                <div className="progress-bar solved">
                    <div className="filled" style={{ width: `${solvedPercentage}%` }}></div>
                </div>
                <div className="progress-bar unsolved">
                    <div className="filled" style={{ width: `${unsolvedPercentage}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;
