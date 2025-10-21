import React  from "react";
import { useLocation } from "react-router-dom";



export const NotFound = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const handleGoBack = () => {
    if( pathname.includes("home")){

    }else{
      window.location.href = '/home';
    }
   
  };

return (
    <>
     <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">Oops! The page you're looking for doesn't exist.</p>
      <button className="not-found-button" onClick={handleGoBack}>
        Go Back Home
      </button>
    </div>
    </>
  );
  
  
};
