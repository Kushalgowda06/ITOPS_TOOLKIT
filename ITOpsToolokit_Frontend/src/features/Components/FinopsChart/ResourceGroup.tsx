import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectFinopsData,
  setAwsDailyUsage,
  setAzureDailyUsage,
  setGcpDailyUsage,
} from "../FinOpsPage/FinOpsDataSlice";
import { filterData } from "../../Utilities/filterData";

import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJs.register(Tooltip, Title, ArcElement, Legend, ChartDataLabels);

const ResourceGroup = () => {
  const finopsSliceData = useAppSelector(selectFinopsData);
  const dispatch = useAppDispatch();
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
        if (selectedData === item.ResourceGroup) {
          return true;
        }
        if (selectedData === item.Service_Name) return false;
      });

      const categorizedData = filterData("Cloud", filtered);
      dispatch(setAwsDailyUsage(categorizedData?.AWS || []));
      dispatch(setAzureDailyUsage(categorizedData?.Azure || []));
      dispatch(setGcpDailyUsage(categorizedData?.GCP || []));
    }
  };

  const costdatafetch = (label) => {
    const { count, cost } = topResourceGroup.find(
      (item) => item.name === label
    );
    return { count, cost };
  };
  let resourceCostMap = {};

  finopsSliceData.azureDailyUsage.forEach((item: any) => {
    if (resourceCostMap[item.ResourceGroup]) {
      resourceCostMap[item.ResourceGroup].count += 1;
      resourceCostMap[item.ResourceGroup].cost += item.Cost;
    } else {
      resourceCostMap[item.ResourceGroup] = { count: 1, cost: item.Cost };
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
  // // Sorting the resources based on cost from higher to lower
  const sortedResources = Object.keys(resourceCostMap).sort(
    (a, b) => resourceCostMap[b].cost - resourceCostMap[a].cost
  );

  const topResourceGroup = sortedResources.map((resourceName) => {
    return {
      name: resourceName,
      count: resourceCostMap[resourceName].count,
      cost: resourceCostMap[resourceName].cost,
    };
  });

  let options: any = {
    responsive: true,
    maintainAspectRatio: true,

    plugins: {
      legend: { display: false },
      datalabels: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: (context) => {
            const costdata = costdatafetch(context?.label);
            return `Count : ${costdata.count} `;
          },
          footer: (tooltipItems) => {
            return `Cost: ${tooltipItems[0].formattedValue}`;
          },
        },
      },
    },

    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const clickedLabel = data.labels[elements[0].index];
        updatedData(clickedLabel);
      }
    },
  };

  const colors = [
    "#1888dd",
    "#98c4eb",
    "#ff57bb",
    "#9758da",
    "#428fdd",
    "#9f76c9",
    "#ff68b4",
    "#6b3fa3",

    "#ffaedf",

    "#b989d4",
  ];

  const data = {
    labels: topResourceGroup.map((item) => item.name),
    datasets: [
      {
        data: topResourceGroup.map((item) => item.cost),
        backgroundColor: colors,
        hoverOffset: 10,
        borderWidth: 0,
      },
    ],
  };
  return (
    <div className="d-flex flex-column w-100 cursor-pointer chart-container">
      <small className=" fw-bold mb-3 nav-font ">Resource Type</small>
      <div className="d-flex justify-content-center w-100">
        <div className="cursor-pointer">
          <Pie style={{ margin: "auto" }} options={options} className="chart_height" data={data} />
        </div>
      </div>
    </div>
  );
};

export default ResourceGroup;
