import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend } from "chart.js";
import { useEffect, useRef, useState } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import findOcc from "../../Utilities/Findoccurence";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectCommonConfig, setOrphanDeletedCost } from "../CommonConfig/commonConfigSlice";
import { Doughnut } from "react-chartjs-2";
import { filterData } from "../../Utilities/filterData";
import { useLocation, useNavigate } from "react-router-dom";

ChartJs.register(Tooltip, Title, ArcElement, Legend, ChartDataLabels);

export const CostAnalysis = (props) => {
  const sliceCloudData = useAppSelector(selectCommonConfig);
  const dispatch = useAppDispatch();
  const screen = window.outerWidth;
  const [cloudDataValue, setCloudDataValue] = useState(sliceCloudData);
  const location = useLocation();
  const pathname = location.pathname;
  let filteredCloudData = useRef(
    findOcc(sliceCloudData.filteredOrphanData, "Cloud")
  );
  const navigate = useNavigate();
  let costSaved = "0";
  let individualCloudData = useRef(
    filterData("Cloud", cloudDataValue.filteredOrphanData)
  );
  var awsGradient, azureGradient, gcpGradient;

  sliceCloudData.filteredOrphanData.forEach((curr: any, index: number) => {
    costSaved = (parseFloat(costSaved) + parseFloat(curr.CostSaving)).toFixed(
      2
    );
  });

  useEffect(() => {
    filteredCloudData.current = findOcc(
      sliceCloudData.filteredOrphanData,
      "Cloud"
    );
    individualCloudData.current = filterData(
      "Cloud",
      sliceCloudData.filteredOrphanData
    );
    setCloudDataValue(sliceCloudData);
  }, [sliceCloudData]);
  let resourceTypesCostSaved = {};
  Object.keys(individualCloudData.current).forEach(
    (curr: any, index: number) => {
      let resourceTypes = filterData(
        "ResourceStatus",
        individualCloudData.current[curr]
      );
      let tempStore = {
        Orphaned: "0",
        Deleted: "0",
        orphanCount: 0,
        deletedCount: 0,
      };

      Object.keys(resourceTypes).forEach((innerCurr: any, index: number) => {
        resourceTypes[innerCurr].forEach((endCurr: any, index: number) => {
          if (innerCurr === "Orphaned") {
            tempStore.Orphaned = (
              parseFloat(tempStore.Orphaned) + parseFloat(endCurr.CostSaving)
            ).toFixed(2);
            tempStore.orphanCount++;
          } else if (innerCurr === "Deleted") {
            tempStore.Deleted = (
              parseFloat(tempStore.Deleted) + parseFloat(endCurr.CostSaving)
            ).toFixed(2);
            tempStore.deletedCount++;
          }
        });

        resourceTypesCostSaved[curr] = tempStore;
      });
    }
  );

  let canvas: any = document.getElementById("DoughnutChart");
  let ctx = canvas?.getContext("2d");
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
dispatch(setOrphanDeletedCost( Object.values(resourceTypesCostSaved).map((item:any)=> Number(item.Deleted)).reduce((sum, value) => sum + value, 0)))
  let dataSets: any = filteredCloudData.current.map(
    (currElem: any, index: number) => {
      return {
        label: currElem.Cloud,
        data: [
          resourceTypesCostSaved[currElem.Cloud].deletedCount,
          resourceTypesCostSaved[currElem.Cloud].orphanCount,
        ],

        backgroundColor: [
          "AWS" === currElem.Cloud
            ? awsGradient
            : "GCP" === currElem.Cloud
            ? gcpGradient
            : azureGradient,
          "#eee3f2",
        ],

        borderWidth: 1,
        hoverOffset: 4,
        circumference: 360,
        rotation: -270,
        text : costSaved,
        datalabels: {
          color: ["#fff", "#B600BA"],
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
    labels: ["Deleted", "Orphaned"],
    datasets: dataSets,

  };

  let toolTipTitle = function (tooltipItem: any, data: any) {
    return `${tooltipItem[0].dataset.label} : ${tooltipItem[0].label}`;
  };

  let toolTipLabel = function (tooltipItem, data) {
    if (tooltipItem.label === "Orphaned")
      return `Save : $${
        resourceTypesCostSaved[tooltipItem.dataset.label][tooltipItem.label]
      }`;
    else
      return `Cost Saved : $${
        resourceTypesCostSaved[tooltipItem.dataset.label][tooltipItem.label]
      }`;
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: 40,
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
          pathname: "/orphan-details",
          search: `?cloud=${clickedCloud}&status=${clickedLabel}`,
        });
      }
    },
  };

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
      ctx.font = screen >= 1600 ? "bolder 20px Arial" : "bolder 15px Arial";
      ctx.fillStyle = "#2D2D8F";
      // ctx.canvas.clientHeight = "500px";
      // ctx.canvas.clientWidth = "500px";

      ctx.fillText(text, width / 2, height / 2 + 12);
    },
    legend: {
      display: false,
    },
  };

  return (
    <div className=" flex-column w-100 justify-content-center mb-3">
      <small className=" d-flex fw-bold d-inline nav-font">{!pathname.includes('orphan') ? 'Orphan Status' : 'Cost Analysis'}</small>
      {sliceCloudData?.filteredOrphanData?.length > 0 && (
        <Doughnut
          style={{ margin: "auto"}}
          id="DoughnutChart"
          options={options}
          data={data}
          plugins={[plugins]}
          className="chart_height"
        />
      )}
    </div>
  );
};


