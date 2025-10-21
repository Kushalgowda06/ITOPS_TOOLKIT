import React, { useRef, useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DataAnalysisChart = () => {
  const canvasRef = useRef(null);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight * 0.4);
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth); // Decrease height by 200px
  useEffect(() => {
    const handleResize = () => {
      setCanvasHeight(window.innerHeight * 0.4);
      setCanvasWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerHeight]);

  const plugins = {
    id: "demo",
    afterDraw(chart) {
      const { ctx, width, height } = chart;
      ctx.save();
      ctx.font = "bold 12px Arial";
      ctx.fillStyle = "#ffffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText("%", width / 2, height / 2);
    },
  };
  const data = {
    labels: ["Category A", "Category B", "Category C"],
    datasets: [
      {
        label: "Dataset 1",
        data: [67, 33],
        backgroundColor: ["#6895F4", "rgba(1, 26, 128, 1)"],
        hoverBackgroundColor: ["#6895F4", "rgba(1, 26, 128, 1)"],
      },
      {
        label: "Dataset 2",
        data: [21, 79],
        backgroundColor: ["#3F3F3F", "#B8D9FF"],
        hoverBackgroundColor: ["#3F3F3F", "#B8D9FF"],
      },
    ],
  };
console.log(data,"chartdata")
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: 20,
    plugins: {
      legend: { display: false },

      datalabels: {
        color: ["#FFFFFF"],
        display: true,
      },
    },
  };

  return (
    <div className="w-100 d-flex justify-content-center">
      <div className="container">
        <Doughnut
          id="DoughnutChart"
          data={data}
          options={options}
          plugins={[plugins]}
          height={canvasHeight}
          width={canvasWidth}
          ref={canvasRef}
        />
      </div>
    </div>
  );
};

export default DataAnalysisChart;
