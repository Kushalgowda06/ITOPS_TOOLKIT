import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend } from "chart.js";
import { useEffect, useRef, useState } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import findOcc from "../../Utilities/Findoccurence";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import { useNavigate } from "react-router-dom";
import { Doughnut } from "react-chartjs-2";
ChartJs.register(Tooltip, Title, ArcElement, Legend, ChartDataLabels);

export const TaggingStatus = () => {
  const navigate = useNavigate();
  const screen = window.outerWidth;
  const sliceCloudData = useAppSelector(selectCommonConfig);
  let filteredCloudData = useRef(findOcc(sliceCloudData.filteredTaggingData, "Cloud"));
  const [cloudDataValue, setCloudDataValue] = useState(sliceCloudData)
  let totalOccurence = useRef(0);
  var percentagetagged = useRef(0);
  var awsGradient, azureGradient, gcpGradient;
  const canvasRef = useRef(null);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight *0.4);
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth ); // Decrease height by 200px
  useEffect(() => {
    const handleResize = () => {
      setCanvasHeight(window.innerHeight * 0.4);
      setCanvasWidth(window.innerWidth );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerHeight]);
  useEffect(() => {
    filteredCloudData.current = findOcc(sliceCloudData.filteredTaggingData, "Cloud");
    setCloudDataValue(sliceCloudData)
    // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [sliceCloudData]);

  filteredCloudData.current.forEach((currElem: any, index: number) => {
    totalOccurence.current += currElem.occurrence;
  });
  filteredCloudData.current.forEach((currElem: any, index: number) => {
    percentagetagged.current += currElem.tagged;
  });
  let canvas: any = document.getElementById("DoughnutChart");
  let ctx = canvas?.getContext("2d");
  // console.log("canvas",canvas.canvas.direction)
  if (canvas) {


    awsGradient = ctx.createLinearGradient(0, 0, 0, 180);
    awsGradient.addColorStop(0, "#2D2D8F ", 0.3);
    awsGradient.addColorStop(0.7, " rgba(182, 0, 186,0.5)");
    awsGradient.addColorStop(1, "#21FCEB", 0.1);

    azureGradient = ctx.createLinearGradient(0, 0, 0, 180);
    azureGradient.addColorStop(0.1, "#392D8F", 1);
    azureGradient.addColorStop(0.8, " #B600BA87");
    azureGradient.addColorStop(1, "#21FCEB", 0.1);

    gcpGradient = ctx.createLinearGradient(0, 0, 0, 180);
    gcpGradient.addColorStop(0.1, "#392D8F", 1);
    gcpGradient.addColorStop(0.8, " #B600BA87");
    gcpGradient.addColorStop(1, "#21FCEB", 0.1);
  }

  const plugins = {
    id: "demo",
    afterDatasetsDraw(chart: any, args: any, options: any) {
      const {
        ctx,
        chartArea: { canvasHeight, canvasWidth, width, height },
      } = chart;
      ctx.save();
      ctx.font = screen >= 1600 ? "bolder 25px Arial" : "bolder 15px Arial";
      ctx.textAlign = "center";
      ctx.textBaseLine = "middle";
         ctx.fillStyle = "#2D2D8F";

      ctx.fillText(
        Math.round((100 * percentagetagged.current) / totalOccurence.current) +
          "%",
          width / 2 +3,
          height / 2 + 5
      );
  
    },
    legend: {
      display: false,
    },
  };

  let dataSets: any = filteredCloudData.current.map(
    (currElem: any, index: number) => {
      return {
        label: currElem.Cloud,
        data: [currElem.untagged, currElem.tagged],
        backgroundColor: [
          "#eee3f2",
          "AWS" === currElem.Cloud
            ? awsGradient
            : "GCP" === currElem.Cloud
            ? gcpGradient
            : azureGradient,
        ],
        borderWidth: 1,
        hoverOffset: 4,
        circumference: 360,
        rotation: -270,
        datalabels: {
          color: ["#B600BA", "#fff"],
          display: true,
          font: function(context) {
            var width = context.chart.width;
            var size = Math.round(width / 22);
            return {
                weight: 'bold',
                size: size
            };
          }
        },
      };
    }
  );

  const data: any = {
    labels: ["Untagged", "Tagged"],
    datasets: dataSets,
  };

  let options: any = {
    responsive: true,
    maintainAspectRatio: false, 
    cutout: 30,
    plugins: { legend: { display: false } },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const clickedLabel = data.labels[elements[0].index];
        const clickedCloud =
          filteredCloudData.current[elements[0].datasetIndex].Cloud;
        navigate({
          pathname: "/details",
          search: `?cloud=${clickedCloud}&status=${clickedLabel}`,
        });
      }
    },
  };

  
  return (
    <div className="w-100 justify-content-center">
    <small className="fw-bold nav-font ">Tagging Status</small>

          {sliceCloudData?.filteredTaggingData?.length > 0 && (
            <div className="container ">
            <Doughnut
            id="DoughnutChart"
            options={options}
            data={data}
            plugins={[plugins]}
            ref= {canvasRef}
            height= {canvasHeight}
            width= {canvasWidth}
            // className="chart_height"
          />
          </div>
          )}
    </div>

  );
};
