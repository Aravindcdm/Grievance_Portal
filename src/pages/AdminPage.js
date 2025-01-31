import React, { useEffect, useState } from 'react';
import AdminDashboard from '../components/AdminDashboard';
import { loadGrievances } from '../api/grievanceApi';
import "../styles/AdminPage.css"; // Import the CSS file
import Notification from '../components/Notification';

const AdminPage = () => {
    const [grievances, setGrievances] = useState([]);

    useEffect(() => {
        const data = loadGrievances();
        setGrievances(data);
    }, []);

    return (
        <div id="admin-page">
            <h1 id="admin-page-title">Admin Dashboard</h1>
            <div id="admin-dashboard-container">
                <AdminDashboard grievances={grievances} />
            </div>
            <Notification />
        </div>
    );
};

export default AdminPage;
