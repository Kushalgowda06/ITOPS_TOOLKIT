import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './DarkLandingPage.scss';
import './ModernCards.scss';
import awsIcon from "../../../assets/awsIcon.png";
import azureIcon from "../../../assets/azureIcon.png";
import gcpIcon from "../../../assets/gcpIcon.png";

const DarkLandingPage: React.FC = () => {
    const navigate = useNavigate(); 

   
    const referenceCards = [
        {
            id: 'ref1',
            title: 'Total Cost',
            count: '1271.2k',
            color: '#0078d4', 
        },
        {
            id: 'ref2',
            title: 'ForeCost',
            count: '1231.2k',
            color: '#ffa500', 
        },
        {
            id: 'ref3',
            title: 'Budget',
            count: '231.2k',
            color: '#00d084',
        },
        {
            id: 'ref4',
            title: 'Avg Cost',
            count: '838.2k',
            color: '#00bcd4', 
        },
        {
            id: 'ref5',
            title: 'Max Cost',
            count: '123.2k',
            color: '#ff9800', 
        },
        {
            id: 'ref6',
            title: 'Savings',
            count: '45.8k',
            color: '#9c27b0', 
        },
    ];

    const cardData = [
        {
            id: 1,
            number: '1',
            icon: gcpIcon,
            title: 'LanchStack',
            description: 'Intelligent IT operations with automated incident response, service management, and knowledge assistance',
            link: '/dashboard',
            iconColor: '#10b981', 
            gradientStart: '#10b981', 
            gradientEnd: '#3730a3', 
        },
        {
            id: 2,
            number: '2',
            icon: azureIcon,
            title: 'Dashboard',
            description: 'Advanced data analytics, machine learning, and business intelligence',
            link: '/dashboard',
            iconColor: '#8b5cf6', 
            gradientStart: '#8b5cf6',
            gradientEnd: '#4f46e5', 
        },
        {
            id: 3,
            number: '3',
            icon: awsIcon,
            title: 'Reports',
            description: 'Next-generation workplace productivity and collaboration tools',
            link: '/worknext',
            iconColor: '#f472b6',
            gradientStart: '#f472b6', 
            gradientEnd: '#4338ca', 
        },
        {
            id: 4,
            number: '4',
            icon: gcpIcon,
            title: 'Onboarding',
            description: 'Infrastructure automation, CI/CD pipelines, and deployment orchestration',
            link: '/onboarding-page',
            iconColor: '#3b82f6', 
            gradientStart: '#3b82f6',
            gradientEnd: '#2563eb',
        },
    ];

    return (
        <div className="modern-landing-page">
             <h1>Dark Landing Page</h1>
             <p>This is a sample component with a dark theme.</p>
            {/* Reference Cards Section - Top */}
           

           
            <div className="modern-card-container">
                {cardData.map((card) => (
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
            <div className="modern-reference-cards-container">
                {referenceCards.map((card) => (
                    <div
                        className="modern-reference-card"
                        key={card.id}
                        style={{ 
                            borderColor: card.color
                        }}
                    >
                        <div className="modern-reference-card-content">
                            <h3 className="modern-reference-card-title">{card.title}</h3>
                            <p className="modern-reference-card-count" style={{ color: card.color }}>{card.count}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DarkLandingPage;