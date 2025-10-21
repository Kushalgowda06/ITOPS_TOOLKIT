import React from "react";
import { Doughnut } from "react-chartjs-2";

interface DoughnutChartProps {
  options: any;
  data: any;
  plugins: any;
}

const DoughnutChart: React.FC<DoughnutChartProps> = (props) => {
  return (
    <Doughnut
      id="DoughnutChart"
      options={props.options}
      data={props.data}
      plugins={[props.plugins]}
    />
  );
};

export default DoughnutChart;
