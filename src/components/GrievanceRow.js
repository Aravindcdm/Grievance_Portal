import React, { useState, useEffect } from 'react';
import "../styles/GrievanceRow.css";
const GrievanceRow = ({ grievance, updateReply, toggleSolved, deleteGrievance }) => {
    const { _id, subject, details, department, priority, solved, reply } = grievance;

    // Local state for reply input
    const [replyText, setReplyText] = useState(reply || "");

    // Update the local reply state whenever the initial reply prop changes
    useEffect(() => {
        setReplyText(reply || "");
    }, [reply]);

    const handleReplyChange = (e) => {
        setReplyText(e.target.value);
    };

    const handleReplySubmit = () => {
        updateReply(_id, replyText); // ✅ Update reply in parent (AdminDashboard)
    };

    const handleStatusClick = () => {
        toggleSolved(_id, solved); // ✅ Toggle solved status when clicked
    };

    const handleDeleteClick = () => {
        deleteGrievance(_id); // ✅ Delete grievance when clicked
    };

    return (
        <tr className="grievance-row">
            <td>{_id}</td>
            <td>{subject}</td>
            <td>{details}</td>
            <td>{department || 'Anonymous'}</td>
            <td>{priority}</td>
            <td>
                <button 
                    className={`grievance-status-button ${solved ? "solved" : "unsolved"}`}
                    onClick={handleStatusClick} // Toggle status when clicked
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
