import React  from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { resetLoginDetails, selectCommonConfig } from "../CommonConfig/commonConfigSlice";



export const Unauthorized = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useAppDispatch();

  const handleGoBack = () => {
      window.location.href = '/login';
    dispatch(resetLoginDetails()) 

  };

return (
    <>
     <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">Unauthorized access - please log in again.</p>
      <button className="not-found-button" onClick={ handleGoBack}>
        Go Back Login
      </button>
    </div>
    </>
  );
  
  
};
