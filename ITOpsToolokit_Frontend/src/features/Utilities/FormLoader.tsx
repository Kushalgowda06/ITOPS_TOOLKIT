import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import React from 'react';
export const FormLoader = ()=>{
      
return(

   
    <Box  sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 3,
        margin: "4%"
      }}>
      <Grid container spacing={2} justifyContent="space-between" marginLeft="10%">
      
        {[...Array(6)].map((_, index) => (
          <Grid key={index} container spacing={2} justifyContent="space-between"  >
            <Grid item xs={6}>
              <Skeleton variant="rectangular" width={100} height={10} />
              <Skeleton animation="wave" variant="text"  width="80%"   style={{ paddingBottom: 30, marginBottom: 10 }}  />
            </Grid>
            <Grid item xs={6}>
              <Skeleton variant="rectangular" width={100} height={10} />
              <Skeleton animation="wave" width="80%" style={{ paddingBottom: 30 }} />
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid container   columns={2}  justifyContent="space-around">
     
    
      <Skeleton animation="wave"  variant="text"   width={150} height={60} />
      <Skeleton animation="wave"  variant="text"   width={150} height={60}  />
   
  
    </Grid> 
    </Box>
)
}
