import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface Props {
  isLoading: boolean;
}
export const Loader = ({ isLoading, load }) => {
  return (
    <>
      {isLoading ? (
        //  <Box className= {Api.getPopUpData() ? 'loader1' : "loader"}>
          <Box className= {load ? 'loader1' : "loader"}>
          <CircularProgress />
        </Box>
      ) : null}
    </>
  );
};
