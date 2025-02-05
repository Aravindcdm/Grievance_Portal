import React, { useState, useEffect } from 'react';
import GrievanceRow from './GrievanceRow';
import "../styles/GrievanceTable.css";
import { FaSearch } from 'react-icons/fa';
import axios from 'axios';

const GrievanceTable = ({ grievances, updateGrievances }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");

    const departments = ["All", ...new Set(grievances.map(g => g.department))];

    // Toggle the solved status of a grievance and save to the backend
    const toggleSolved = async (id, currentStatus) => {
        try {
            // Make PUT request to the backend API to update the grievance status
            const response = await axios.put(`http://localhost:5000/api/grievances/${id}`, {
                solved: !currentStatus,  // Toggle the current status
                reply: "" // Pass reply (or leave empty, depending on your logic)
            });
    
            // Assuming the backend returns the updated grievance, update local state
            const updatedGrievances = grievances.map(grievance =>
                grievance._id === id ? { ...grievance, solved: !currentStatus } : grievance
            );
    
            // Update local state
            updateGrievances(updatedGrievances);
    
        } catch (error) {
            console.error("Error updating grievance status:", error);
        }
    };
    
    

    // Update the reply for a grievance and save to the backend
    const updateReply = async (id, newReply) => {
        try {
            await axios.put(`http://localhost:5000/api/grievances/${id}`, { reply: newReply });
            const updatedGrievances = grievances.map(grievance =>
                grievance._id === id ? { ...grievance, reply: newReply } : grievance
            );
            updateGrievances(updatedGrievances);
        } catch (error) {
            console.error("Error updating reply:", error);
        }
    };

    // Delete a grievance and update the backend
    const deleteGrievance = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/grievances/${id}`);
            const updatedGrievances = grievances.filter(grievance => grievance._id !== id);
            updateGrievances(updatedGrievances);
        } catch (error) {
            console.error("Error deleting grievance:", error);
        }
    };

    // Filter grievances based on search and filter criteria
    const filteredGrievances = grievances.filter(g => {
        const matchesSearch = g.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
            g.department.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesDepartment = departmentFilter === "All" || g.department === departmentFilter;
        const matchesStatus = statusFilter === "All" || (statusFilter === "Solved" && g.solved) || (statusFilter === "Unsolved" && !g.solved);
        const matchesPriority = priorityFilter === "All" || g.priority === priorityFilter;

        return matchesSearch && matchesDepartment && matchesStatus && matchesPriority;
    });

    return (
        <div id="grievance-table-container">
            <div id="grievance-filters">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search grievances..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <select onChange={(e) => setDepartmentFilter(e.target.value)} value={departmentFilter}>
                    {departments.map(dep => (
                        <option key={dep} value={dep}>{dep}</option>
                    ))}
                </select>

                <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
                    <option value="All">Status</option>
                    <option value="Solved">Solved</option>
                    <option value="Unsolved">Unsolved</option>
                </select>

                <select onChange={(e) => setPriorityFilter(e.target.value)} value={priorityFilter}>
                    <option value="All">Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
            </div>

            <table id="grievance-table">
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
                    {filteredGrievances.length > 0 ? (
                        filteredGrievances.map((grievance) => (
                            <GrievanceRow 
                                key={grievance._id} 
                                grievance={grievance}
                                updateReply={updateReply}
                                toggleSolved={toggleSolved}
                                deleteGrievance={deleteGrievance}
                            />
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8" className="no-results">No grievances found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default GrievanceTable;
