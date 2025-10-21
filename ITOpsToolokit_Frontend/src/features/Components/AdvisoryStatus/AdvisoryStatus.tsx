import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import findOcc from "../../Utilities/Findoccurence";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AdvisoryStatus() {
  const advisoryData = useAppSelector(selectCommonConfig);
  const width = window.outerWidth;
  const navigate = useNavigate();
  let awsGradient;
  let delayed;
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
      },
      legend: { display: false },
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        categoryPercentage: 1, // Make the categories occupy the entire width
        barPercentage: 1,
        ticks: {
          font: {
            size: width >= 1600 ? 24 : 10,
            family: "GelixRegular"},
          display: true,
          fontSize: 2,
          autoSkip: false, // Disable automatic skipping of ticks
          maxRotation: 0, // Set the max rotation of the ticks to 0
          minRotation: 0, // Set the min rotation of the ticks to 0
        },
      },

      y: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "GelixRegular",
            size: width >= 1600 ? 24 : 10 
          },
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedLabel = data.labels[elements[0].index];
        navigate({
          pathname: "/advisory-details",
          search: `?status=${clickedLabel}`,
        });
      }
    },
  };

  let canvas: any = document.getElementById("BarChart");
  if (canvas) {
    let ctx = canvas?.getContext("2d");
    awsGradient = ctx.createLinearGradient(0, 0, 0, 210);
    awsGradient.addColorStop(0.2, "#2D2D8F ");
    awsGradient.addColorStop(0.5, " rgba(182, 0, 186,0.74)");
    awsGradient.addColorStop(0.7, "#21FCEB");
  }

  let cloudResourceTypes = findOcc(advisoryData.filteredAdvisoryData, "Status");

  const labels = cloudResourceTypes?.map((currelem: any) => currelem.Status);
  const barChartDataValues = cloudResourceTypes?.map(
    (currElem: any) => currElem.tagged + currElem.untagged
  );


  const data = {
    labels,
    datasets: [
      {
        data: barChartDataValues,
        backgroundColor: awsGradient,
        barThickness: 40,
      },
    ],
  };
  return (
        <div className="d-flex flex-column w-100">
      <small className=" fw-bold nav-font">Advisory Status</small>
        <div className="cursor-pointer">
          <Bar
            id="BarChart"
            style={{ height: "209px", width: "470px" }}
            options={options}
            data={data}
            className="adv_width"
          />
 
      </div>
    </div>
  );
}