import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
 
Chart.register(ArcElement, Tooltip, Legend);
 
const GaugeChart = ({ actualBudget, totalBudget }) => {
  const percentage = (  actualBudget/totalBudget ) * 100;
  const screen = window.outerWidth;
 
  function formatNumber(number) {
    if (number >= 1000) {
      return (number / 1000).toFixed(1);
    } else {
      return number.toString();
    }
  }
 
  const Total = totalBudget && formatNumber(totalBudget)
  const Actual = actualBudget && formatNumber(actualBudget)
 
let gradient;
let canvas: any = document.getElementById("DoughnutChart");
if (canvas) {
  let ctx = canvas?.getContext("2d");
  gradient = ctx.createLinearGradient(70, 20, 230, 90)
  gradient.addColorStop(0, "#05FF00");
  gradient.addColorStop(0.1, "#F7FC00");
  gradient.addColorStop(0.5, "#FFA903");
  gradient.addColorStop(1, "#FF0000");
}
 
const data = {
    datasets: [
      {
        data: [Actual],
        text : [Total],
        backgroundColor:gradient,
        borderWidth: 0,
        rotation: 270, // start angle in degrees
        circumference: 180,
        cutout:"80%",
        needleValue: Total,
        datalabels: {
            display: false,
          },
      },
    ],
  };
 
  const gaugeChartText= {
    id: "gaugeChartText",
    afterDatasetsDraw(chart:any ,args:any ,plugins:any){
  const {ctx, data , chartArea:{top,bottom,left,right,width,height},scales:{r}}  = chart;
 
   ctx.save();
   const needleValue = data.datasets[0].needleValue;
  const xCoor = chart?.getDatasetMeta(0)?.data[0]?.x;
  const yCoor = chart?.getDatasetMeta(0)?.data[0]?.y;
  const outerRadius =  chart?.getDatasetMeta(0)?.data[0].outerRadius;
  const innerRadius =  chart?.getDatasetMeta(0)?.data[0].innerRadius;
  const widthSlice = (outerRadius - innerRadius) / 2;
  const radius = 10;
  const angle = Math.PI / 180;
  const circumference = (((chart.getDatasetMeta(0)?.data[0].circumference )/ Math.PI) / data.datasets[0].data[0]) *
  needleValue;
  ctx.translate(xCoor,yCoor);
  ctx.rotate(Math.PI *(circumference + 1.5))
  ctx.beginPath();
  ctx.strokeStyle = "black"
  ctx.fillStyle = "black"
  ctx.lineWidth = 1;
  ctx.moveTo(0- radius, 0);
  ctx.lineTo(0, 0 - innerRadius - widthSlice);
  ctx.lineTo(0 + radius, 0)
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
 
 
  //dot
  ctx.beginPath();
  ctx.arc(0,0,radius, 0 ,angle *360,false);
  ctx.fill();
 
  ctx.restore();
 
  ctx.font = screen >= 1600 ? "bolder 35px Arial" : "bolder 25px Arial";
  ctx.fillStyle = "#2D2D8F";
  ctx.textAlign="center";
  ctx.fillText(`$${data.datasets[0].text[0]}`,xCoor,yCoor + 45)
  ctx.font = screen >= 1600 ? " 20px sans-serif" : " 15px sans-serif";
  ctx.textAlign="left";
  ctx.fillText('0',left,yCoor + 20)
  ctx.font = screen >= 1600 ? " 20px Arial" : " 15px Arial";
  ctx.textAlign="right";
  ctx.fillText(`$${data.datasets[0].data[0]}`,right,yCoor + 18)
}
  }
 
  const options = {
    responsive: true,
    maintainAspectRatio: true,
 
    plugins: {
      tooltip: { enabled: false },
      legend: { display: false },
    },
  };
 
 
  return (
    <div className=" flex-column w-100 justify-content-center mb-3">
    <small className=" d-flex fw-bold d-inline nav-font ">Budget Gauge</small>
        <Doughnut style = {{margin: "auto" }} id="DoughnutChart"  data={data} options={options}  className="Gauge_height"    plugins={[gaugeChartText]} />
    </div>
  );
};
 
export default GaugeChart;
