import React, { useState } from 'react';
import "../styles/Notification.css";

const Notification = () => {
    const [show, setShow] = useState(false);

    return (
        <div id="notification-wrapper">
            <div id="messageIcon" onClick={() => setShow(!show)}>
                <i className="fas fa-envelope"></i> {/* FontAwesome Icon */}
            </div>

            <div className={`notification ${show ? "show" : ""}`}>
                <p>New Message!</p>
                <button className="notification-close" onClick={() => setShow(false)}>✖</button>
            </div>
        </div>
    );
};

export default Notification;
