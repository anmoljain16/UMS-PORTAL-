import React, { useState } from 'react';
import './DriveList.css';

const DriveList = ({ drives }) => {
    const [currentProfile, setCurrentProfile] = useState(drives[0].jobProfile); // Use lowercase jobProfile

    const handleProfileClick = (index) => {
        setCurrentProfile(drives[index].jobProfile); // Use lowercase jobProfile
    };

    return (
        <div className="drive-container">
            <div className="company-list">
                {drives.map((drive, index) => (
                    <div className="company-item" key={index} onClick={() => handleProfileClick(index)}>
                        <h2>{drive.company}</h2> {/* Use lowercase company */}
                        <p>Status: {drive.status}</p> {/* Use lowercase status */}
                    </div>
                ))}
            </div>
            <div className="drive-details">
                <iframe src={currentProfile} title="Job Profile" />
            </div>
        </div>
    );
};

export default DriveList;
