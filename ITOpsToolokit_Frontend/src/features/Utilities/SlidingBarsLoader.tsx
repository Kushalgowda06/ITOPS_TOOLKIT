import React from "react";
import { Box, keyframes } from "@mui/material";

const slide = keyframes`
  0% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(-20px); opacity: 0.5; }
  100% { transform: translateY(0); opacity: 1; }
`;

const SlidingBarsLoader = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 9999,
      }}
    >
      <Box sx={{ display: "flex", gap: 1 }}>
        {[...Array(5)].map((_, i) => (
          <Box
            key={i}
            sx={{
              width: 8,
              height: 35,
              backgroundColor: "white",
              borderRadius: 1,
              animation: `${slide} 1s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default SlidingBarsLoader;
