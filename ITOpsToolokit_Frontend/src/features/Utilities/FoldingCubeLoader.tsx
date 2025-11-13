import React from "react";
import { Box, keyframes } from "@mui/material";

const fold = keyframes`
  0%, 10% { transform: perspective(140px) rotateX(-180deg); opacity: 0; }
  25%, 75% { transform: perspective(140px) rotateX(0deg); opacity: 1; }
  90%, 100% { transform: perspective(140px) rotateY(180deg); opacity: 0; }
`;

const FoldingCubeLoader = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          width: 50,
          height: 50,
          position: "relative",
          transform: "rotateZ(45deg)",
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <Box
            key={i}
            sx={{
              transform: `scale(1.1) rotateZ(${i * 90}deg)`,
              position: "absolute",
              top: 0,
              left: 0,
              width: "50%",
              height: "50%",
              transformOrigin: "100% 100%",
              animation: `${fold} 2.4s infinite linear`,
              animationDelay: `${i * 0.3}s`,
              backgroundColor: "white",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default FoldingCubeLoader;
