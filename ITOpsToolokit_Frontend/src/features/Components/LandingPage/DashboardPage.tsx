import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DarkLandingPage.scss';
import './ModernCards.scss';
import awsIcon from "../../../assets/awsIcon.png";
import azureIcon from "../../../assets/azureIcon.png";
import gcpIcon from "../../../assets/gcpIcon.png";

const DashboardPage: React.FC = () => {
    const navigate = useNavigate();

    const dashboardCards = [
        {
            id: 1,
            icon: gcpIcon,
            title: 'Tagging',
            description: 'Advanced data analytics, machine learning, and business intelligence for better insights',
            link: '/tagging-policy',
            gradientStart: '#10b981', 
            gradientEnd: '#3730a3', 
        },
        {
            id: 2,
            icon: azureIcon,
            title: 'Orphan',
            description: 'Comprehensive reporting tools and dashboards for data visualization',
            link: '/orphan-objects',
            gradientStart: '#8b5cf6', 
            gradientEnd: '#4f46e5', 
        },
        {
            id: 3,
            icon: awsIcon,
            title: 'Advisory',
            description: 'Real-time monitoring and alerting system for infrastructure management',
            link: '/cloud-advisory',
            gradientStart: '#f472b6', 
            gradientEnd: '#4338ca', 
        },
        {
            id: 4,
            icon: gcpIcon,
            title: 'Patching',
            description: 'System configuration and user management settings',
            link: 'Patch-Dashboard',
            gradientStart: '#3b82f6', 
            gradientEnd: '#1e40af',
        },
    ];

    return (
        <div className="modern-landing-page">
            <h1>Dashboard</h1>
            <div className="modern-card-container">
                {dashboardCards.map((card) => (
                    <div
                        className="modern-card"
                        key={card.id}
                        onClick={() => card.link && navigate(card.link)}
                        style={{ cursor: card.link ? 'pointer' : 'default' }}
                    >
                        <div 
                            className="modern-card-icon" 
                            style={{ 
                                '--icon-color-start': card.gradientStart,
                                '--icon-color-end': card.gradientEnd
                            } as React.CSSProperties}
                        >
                            <img src={card.icon} alt={`${card.title} Icon`} />
                        </div>
                        <h2 className="modern-card-title">{card.title}</h2>
                        <p className="modern-card-description">{card.description}</p>
                        <a href={card.link} className="modern-card-link">EXPLORE AGENTIC NETWORK</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashboardPage;