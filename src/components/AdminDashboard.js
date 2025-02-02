import React, { useState, useEffect } from 'react';
import Statistics from './Statistics.js';
import GrievanceTable from './GrievanceTable';
import Charts from './Charts';

const AdminDashboard = () => {
    const [grievances, setGrievances] = useState([]);

    // Load grievances from localStorage when component mounts
    useEffect(() => {
        const storedGrievances = JSON.parse(localStorage.getItem("grievances")) || [];
        setGrievances(storedGrievances);
    }, []);

    // Function to update grievances and sync with localStorage
    const updateGrievances = (newGrievances) => {
        setGrievances(newGrievances);
        localStorage.setItem("grievances", JSON.stringify(newGrievances));
    };

    return (
        <div className="admin-dashboard">
            <Statistics grievances={grievances} />
            <GrievanceTable grievances={grievances} updateGrievances={updateGrievances} />
            <Charts grievances={grievances} />
        </div>
    );
};

export default AdminDashboard;
