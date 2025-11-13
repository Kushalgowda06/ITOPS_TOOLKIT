// PolygonFlowLoader.tsx
import React from "react";
import { Box, keyframes } from "@mui/material";

const move = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translate(200px, 150px) rotate(360deg); opacity: 0; }
`;

const AICoreLoader = ({ shapes = 15 }) => (
  <Box
    sx={{
      position: "fixed",
      inset: 0,
      backgroundColor: "#01020a",
      zIndex: 9999,
      overflow: "hidden",
    }}
  >
    {Array.from({ length: shapes }).map((_, i) => (
      <Box
        key={i}
        sx={{
          position: "absolute",
          width: 12,
          height: 12,
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          backgroundColor: "#00e0ff",
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `${move} ${3 + Math.random() * 2}s linear infinite`,
          animationDelay: `${Math.random()}s`,
          filter: "drop-shadow(0 0 10px #00e0ff)",
        }}
      />
    ))}
  </Box>
);


export default AICoreLoader;
