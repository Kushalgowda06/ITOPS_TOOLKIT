// created New Pyramid Chart based on Resource Name and Cost
import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { capitalizeFirstLetter } from "../../Utilities/capitalise";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectFinopsData,
  setAwsDailyUsage,
  setAzureDailyUsage,
  setGcpDailyUsage,
} from "../FinOpsPage/FinOpsDataSlice";
import { filterData } from "../../Utilities/filterData";

const Top10CostChart = () => {
  // Storing resource names and their costs
  const finopsSliceData = useAppSelector(selectFinopsData);
  const dispatch = useAppDispatch();
  const width = window.outerWidth;
  var finopsfilterdata = [
    ...finopsSliceData.awsDailyUsage,
    ...finopsSliceData.gcpDailyUsage,
    ...finopsSliceData.azureDailyUsage,
  ];
  const [prevSelectedData, setPrevSelectedData] = useState(null);

  const updatedData = (selectedData) => {
    setPrevSelectedData(selectedData);
    if (selectedData === prevSelectedData) {
      dispatch(setAwsDailyUsage(finopsSliceData?.finopsawsDailyUsage));
      dispatch(setAzureDailyUsage(finopsSliceData?.finopsazureDailyUsage));
      dispatch(setGcpDailyUsage(finopsSliceData?.finopsgcpDailyUsage));
      setPrevSelectedData(null);
    } else {
      const filtered = finopsfilterdata.filter((item: any) => {
        if (selectedData === item.ServiceName) {
          return true;
        }
        if (selectedData === item.ResourceName) {
          return true;
        }
        return false;
      });

      const categorizedData = filterData("Cloud", filtered);
      dispatch(setAwsDailyUsage(categorizedData?.AWS || []));
      dispatch(setAzureDailyUsage(categorizedData?.Azure || []));
      dispatch(setGcpDailyUsage(categorizedData?.GCP || []));
    }
  };

  let resourceCostMap = {};

  finopsSliceData.azureDailyUsage.forEach((item: any) => {
    if (resourceCostMap[item.ResourceName]) {
      resourceCostMap[item.ResourceName].count += 1;
      resourceCostMap[item.ResourceName].cost += item.Cost;
    } else {
      resourceCostMap[item.ResourceName] = { count: 1, cost: item.Cost };
    }
  });
  finopsSliceData.awsDailyUsage.forEach((item: any) => {
    if (resourceCostMap[item.ServiceName]) {
      resourceCostMap[item.ServiceName].count += 1;
      resourceCostMap[item.ServiceName].cost += parseFloat(item.Aws);
    } else {
      resourceCostMap[item.ServiceName] = {
        count: 1,
        cost: parseFloat(item.Aws),
      };
    }
  });
  finopsSliceData.gcpDailyUsage.forEach((item: any) => {
    if (resourceCostMap[item.Service_Name]) {
      resourceCostMap[item.Service_Name].count += 1;
      resourceCostMap[item.Service_Name].cost += parseFloat(item.Cost);
    } else {
      resourceCostMap[item.Service_Name] = {
        count: 1,
        cost: parseFloat(item.Cost),
      };
    }
  });

  // Sorting the resources based on cost from higher to lower
  const sortedResources = Object.keys(resourceCostMap).sort(
    (a, b) => resourceCostMap[b].cost - resourceCostMap[a].cost
  );

  // Storing only the top 10 resources
  const top10Resources = sortedResources.slice(0, 10).map((resourceName) => {
    return {
      name: resourceName,
      count: resourceCostMap[resourceName].count,
      cost: resourceCostMap[resourceName].cost / 2,
    };
  });
  const top10ResourcesN = [];

  top10Resources.forEach((resource) => {
    const updatedResource = {
      name: resource.name,
      count: resource.count,
      cost: -resource.cost,
    };
    top10ResourcesN.push(updatedResource);
  });

  const handleChartClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedLabel = data.labels[elements[0].index];
      const datasetIndex = elements[0].datasetIndex;
      const dataIndex = elements[0].index;
      const chart = event.chart;
      // // Call your updatedData function
      updatedData(clickedLabel);
      // setActiveBarIndex(dataIndex);
    }
  };

  var Gradient;
  let canvas: any = document.getElementById("BarChart");
  let ctx = canvas?.getContext("2d");
  if (canvas) {
    Gradient = ctx.createLinearGradient(540, 200, 0, 800);
    Gradient.addColorStop(0, "#8574FF");
    Gradient.addColorStop(0.27, "rgba(182, 0, 186, 0.4)");
    Gradient.addColorStop(0.9999, "rgba(255, 255, 255, 0)");
  }

  const data = {
    labels: top10Resources.map((item) => capitalizeFirstLetter(item.name)),
    datasets: [
      {
        label: "COST",
        data: top10Resources.map((item) => item.cost),
        backgroundColor: Gradient,
        borderWidth: 1,
        barPercentage: 0.9,
        categoryPercentage: 1,
      },
      {
        label: "COST",
        data: top10ResourcesN.map((item) => item.cost),
        backgroundColor: Gradient,
        borderWidth: 1,
        barPercentage: 0.9,
        categoryPercentage: 1,
        datalabels: {
          display: false,
        },
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,

    scales: {
      x: {
        display: false,
        stacked: true,
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
            size: width >= 1600 ? 24 : 12,
            family: "GelixRegular",
          },
          callback: function (val, index) {
            if (this.getLabelForValue(val).length > 4) {
              return this.getLabelForValue(val).substr(0, 7) + "..";
            } else {
            }
            this.getLabelForValue(val);
          },
        },
        beginAtZero: true,
        stacked: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const datapoint = (Math.abs(context.raw) * 2).toString();
            const label = context.dataset.label;
            return `${label}: ${datapoint}`;
          },
          footer: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            const countValue = top10Resources[index].count;
            return `    Count: ${countValue}`;
          },
        },
      },
      datalabels: {
        display: true,
        color: "white",
        font: {
          weight: 600,
          size: width >= 1600 ? 24 : 11,
          family: "GelixRegular",
        },
        anchor: "start" as const,
        formatter: function (value) {
          const formattedValue = value * 2; // Multiply the value by 2 and format it
          return `$${formattedValue.toFixed(2)}`;
        },
      },
    },
    onClick: handleChartClick,
    onHover: (evt, activeEls) => {
      activeEls.length > 0
        ? (evt.chart.canvas.style.cursor = "pointer")
        : (evt.chart.canvas.style.cursor = "default");
    },
  };

  return (
    <div className="d-flex flex-column w-100 ">
      <small className=" fw-bold mb-0 nav-font ">Top 10 Resources</small>
      <div className="d-flex w-100">
        <div className="">
       
          <Bar
            id="BarChart"
            style={{ width: "310px", height: "330px" }}
            options={options}
            data={data}
            className="Resource"
          />
        </div>
      </div>
    </div>
  );
};
export default Top10CostChart;
