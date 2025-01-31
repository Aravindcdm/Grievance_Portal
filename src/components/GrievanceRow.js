import React, { useState } from 'react';
import "../styles/GrievanceRow.css";

const GrievanceRow = ({ grievance, updateReply, toggleSolved, deleteGrievance }) => {
    const { id, subject, details, department, priority, solved, reply } = grievance;
    
    // Local state for reply input
    const [replyText, setReplyText] = useState(reply || "");

    const handleReplyChange = (e) => {
        setReplyText(e.target.value);
    };

    const handleReplySubmit = () => {
        updateReply(id, replyText); // ✅ Update reply in parent
    };

    const handleStatusClick = () => {
        toggleSolved(id); // ✅ Toggle solved status when clicked
    };

    const handleDeleteClick = () => {
        deleteGrievance(id); // ✅ Delete grievance when clicked
    };

    return (
        <tr className="grievance-row">
            <td>{id}</td>
            <td>{subject}</td>
            <td>{details}</td>
            <td>{department || 'Anonymous'}</td>
            <td>{priority}</td>
            <td>
                <button 
                    className={`grievance-status-button ${solved ? "solved" : "unsolved"}`}
                    onClick={handleStatusClick}
                >
                    {solved ? 'Solved' : 'Unsolved'}
                </button>
            </td>
            <td>
                <textarea 
                    className="grievance-reply"
                    value={replyText}
                    onChange={handleReplyChange}
                    placeholder="Enter reply"
                />
                
            </td>
            <td className='fun-btn'>
            <button className="reply-submit-button" onClick={handleReplySubmit}>Send</button>
                <button className="grievance-delete-button" onClick={handleDeleteClick}>Delete</button>
            </td>
        </tr>
    );
};

export default GrievanceRow;
