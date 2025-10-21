import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import findOcc from "../../Utilities/Findoccurence";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Legend);

export default function TopAdvisory() {
  const advisoryData = useAppSelector(selectCommonConfig);
  const width = window.outerWidth;
  const navigate = useNavigate();
  const [label, setLabel] = useState<string>("");
  const aggregatedCostSavings = {};
  var awsGradient, azureGradient, gcpGradient;
  let canvas: any = document.getElementById("BarChart");
  if (canvas) {
    let ctx = canvas?.getContext("2d");
    awsGradient = ctx.createLinearGradient(200, 280, 50, 0);
    awsGradient.addColorStop(0.2772, "#CA531B", 0.3);
    awsGradient.addColorStop(0.615, "#F56B1A");
    awsGradient.addColorStop(1, "#FA880F", 0.1);

    azureGradient = ctx.createLinearGradient(200, 0, 0, 0);
    azureGradient.addColorStop(0, "#0C6DCD");
    azureGradient.addColorStop(0.3498, "#007AD8");
    azureGradient.addColorStop(0.5734, "#198CDC");
    azureGradient.addColorStop(0.7045, "#2C9CE3");
    azureGradient.addColorStop(1, "#3BC9F3");

    gcpGradient = ctx.createLinearGradient(0, 0, 0, 180);
    gcpGradient.addColorStop(0.1, "#0B9B08", 1);
    gcpGradient.addColorStop(0.8, "#03A400");
    gcpGradient.addColorStop(1, "#00E967", 0.1);
  }
  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
      },
      legend: { display: false },
      datalabels: {
        display: false,
        // align: function(context) {
        //   return context.dataIndex > -1 ? 'center' : 'end';
        // },
        // anchor: function(context) {
        //   return context.dataIndex > -1 ? 'end' : 'center';
        // },
        // offset:5,
        // formatter: function(value, context) {
        //  const index = context.dataIndex;
        //   const costSaving = costlabelData[labels[index]].toFixed(1);
        //   return `$${costSaving}`;
        // },
                
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const index = context.dataIndex;
            const cloudType = findCloud(labels[index]);
            return `${cloudType}: ${context.formattedValue}`;
          },
          footer: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            const costSaving = costlabelData[labels[index]].toFixed(1);
            return `Cost Saving: $${costSaving}`;
          },
        },
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
        ticks: {
          font: {
            size: width >= 1600 ? 24 : 10,
            family: "GelixRegular"}
          },
      },

      y: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          font: {
            size: width >= 1600 ? 24 : 10,
            family: "GelixRegular",
          },
          callback: function (value) {
            if (this?.getLabelForValue(value)?.length > 7) {
              return this.getLabelForValue(value).substr(0, 7) + "..";
            } else {
              return this.getLabelForValue(value);
            }
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
    onHover: (evt, activeEls) => {
      activeEls.length > 0
        ? (evt.chart.canvas.style.cursor = "pointer")
        : (evt.chart.canvas.style.cursor = "default");
    },
  };

  const findCloud = (ResourceName: string) => {
    let cloudVar: string = "";
    advisoryData.filteredAdvisoryData.forEach(
      (currElem: any, index: number) => {
        if (ResourceName === currElem.ResourceName) {
          cloudVar = currElem.Cloud;
          return;
        }
      }
    );
    return cloudVar;
  };

  let cloudResourceTypes = findOcc(
    advisoryData.filteredAdvisoryData,
    "ResourceName"
  );
  let ResourceTypeCount = cloudResourceTypes.map((item) => ({
    ...item,
    sum: item.tagged + item.untagged,
  }));
  const sortedResources = ResourceTypeCount.sort((a, b) => b.sum - a.sum);
  const top10Resources = sortedResources.slice(0, 10);
  const labels = top10Resources.map((currelem: any) => currelem.ResourceName);
  const barChartDataValues = top10Resources.map(
    (currElem: any) => currElem.sum
  );

  advisoryData.filteredAdvisoryData.forEach((item) => {
    const { ResourceName, CostSaved } = item;
    let convertCost;

    if (CostSaved === "NA") {
      convertCost = 0;
    } else {
      convertCost = parseFloat(CostSaved);
    }

    if (aggregatedCostSavings.hasOwnProperty(ResourceName)) {
      aggregatedCostSavings[ResourceName] += convertCost;
    } else {
      aggregatedCostSavings[ResourceName] = convertCost;
    }
  });

  const costlabelData = aggregatedCostSavings;

  const data = {
    labels,
    datasets: [
      {
        label: label,
        data: barChartDataValues,
        barPercentage: 0.8,
        categoryPercentage: 1,
        backgroundColor: (color) => {
          let cloudType: string = findCloud(labels[color.dataIndex]);
          setLabel(cloudType);
          
      
          let colors =
            "AWS" === cloudType
              ? awsGradient
              : "GCP" === cloudType
              ? gcpGradient
              : azureGradient;
          return colors;
        },
      },
    ],
  };
  return (
    <div className="d-flex flex-column">
      <small className=" fw-bold nav-font">Top 10 Resources</small>
      <div className="d-flex w-100">
        <Bar
          className="bar_width"
          options={options}
          data={data}
        />
      </div>
    </div>
  );
}
