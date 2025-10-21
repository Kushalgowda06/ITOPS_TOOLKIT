import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface Props {
  isLoading: boolean;
}
export const AnalyticsLoader = ({ isLoading}) => {
  return (
    <>
      {isLoading ? (
        //  <Box className= {Api.getPopUpData() ? 'loader1' : "loader"}>
          <Box className= "analytics_loader">
          <CircularProgress />
        </Box>
      ) : null}
    </>
  );
};
