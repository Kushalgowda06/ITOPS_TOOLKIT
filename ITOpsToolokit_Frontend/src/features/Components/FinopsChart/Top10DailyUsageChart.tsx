// created New Pyramid Chart based on Resource Name and Cost

import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  selectFinopsData,
  setAwsDailyUsage,
  setAwsForecast,
  setAzureDailyUsage,
  setAzureForecast,
  setGcpDailyUsage,
  setGcpForecast,
} from "../FinOpsPage/FinOpsDataSlice";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { filterData } from "../../Utilities/filterData";
const Top10DailyUsageChart = () => {
  const finopsSliceData = useAppSelector(selectFinopsData);
  const dispatch = useAppDispatch();
  const width = window.outerWidth;
  var finopsdailyfilterdata = [
    ...finopsSliceData.awsDailyUsage,
    ...finopsSliceData.gcpDailyUsage,
    ...finopsSliceData.azureDailyUsage,
  ];
  var finopsforecastfilterdata = [
    ...finopsSliceData.azureForecast,
   ,...finopsSliceData.gcpForecast,
    ...finopsSliceData.awsForecast
  ];
  const [prevSelectedData, setPrevSelectedData] = useState(null);

  const updatedData = (selectedData) => {
    setPrevSelectedData(selectedData);
    if (selectedData === prevSelectedData) {
      dispatch(setAwsDailyUsage(finopsSliceData?.finopsawsDailyUsage));
      dispatch(setAzureDailyUsage(finopsSliceData?.finopsazureDailyUsage));
      dispatch(setGcpDailyUsage(finopsSliceData?.finopsgcpDailyUsage));
      dispatch(setAzureForecast(finopsSliceData?.finopsazureForecast));
      dispatch(setGcpForecast(finopsSliceData?.finopsawsForecast));
      dispatch(setAwsForecast(finopsSliceData?.finopsgcpForecast));
      setPrevSelectedData(null);
    } else {
      const dailyfilter = finopsdailyfilterdata.filter(
        (item: any) => selectedData === item.Date
      );

      const forecastfilter = finopsforecastfilterdata.filter(
        (item: any) => selectedData === item.Date
      );
      const categorizedData = filterData("Cloud", dailyfilter);
      const categorizedData1 = filterData("Cloud", forecastfilter);

      dispatch(setAwsDailyUsage(categorizedData?.AWS || []));
      dispatch(setAzureDailyUsage(categorizedData?.Azure || []));
      dispatch(setGcpDailyUsage(categorizedData?.GCP || []));

      dispatch(setAzureForecast(categorizedData1?.Azure || []));
      dispatch(setGcpForecast(categorizedData1?.GCP|| []))
      dispatch(setAwsForecast(categorizedData1?.AWS || []   ))
    }
  };

  // Storing resource names and their costs
  let resourceCostMap = {};
  finopsSliceData.azureDailyUsage.forEach((item: any) => {
    // Parse the original date string
    const originalDate = new Date(item.Date);

    // Format the date in the desired format (dd-mm-yyyy)
    const formattedDate = `${originalDate
      .getDate()
      .toString()
      .padStart(2, "0")}-${(originalDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${originalDate.getFullYear()}`;

    if (resourceCostMap[formattedDate]) {
      resourceCostMap[formattedDate].count += 1;
      resourceCostMap[formattedDate].cost += item.Cost;
    } else {
      resourceCostMap[formattedDate] = { count: 1, cost: item.Cost };
    }
  });

  finopsSliceData.awsDailyUsage.forEach((item: any) => {
    const originalDate = new Date(item.Date);
    const formattedDate = `${originalDate
      .getDate()
      .toString()
      .padStart(2, "0")}-${(originalDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${originalDate.getFullYear()}`;

    if (resourceCostMap[formattedDate]) {
      resourceCostMap[formattedDate].count += 1;
      resourceCostMap[formattedDate].cost += Number(item.Aws); // Ensure cost is a number
    } else {
      resourceCostMap[formattedDate] = { count: 1, cost: Number(item.Aws) }; // Use Number() for cost here as well
    }
  });
  function convertDateFormat(dateString) {
    const [day, month, year] = dateString.split("-");
    const newDate = new Date(year, month - 1, day);
    newDate.setDate(newDate.getDate() + 1);
    return newDate.toISOString().slice(0, 10);
  }

  finopsSliceData.gcpDailyUsage.forEach((item: any) => {
    // Parse the original date string
    const originalDate = new Date(item.Date);

    // Format the date in the desired format (dd-mm-yyyy)
    const formattedDate = `${originalDate
      .getDate()
      .toString()
      .padStart(2, "0")}-${(originalDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${originalDate.getFullYear()}`;

    if (resourceCostMap[formattedDate]) {
      resourceCostMap[formattedDate].count += 1;
      resourceCostMap[formattedDate].cost += Number(item.Cost);
    } else {
      resourceCostMap[formattedDate] = { count: 1, cost: Number(item.Cost) };
    }
  });
  // Sorting the resources based on cost from higher to lower
  const sortedResources = Object.keys(resourceCostMap).sort(
    (a, b) => resourceCostMap[b].cost - resourceCostMap[a].cost
  );
  // Storing only the top 10 resources
  const top10Resources = sortedResources.slice(0, 10).map((date) => {
    return {
      name: date,
      count: resourceCostMap[date].count,
      cost: resourceCostMap[date].cost / 2,
    };
  });
  const top10ResourcesN = [];

  top10Resources.forEach((date) => {
    const updatedResource = {
      name: date.name,
      count: date.count,
      cost: -date.cost,
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
      updatedData(convertDateFormat(clickedLabel));
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
    labels: top10Resources.map((item) => item.name),
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
            return `Count: ${countValue}`;
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
          const formattedValue = (value * 2).toFixed(2); // Multiply the value by 2 and format it
          return `$${formattedValue}`;
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
    <div className="d-flex flex-column w-100 cursor-pointer ">
      <small className=" fw-bold mb-0 nav-font">Top 10 Max Daily Usage</small>
      <div className="d-flex w-100">
        <div className="cursor-pointer">
          <Bar
            id="BarChart"
            style={{ width: "330px", height: "330px" }}
            options={options}
            data={data}
            className="Resource"
          />
        </div>
      </div>
    </div>
  );
};
export default Top10DailyUsageChart;
