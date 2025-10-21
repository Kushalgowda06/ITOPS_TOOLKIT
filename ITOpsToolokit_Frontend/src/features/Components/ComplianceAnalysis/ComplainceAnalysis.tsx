import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend } from "chart.js";
import { useEffect, useRef, useState } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import findOcc from "../../Utilities/Findoccurence";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import { Doughnut } from "react-chartjs-2";
import { filterData } from "../../Utilities/filterData";
import { useNavigate } from "react-router-dom";
ChartJs.register(Tooltip, Title, ArcElement, Legend, ChartDataLabels);

export const ComplainceAnalysis = () => {
  const screen = window.outerWidth;
  const sliceCloudData = useAppSelector(selectCommonConfig);
  const [cloudDataValue, setCloudDataValue] = useState(sliceCloudData);
  let filteredCloudData = useRef(
    findOcc(sliceCloudData?.filteredComplainceData, "Cloud")
  );
  const navigate = useNavigate();
  let totalOccurence = useRef(0);
  var percentagecomplaince = useRef(0);

  let individualCloudData = useRef(
    filterData("Cloud", cloudDataValue?.filteredComplainceData)
  );
  var awsGradient, azureGradient, gcpGradient;

  useEffect(() => {
    filteredCloudData.current = findOcc(
      sliceCloudData?.filteredComplainceData,
      "Cloud"
    );
    individualCloudData.current = filterData(
      "Cloud",
      sliceCloudData?.filteredComplainceData
    );
    setCloudDataValue(sliceCloudData);
  }, [sliceCloudData]);

  let resourceTypesCostSaved = {};
  Object.keys(individualCloudData?.current).forEach(
    (curr: any, index: number) => {
      let resourceTypes = filterData(
        "Compliance",
        individualCloudData?.current[curr]
      );
      let tempStore = {
        InComplianceCount: 0,
        ComplianceCount: 0,
      };

      Object.keys(resourceTypes).forEach((innerCurr: any, index: number) => {
        resourceTypes[innerCurr].forEach((endCurr: any, index: number) => {
          if (innerCurr === "Non-Compliant") {
            tempStore.InComplianceCount++;
          } else if (innerCurr === "Compliant") {
            tempStore.ComplianceCount++;
          }
        });

        resourceTypesCostSaved[curr] = tempStore;
      });
    }
  );

  filteredCloudData.current.forEach((currElem: any, index: number) => {
    //as only one cloud += remove
    totalOccurence.current = currElem.occurrence;
  });
  filteredCloudData.current.forEach((currElem: any, index: number) => {
    percentagecomplaince.current =
      resourceTypesCostSaved[currElem.Cloud].ComplianceCount;
  });

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
  const plugins = {
    id: "demo",
    afterDatasetsDraw(chart: any, args: any, options: any) {
      const {
        ctx,
        chartArea: { width, height },
      } = chart;
      ctx.save();
      ctx.font = screen >= 1600 ? "bolder 25px Arial" : "bolder 15px Arial";
      ctx.textAlign = "center";
      ctx.textBaseLine = "middle";
      ctx.fillStyle = "#2D2D8F";
      ctx.fillText(
        Math.round(
          (100 * percentagecomplaince.current) / totalOccurence.current
        ) + "%",
        width / 2 + 3,
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
        data: [
          resourceTypesCostSaved[currElem.Cloud].InComplianceCount,
          resourceTypesCostSaved[currElem.Cloud].ComplianceCount,
        ],

        backgroundColor: [
          "#eee3f2",
          "AWS" === currElem.Cloud
            ? awsGradient
            : "GCP" === currElem.Cloud
            ? gcpGradient
            : azureGradient
        
        ],

        borderWidth: 1,
        hoverOffset: 4,
        circumference: 360,
        rotation: -270,
        datalabels: {
          color: [ "#B600BA","#fff"],
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
    labels: ["Non-Compliant", "Compliant"],
    datasets: dataSets,
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: 40,
    plugins: {
      legend: { display: false },
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const clickedLabel = data.labels[elements[0].index];
        const clickedCloud =
          filteredCloudData.current[elements[0].datasetIndex].Cloud;
        navigate({
          pathname: "/complaince-details",
          search: `?cloud=${clickedCloud}&status=${clickedLabel}`,
        });
      }
    },
  };

  return (
    <div className=" flex-column w-100 justify-content-center mb-3">
      <small className=" d-flex fw-bold d-inline nav-font ">Compliance Analysis</small>
      {sliceCloudData?.filteredOrphanData?.length > 0 && (
        <Doughnut
          style={{ margin: "auto" }}
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
