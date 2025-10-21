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
  
  export default function ComplainceStatus() {
    const width = window.outerWidth;
    const cloudData = useAppSelector(selectCommonConfig);
    const navigate = useNavigate();
    var awsGradient;
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
          border: {
            display: false,
          },
          grid: {
            display: false,
          },
          categoryPercentage: 1, // Make the categories occupy the entire width
          barPercentage: 1,
          ticks: {
              font: {
                size: width >= 1600 ? 24 : 10,
                family: "GelixRegular"},
                callback: function (value) {
                  if (this.getLabelForValue(value).length > 7) {
                    return this.getLabelForValue(value).substr(0, 7) + "...";
                  } else {
                    return this.getLabelForValue(value);
                  }
                },
            display: true,
            fontSize: 2,
            autoSkip: false, // Disable automatic skipping of ticks
            maxRotation: 0, // Set the max rotation of the ticks to 0
            minRotation: 0, // Set the min rotation of the ticks to 0
          },
        },
  
        y: {
          display: false,
          
        },
      },
      onClick: (event, elements) => {
        if (elements.length > 0) {
          const clickedLabel = data.labels[elements[0].index];
          navigate({
            pathname: "/complaince-details",
            search: `?status=${clickedLabel}`,
          });
        }
      },
    };
  
    let canvas: any = document.getElementById("BarChart");
    if (canvas) {
      let ctx = canvas?.getContext("2d");
      awsGradient = ctx.createLinearGradient(0, 0, 0, 110);
      awsGradient.addColorStop(0.15, "#2D2D8F ");
      awsGradient.addColorStop(0.5, " rgba(182, 0, 186,0.74)");
      awsGradient.addColorStop(0.7, "#21FCEB");
    }
  
    let cloudResourceTypes = findOcc(cloudData.filteredComplainceData, "Status");
    const labels = cloudResourceTypes.map(
      (currelem: any) => currelem.Status
    );
    const barChartDataValues = cloudResourceTypes.map(
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
        <small className=" fw-bold mb-0 nav-font">Compliance Status</small>
        <div className="d-flex w-100 justify-content-center">
          <div className="cursor-pointer">
            <Bar
              id="BarChart"
              style={{ height: "105px", width: "360px" }}
              options={options}
              data={data}
              className="orph"
            />
          </div>
        </div>
      </div>
    );
  }
  