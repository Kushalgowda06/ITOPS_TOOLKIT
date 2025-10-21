// created Funnel based on Application
import React, { useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import findOcc from "../../Utilities/Findoccurence";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectCommonConfig,
  updatetaggingFilterArray,
  updateTaggingFilterData,
  updateorphanFilterArray,
  updateOrphanFilterData,
  updateadvisoryFilterArray,
  updateAdvisoryFilterData,
  setAppBarDataset,
  updatecomplainceFilterArray,
  updateComplainceFilterData,
} from "../CommonConfig/commonConfigSlice";
import { useState } from "react";

const Application = ({setShowToast, showMes}) => {
  const cloudData: any = useAppSelector(selectCommonConfig);
  const top10AppN = [];
  const width = window.outerWidth;
  const dispatch = useAppDispatch();
  const [flag, setflag] = useState(true);
  const [selfClicked, setSelfClicked] = useState(false)
  const location = useLocation();
  const pathname = location.pathname;
  const aggregatedCostSavings = {};
  let costlabelData;

  let test;
  if (pathname.includes("tagging-policy")) {
    let dataVariable = (cloudData.appBarDataset || cloudData.appBarDataset === 0)
      ? cloudData.cloudData
      : cloudData.filteredTaggingData;
    test = findOcc(dataVariable, "Application");
  } 
  else if (pathname.includes("complaince-policy")) {
    let dataVariable = (cloudData.appBarDataset || cloudData.appBarDataset === 0)
      ? cloudData.complianceData
      : cloudData.filteredComplainceData;

      const initialcomData = dataVariable.filter((item: any) => {
        return item.Compliance === "Non-Compliant";
      });
    test = findOcc(initialcomData, "Application");
  } 
  
  else if (pathname.includes("orphan-objects")) {
    let dataVariable = (cloudData.appBarDataset || cloudData.appBarDataset === 0)
      ? cloudData.orphanData
      : cloudData.filteredOrphanData;
    const initialData = dataVariable.filter((item: any) => {
      return item.ResourceStatus === "Orphaned";
    });
    initialData.forEach((item) => {
      const { Application, CostSaving } = item;
      const convertCost = parseFloat(CostSaving);
      if (aggregatedCostSavings.hasOwnProperty(Application)) {
        aggregatedCostSavings[Application] += convertCost;
      } else {
        aggregatedCostSavings[Application] = convertCost;
      }
    });
    costlabelData = aggregatedCostSavings;
    test = findOcc(initialData, "Application");
  } else if (pathname.includes("cloud-advisory")) {
    let dataVariable = (cloudData.appBarDataset || cloudData.appBarDataset === 0)
      ? cloudData.advisoryData
      : cloudData.filteredAdvisoryData;
    dataVariable.forEach((item) => {
      const { Application, CostSaved } = item;
      let convertCost;

      if (CostSaved === "NA") {
        convertCost = 0;
      } else {
        convertCost = parseFloat(CostSaved);
      }

      if (aggregatedCostSavings.hasOwnProperty(Application)) {
        aggregatedCostSavings[Application] += convertCost;
      } else {
        aggregatedCostSavings[Application] = convertCost;
      }
    });
    costlabelData = aggregatedCostSavings;
    test = findOcc(dataVariable, "Application");
  }

  const updatedData = (selectedData) => {
    setflag(!flag);
    if (pathname.includes("tagging-policy")) {
      dispatch(
        updatetaggingFilterArray({
          key: "Application",
          values: [`${selectedData}`],
        })
      );
      dispatch(updateTaggingFilterData());
    }
   else if (pathname.includes("complaince-policy")) {
      dispatch(
        updatecomplainceFilterArray({
          key: "Application",
          values: [`${selectedData}`],
        })
      );
      dispatch(updateComplainceFilterData());
    } 
    
    else if (pathname.includes("orphan-objects")) {
      dispatch(
        updateorphanFilterArray({
          key: "Application",
          values: [`${selectedData}`],
        })
      );
      dispatch(updateOrphanFilterData());
    } else if (pathname.includes("cloud-advisory")) {
      dispatch(
        updateadvisoryFilterArray({
          key: "Application",
          values: [`${selectedData}`],
        })
      );
      dispatch(updateAdvisoryFilterData());
    }
  };

  useEffect(()=>{
    setSelfClicked(!selfClicked)
  }, [cloudData] )

  var Gradient;
  let canvas: any = document.getElementById("BarChart");
  var Gradient;

  let ctx = canvas?.getContext("2d");

  if (canvas) {
    Gradient = ctx.createLinearGradient(540, 200, 0, 800);
    Gradient.addColorStop(0, "#8574FF");
    Gradient.addColorStop(0.27, "rgba(182, 0, 186, 0.4)");
    Gradient.addColorStop(0.9999, "rgba(255, 255, 255, 0)");
  }
  var testcolor;
  if (canvas) {
    testcolor = ctx.createLinearGradient(500, 200, 0, 800);
    testcolor.addColorStop(0, "#8574FF");
    testcolor.addColorStop(0.27, "rgba(182, 0, 186, 0.4)");
    testcolor.addColorStop(0.9999, "rgba(255, 255, 255, 0)");
  }
  var color;
  if (canvas) {
    let ctx = canvas?.getContext("2d");
    color = ctx.createLinearGradient(500, 200, 0, 800);
    color.addColorStop(0, "rgba(133, 116, 255, 0.1)");
    color.addColorStop(0.27, "rgba(182, 0, 186, 0.2)"); // Adjust the alpha value to make it brighter
    color.addColorStop(0.9999, "rgba(255, 255, 255, 0.1)");
  }
  const result = test.sort((a, b) => b.occurrence - a.occurrence);
  let top10App;
  if (pathname.includes("tagging-policy")) {
    const tagginglabel = result.filter((resource) => resource.untagged > 0);
    const taglabel = tagginglabel.sort((a, b) => b.untagged - a.untagged);
    top10App = tagginglabel.map((item) => {
      return {
        Application: item.Application,
        occurrence: item.untagged / 2,
      };
    });
  } else {
    top10App = result.map((item) => {
      return {
        Application: item.Application,
        occurrence: (item.tagged + item.untagged) / 2,
      };
    });
  }
  top10App.forEach((item) => {
    const updatedResource = {
      Application: item.Application,
      occurrence: -item.occurrence,
    };
    top10AppN.push(updatedResource);
  });

  let labels = top10App.map((item) => item.Application);

  const backgroundColors = top10App?.map((curr, index) => {
    if (cloudData.appBarDataset === null) {
      return Gradient;
    } else if (
      cloudData.appBarDataset !== null &&
      index !== cloudData.appBarDataset
    ) {

      return color;
    }
    return Gradient;
  });

  const backgroundColorsN = top10AppN?.map((curr, index) => {

    if (cloudData.appBarDataset === null) {
      return Gradient;
    } else if ( cloudData.appBarDataset !== null && index !== cloudData.appBarDataset) {

      return color;
    }
    return Gradient;
  });

  useEffect(() => {
    const subbox = document.querySelector(".subbox") as HTMLElement;
    if (subbox) {
      subbox.style.height = "300px";
      if (labels.length >= 5) {
        const newHeight = 300 + (labels.length - 5) * 20;
        subbox.style.height = `${newHeight}px`;
      }
    }
  }, [labels]);

  const data = {
    labels,
    datasets: [
      {
        label: "Count",
        data: top10App.map((item) => item.occurrence),
        backgroundColor: backgroundColors,
        borderWidth: 1,
        barPercentage: 1,
        categoryPercentage: 0.9,
      },
      {
        label: "Count",
        data: top10AppN.map((item) => item.occurrence),
        backgroundColor: backgroundColorsN,
        borderWidth: 1,
        barPercentage: 1,

        categoryPercentage: 0.9,

        datalabels: {
          display: false,
        },
      },
    ],
  };

  const handleChartClick = async (datasetIndex,dataIndex,chartref,clickedLabel) => {
    if (cloudData.appBarDataset == null) {
      dispatch(setAppBarDataset(dataIndex));
      updatedData(clickedLabel);
      showMes(` Application : ${clickedLabel}`);
      setShowToast(true)

    }
    if (cloudData.appBarDataset !== null && cloudData.appBarDataset == dataIndex) {
      dispatch(setAppBarDataset(null));
      updatedData(clickedLabel);
      setShowToast(false)
    }
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
        max: 8,
        ticks: {
          font: {
            size: width >= 1600 ? 24 : 10,
            family: "GelixRegular",
          },
        },
        border: {
          display: false,
        },
        grid: {
          display: false,
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
            if (
              pathname.includes("orphan-objects") ||
              pathname.includes("cloud-advisory")
            ) {
              const index = tooltipItems[0].dataIndex;
              const costSaving = costlabelData[labels[index]]?.toFixed(2);
              return `Cost Saving: $${costSaving}`;
            } else {
              return "";
            }
          },
        },
      },
      datalabels: {
        display: true,
        color: "white",
        font: {
          size: width >= 1600 ? 24 : 18,
          weight: 700,
        },
        anchor: "start" as const,
        formatter: function (value) {
          const formattedValue = value * 2;
          return `${formattedValue}`;
        },
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedLabel = data.labels[elements[0].index];
        const datasetIndex = elements[0].datasetIndex;
        const dataIndex = elements[0].index;
        const chart = event.chart;
        handleChartClick(datasetIndex, dataIndex, chart, clickedLabel);
      }
    },
    onHover: (evt, activeEls) => {
      activeEls.length > 0
        ? (evt.chart.canvas.style.cursor = "pointer")
        : (evt.chart.canvas.style.cursor = "default");
    },
  };

  return (
    <div className="d-inline">
      <small className="fw-bold nav-font">Application</small>
      <div className="box p-2">
        <div className="cursor-pointer subbox">
          <Bar id="Barchart" data={data} options={options} />
        </div>
      </div>
    </div>
  );
};
export default Application;
