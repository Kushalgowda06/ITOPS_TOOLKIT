import React from 'react';
import awsIcon from "../../../assets/azureIcon.png";
 
 
const ProjectCard = ({ title, description, Status = undefined, onClick = null, isActive = false }) => {
    console.log("ProjectCard",Status)
    return (
        <div 
            className={`card custom-card text-center p-3 ${isActive ? 'bg-primary text-white' : ''}`} 
            onClick={onClick} 
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <h5 className={`card-title text-wrap fs-6 fw-bold ${isActive ? 'text-white' : ''}`}>{title}</h5>
            {Status !== undefined && Status !== null && String(Status).trim() !== '' && (
                <div className={`${isActive ? 'text-white' : 'text-muted'} mb-2`} style={{ fontSize: '12px' }}>
                    Status :- {String(Status)}
                </div>
            )}
            <div className="card-icon">
                <img
                    src={awsIcon}
                    alt="awsIcon"
                    className="cursor-pointer"
                    style={{ width: "25px", height: "25px" , color: '011A80' }}
                />
            </div>
            <p className={`p-2 f-size card-text ${isActive ? 'text-white-50' : ''}`}>{description}</p>
        </div>
    );
};
 
export default ProjectCard;