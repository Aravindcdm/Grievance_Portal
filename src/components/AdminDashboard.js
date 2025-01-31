// src/components/AdminDashboard.js

import React from 'react';
import Statistics from './Statistics.js';
import GrievanceTable from './GrievanceTable';
import Charts from './Charts';


const AdminDashboard = ({ grievances }) => {
    return (
        <div className="admin-dashboard">
            <Statistics grievances={grievances} />
            <GrievanceTable grievances={grievances} />
            <Charts grievances={grievances} />
            
        </div>
    );
};

export default AdminDashboard;
