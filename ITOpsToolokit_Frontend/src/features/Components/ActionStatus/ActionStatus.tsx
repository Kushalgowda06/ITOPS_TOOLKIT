import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend } from "chart.js";
import { useEffect, useRef, useState } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import findOcc from "../../Utilities/Findoccurence";
import { Doughnut } from "react-chartjs-2";
import { useLocation, useNavigate } from "react-router-dom";
import { filterData } from "../../Utilities/filterData";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCommonConfig, setAdvisoryCost } from "../CommonConfig/commonConfigSlice";
ChartJs.register(Tooltip, Title, ArcElement, Legend, ChartDataLabels);

export const ActionStatus = () => {
  const advisoryData = useAppSelector(selectCommonConfig);
  // var awsGradient, azureGradient,gcpGradient;
  const location = useLocation();
  const pathname = location.pathname;
  const screen = window.outerWidth;
  const dispatch = useAppDispatch();
  const [flag, setFlag] = useState<boolean>(true);
  const [awsGradient, setAwsGradient] = useState<CanvasGradient | undefined>(
    undefined
  );
  const [azureGradient, setAzureGradient] = useState<
    CanvasGradient | undefined
  >(undefined);
  const [gcpGradient, setGcpGradient] = useState<CanvasGradient | undefined>(
    undefined
  );

  const navigate = useNavigate();
  var filteredCloudData = useRef(
    findOcc(advisoryData.filteredAdvisoryData, "Cloud")
  );
  var individualCloudData = useRef(
    filterData("Cloud", advisoryData.filteredAdvisoryData)
  );
  let costSaved = "0";
  useEffect(() => {
    setFlag(!flag);
    filteredCloudData.current = findOcc(
      advisoryData.filteredAdvisoryData,
      "Cloud"
    );
    individualCloudData.current = filterData(
      "Cloud",
      advisoryData.filteredAdvisoryData
    );
  }, [advisoryData.filteredAdvisoryData]);

  advisoryData.filteredAdvisoryData.forEach((curr: any, index: number) => {
    if (curr.Status === "New" || curr.Status === "Review") {
      costSaved = (
        parseFloat(costSaved) +
        (curr.CostSaved === "" ||
        curr.CostSaved === "NA"
          ? 0
          : parseFloat(curr.CostSaved))
      ).toFixed(2);
    }
  });

  let resourceTypesCostSaved = {};

  Object.keys(individualCloudData.current).forEach(
    (curr: any, index: number) => {
      let resourceTypes = filterData(
        "Status",
        individualCloudData.current[curr]
      );
      let tempStore = {
        New: "0",
        Completed: "0",
        newCount: 0,
        completedCount: 0,
      };

      Object.keys(resourceTypes).forEach((innerCurr: any, index: number) => {
        resourceTypes[innerCurr].forEach((endCurr: any, index: number) => {
          if (innerCurr === "New" || innerCurr === "Review") {
            tempStore.New = (
              parseFloat(tempStore.New) +
              (endCurr.CostSaved === "" ||
              endCurr.CostSaved === "NA"
                ? 0
                : parseFloat(endCurr.CostSaved))
            ).toFixed(2);
            tempStore.newCount++;
          } else if (innerCurr === "Completed" || innerCurr === "Approved") {
            tempStore.Completed = (
              parseFloat(tempStore.Completed) +
              (endCurr.CostSaved === "" ||
              endCurr.CostSaved === "NA"
                ? 0
                : parseFloat(endCurr.CostSaved))
            ).toFixed(2);
            tempStore.completedCount++;
          }
        });

        resourceTypesCostSaved[curr] = tempStore;
      });
    }
  );
  dispatch(setAdvisoryCost(Object.values(resourceTypesCostSaved).map((item:any)=> Number(item.Completed)).reduce((sum, value) => sum + value, 0)))
  useEffect(() => {
    let canvas = document.getElementById("DoughnutChart") as HTMLCanvasElement;
    if (canvas) {
      let ctx = canvas.getContext("2d");
      let awsGradient = ctx.createLinearGradient(0, 0, 0, 180);
      awsGradient.addColorStop(0, "#2D2D8F ");
      awsGradient.addColorStop(0.7, "rgba(182, 0, 186,0.5)");
      awsGradient.addColorStop(1, "#21FCEB");

      let azureGradient = ctx.createLinearGradient(0, 0, 0, 180);
      azureGradient.addColorStop(0.1, "#392D8F");
      azureGradient.addColorStop(0.8, "#B600BA87");
      azureGradient.addColorStop(1, "#21FCEB");

      let gcpGradient = ctx.createLinearGradient(0, 0, 0, 180);
      gcpGradient.addColorStop(0.1, "#392D8F");
      gcpGradient.addColorStop(0.8, "#B600BA87");
      gcpGradient.addColorStop(1, "#21FCEB");

      setAwsGradient(awsGradient);
      setAzureGradient(azureGradient);
      setGcpGradient(gcpGradient);
    }
  }, [advisoryData.advisoryData]);

  const plugins = {
    id: "demo",
    afterDatasetsDraw(chart: any, args: any, options: any) {
      const {
        ctx, data,
        chartArea: { width, height },
      } = chart;
      const text = "$" + data?.datasets[0]?.text;
      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseLine = "middle";
      ctx.font = screen >= 1600 ? "bolder 20px Arial" : "bolder 15px Arial";
      ctx.fillStyle = "#2D2D8F";
      ctx.fillText(`Save`, width / 2, height / 2 - 5);

      ctx.textAlign = "center";
      ctx.textBaseLine = "middle";
      ctx.font = screen >= 1600 ? "bolder 20px Arial" : "bolder 13px Arial";
      ctx.fillStyle = "#2D2D8F";
      ctx.fillText(text, width / 2, height / 2 + 10);
    },
    legend: {
      display: false,
    },
  };
  let dataSets: any = filteredCloudData.current.map(
    (currElem: any, index: number) => {
      return {
        label: currElem.Cloud,
        data: [
          resourceTypesCostSaved[currElem.Cloud].newCount,
          resourceTypesCostSaved[currElem.Cloud].completedCount,
        ],
        backgroundColor: [
          "#eee3f2",
          "AWS" === currElem.Cloud
            ? awsGradient
            : "GCP" === currElem.Cloud
            ? gcpGradient
            : azureGradient,
        ],
        borderWidth: 2,
        hoverOffset: 4,
        circumference: 360,
        rotation: -270,
        cutout: 40,
        text : costSaved, 
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
    labels: ["New", "Completed"],
    datasets: dataSets,
  };

  let toolTipTitle = function (tooltipItem, data) {
    const label = tooltipItem[0].label;
    if (label === "New") {
      return `${tooltipItem[0].dataset.label} : New, Review`;
    } else if (label === "Completed") {
      return ` ${tooltipItem[0].dataset.label} : Completed,Approved`;
    }
  };

  let toolTipLabel = function (tooltipItem, data) {
    return `Cost Saved : $${
      resourceTypesCostSaved[tooltipItem.dataset.label][tooltipItem.label]
    }`;
  };

  let options: any = {
    responsive: true,
    maintainAspectRatio: true, 
    cutout: 30,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: toolTipLabel,
          title: toolTipTitle,
        },
      },
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const clickedLabel = data.labels[elements[0].index];
        const clickedCloud =
          filteredCloudData.current[elements[0].datasetIndex].Cloud;
        navigate({
          pathname: "/advisory-details",
          search: `?cloud=${clickedCloud}&status=${clickedLabel}`, // onclick data not correct need to pass extra parameter
        });
      }
    },
  };

  return (
    <div className=" flex-column w-100 justify-content-center mb-3">
    <small className=" d-flex fw-bold d-inline nav-font ">{!pathname.includes('advisory') ? 'Advisory Status' : 'Action Status'}</small>
          {advisoryData.filteredAdvisoryData?.length > 0  && (
                <Doughnut id="DoughnutChart"  style = {{margin: "auto" }}
            data={data}
            options={options}
            plugins={[plugins]} 
            className="chart_height"
            />
          )}
  
    </div>
  );
};

export default ActionStatus;
