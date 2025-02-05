import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making API requests
import Statistics from './Statistics.js';
import GrievanceTable from './GrievanceTable';
import Charts from './Charts';

const AdminDashboard = () => {
    const [grievances, setGrievances] = useState([]);

    // Fetch grievances from the backend (MongoDB) when component mounts
    useEffect(() => {
        const fetchGrievances = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/grievances");
                setGrievances(response.data); // Update local state with fetched data
            } catch (error) {
                console.error("Error fetching grievances:", error);
            }
        };
    
        fetchGrievances();
    }, []);
    

    // Function to update grievances and sync with backend (MongoDB)
    const updateGrievances = async (newGrievances) => {
        try {
            // Assuming the backend API allows batch update for grievances
            // In case of individual updates, we'll use PUT requests on each grievance.
            // If batch update is not supported, update each grievance separately.
            for (const grievance of newGrievances) {
                await axios.put(`http://localhost:5000/api/grievances/${grievance._id}`, grievance);
            }

            setGrievances(newGrievances);
        } catch (error) {
            console.error("Error updating grievances:", error);
        }
    };

    // Function to delete a grievance and update the list
    const deleteGrievance = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/grievances/${id}`);
            const updatedGrievances = grievances.filter(grievance => grievance._id !== id);
            setGrievances(updatedGrievances);
        } catch (error) {
            console.error("Error deleting grievance:", error);
        }
    };

    return (
        <div className="admin-dashboard">
            <Statistics grievances={grievances} />
            <GrievanceTable 
                grievances={grievances} 
                updateGrievances={updateGrievances} 
                deleteGrievance={deleteGrievance} 
            />
            <Charts grievances={grievances} />
        </div>
    );
};

export default AdminDashboard;
