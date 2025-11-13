import React from "react";
import { Box, keyframes } from "@mui/material";

const wave = keyframes`
  0%, 40%, 100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
`;

interface BarWaveLoaderProps {
  /** White by default */
  color?: string;
  /** Number of bars */
  bars?: number;
  /** Size of each bar */
  barWidth?: number;
  barHeight?: number;
  /** Optional: transparent overlay background */
  overlayBg?: string;
}

const BarWaveLoader: React.FC<BarWaveLoaderProps> = ({
  color = "white",
  bars = 5,
  barWidth = 6,
  barHeight = 30,
  overlayBg = "rgb(0 0 0 / 72%)", // translucent dark overlay
}) => {
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
        backgroundColor: overlayBg,
        zIndex: 9999,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
        {[...Array(bars)].map((_, i) => (
          <Box
            key={i}
            sx={{
              width: barWidth,
              height: barHeight,
              backgroundColor: color,
              borderRadius: 2,
              animation: `${wave} 1.2s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default BarWaveLoader;
