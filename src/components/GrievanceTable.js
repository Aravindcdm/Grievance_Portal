import React, { useState } from 'react';
import GrievanceRow from './GrievanceRow';
import "../styles/GrievanceTable.css";
import { FaSearch } from 'react-icons/fa';

const GrievanceTable = ({ grievances, updateGrievances }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");

    const departments = ["All", ...new Set(grievances.map(g => g.department))];

    const toggleSolved = (id) => {
        const updatedGrievances = grievances.map(grievance =>
            grievance.id === id ? { ...grievance, solved: !grievance.solved } : grievance
        );
        updateGrievances(updatedGrievances);
    };

    const updateReply = (id, newReply) => {
        const updatedGrievances = grievances.map(grievance =>
            grievance.id === id ? { ...grievance, reply: newReply } : grievance
        );
        updateGrievances(updatedGrievances);
    };

    const deleteGrievance = (id) => {
        const updatedGrievances = grievances.filter(grievance => grievance.id !== id);
        updateGrievances(updatedGrievances);
    };

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
                    <option value="All">All</option>
                    <option value="Solved">Solved</option>
                    <option value="Unsolved">Unsolved</option>
                </select>

                <select onChange={(e) => setPriorityFilter(e.target.value)} value={priorityFilter}>
                    <option value="All">All</option>
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
                                key={grievance.id} 
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
