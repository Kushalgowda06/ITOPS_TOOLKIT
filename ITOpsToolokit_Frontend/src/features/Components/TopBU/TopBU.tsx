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
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectCommonConfig,
  updatetaggingFilterArray,
  updateTaggingFilterData,
  updateorphanFilterArray,
  updateOrphanFilterData,
  updateadvisoryFilterArray,
  updateAdvisoryFilterData,
  setBarChartDataSet,
  updatecomplainceFilterArray,
  updateComplainceFilterData,
} from "../CommonConfig/commonConfigSlice";
import { useEffect, useState, useRef} from "react";
import { useLocation } from "react-router-dom";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function TopBU({setShowToast, showMes}) {
  
  const cloudData = useAppSelector(selectCommonConfig);
  const dispatch = useAppDispatch();
  const [label, setLabel] = useState("");
  const [selfClicked, setSelfClicked] = useState(false)
  const location = useLocation();
  const width = window.outerWidth;
  const aggregatedCostSavings = {};
  const pathname = location.pathname;
  let costlabelData;
  const canvasRef = useRef(null);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight *0.4);
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth * 0.4); // Decrease height by 200px
  console.log(window,"window")
  useEffect(() => {
    const handleResize = () => {
      setCanvasHeight(window.innerHeight * 0.4  );
      setCanvasWidth(window.innerWidth * 0.4);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerHeight]);

  const updatedData = (selectedData) => {
    if (pathname.includes("tagging-policy")) {
      dispatch(
        updatetaggingFilterArray({ key: "BU", values: [`${selectedData}`] })
      );
      dispatch(updateTaggingFilterData());
    } else if (pathname.includes("orphan-objects")) {
      dispatch(
        updateorphanFilterArray({ key: "BU", values: [`${selectedData}`] })
      );
      dispatch(updateOrphanFilterData());
    } else if (pathname.includes("cloud-advisory")) {
      dispatch(
        updateadvisoryFilterArray({ key: "BU", values: [`${selectedData}`] })
      );
      dispatch(updateAdvisoryFilterData());
    }
    else if (pathname.includes("complaince-policy")) {
      dispatch(
        updatecomplainceFilterArray({ key: "BU", values: [`${selectedData}`] })
      );
      dispatch(updateComplainceFilterData());
    }
  };

  useEffect(()=>{
    setSelfClicked(!selfClicked)
  }, [cloudData] )

  var Gradient;
  let canvas: any = document.getElementById("BarChart");
  let ctx = canvas?.getContext("2d");

  if (canvas) {
    Gradient = ctx.createLinearGradient(0, 100, 0, 600);
    Gradient.addColorStop(0, "#8574FF");
    Gradient.addColorStop(0.27, "rgba(182, 0, 186, 0.4)");
    Gradient.addColorStop(0.9999, "rgba(255, 255, 255, 0)");
  }
  var testcolor;
  if (canvas) {
    testcolor = ctx.createLinearGradient(0, 100, 0, 600);
    testcolor.addColorStop(0, "#8574FF");
    testcolor.addColorStop(0.27, "rgba(182, 0, 186, 0.4)");
    testcolor.addColorStop(0.9999, "rgba(255, 255, 255, 0)");
  }
  var color;
  if (canvas) {
    color = ctx.createLinearGradient(0, 100, 0, 600);
    color.addColorStop(0, "rgba(133, 116, 255, 0.1)"); // Fully opaque
    color.addColorStop(0.27, "rgba(182, 0, 186, 0.2)"); // 40% opacity
    color.addColorStop(0.9999, "rgba(255, 255, 255, 0.1)");
  }


  const handleChartClick = async (datasetIndex, dataIndex, chartref, clickedLabel) => {
    if (cloudData.barChartDataset == null) {
      dispatch(setBarChartDataSet(dataIndex))
      updatedData(clickedLabel)
      showMes(` BU : ${clickedLabel}`);
      setShowToast(true)
    }

    if (cloudData.barChartDataset !== null && cloudData.barChartDataset === dataIndex) {
      dispatch(setBarChartDataSet(null))
      updatedData(clickedLabel)
      setShowToast(false)
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
      },
      legend: { display: false },
      datalabels: {
        display: function (context) {
          if (
            pathname.includes("orphan-objects") ||
            pathname.includes("cloud-advisory")
          ) {
            return true;
          }
          if (pathname.includes("tagging-policy") || 
          pathname.includes("complaince-policy")
          ) {
            return false;
          }
          return false;
        },
        align: function (context) {
          return context.dataIndex > -1 ? "top" : "center";
        },
        anchor: function (context) {
          return context.dataIndex > -1 ? "end" : "center";
        },
        offset: 1,
        font: {
          size: width >= 1600 ? 24 : 18, 
        },
        formatter: function (value, context) {
          const index = context.dataIndex;
          const costSaving = costlabelData[labels[index]]?.toFixed(1);
          return `$${costSaving}`;
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Count: ${context.formattedValue}`;
          },

          footer: (tooltipItems) => {
            if (
              pathname.includes("orphan-objects") ||
              pathname.includes("cloud-advisory")
            ) {
              const index = tooltipItems[0].dataIndex;
              const costSaving = costlabelData[labels[index]].toFixed(1);

              return `Cost Saving: $${costSaving}`;
            } else {
              return "";
            }
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
          callback: function (value) {
            if (this?.getLabelForValue(value)?.length > 7) {
              return this.getLabelForValue(value).substr(0, 7) + "...";
            } else {
              return this.getLabelForValue(value);
            }
          },
          font: {
            size: width >= 1600 ? 24 : 10,
            family: "GelixRegular",
          },
        },
      },

      y: {
        grace: "10%",
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "GelixRegular",
            size: width >= 1600 ? 24 : 10,
          },
        },
      },
    },

    onClick: (event, elements) => {
      if (elements.length > 0) {
        const datasetIndex = elements[0].datasetIndex;
        const dataIndex = elements[0].index; //current index
        const chart = event.chart;
        const clickedLabel = data.labels[elements[0].index];
        handleChartClick(datasetIndex, dataIndex, chart, clickedLabel);
      }
    },

    onHover: (evt, activeEls) => {
      activeEls.length > 0
        ? (evt.chart.canvas.style.cursor = "pointer")
        : (evt.chart.canvas.style.cursor = "default");
    },
  };

  let cloudResourceTypes;
  if (pathname.includes("tagging-policy")) {

    let dataVariable = (cloudData.barChartDataset || cloudData.barChartDataset === 0) ? cloudData.cloudData : cloudData.filteredTaggingData;
    cloudResourceTypes = findOcc(dataVariable, "BU");
  } 
  else if (pathname.includes("complaince-policy")) {

    let dataVariable = (cloudData.barChartDataset || cloudData.barChartDataset === 0) ? cloudData.complianceData : cloudData.filteredComplainceData;
    const initialcomData = dataVariable.filter((item: any) => {
      return item.Compliance === "Non-Compliant";
    });
    cloudResourceTypes = findOcc(initialcomData, "BU");
  }
  else if (pathname.includes("orphan-objects")) {
    let dataVariable = (cloudData.barChartDataset || cloudData.barChartDataset === 0) ? cloudData.orphanData : cloudData.filteredOrphanData;
    const initialData = dataVariable.filter((item: any) => {
      return item.ResourceStatus === "Orphaned";
    });
    initialData.forEach((item) => {
      const { BU, CostSaving } = item;
      const convertCost = parseFloat(CostSaving);
      if (aggregatedCostSavings.hasOwnProperty(BU)) {
        aggregatedCostSavings[BU] += convertCost;
      } else {
        aggregatedCostSavings[BU] = convertCost;
      }
    });
    costlabelData = aggregatedCostSavings;

    cloudResourceTypes = findOcc(initialData, "BU");
  } 
  else if (pathname.includes("cloud-advisory")) {

    let dataVariable =  (cloudData.barChartDataset || cloudData.barChartDataset === 0) ? cloudData.advisoryData : cloudData.filteredAdvisoryData;


    dataVariable.forEach((item) => {
      const { BU, CostSaved } = item;
      let convertCost;

      if (CostSaved === "NA" || CostSaved === "" || CostSaved === "test") {
        convertCost = 0;
      } else {
        convertCost = parseFloat(CostSaved);
      }

      if (aggregatedCostSavings.hasOwnProperty(BU)) {
        aggregatedCostSavings[BU] += convertCost;
      } else {
        aggregatedCostSavings[BU] = convertCost;
      }
    });
    costlabelData = aggregatedCostSavings;
    cloudResourceTypes = findOcc(dataVariable, "BU");
  }


  let labels;
  const tagginglabel = cloudResourceTypes.filter(resource => resource.untagged > 0);
  if (pathname.includes("tagging-policy")) {
    labels = tagginglabel?.map((currelem: any) => currelem?.BU);
  } else {
    labels = cloudResourceTypes?.map((currelem: any) => currelem?.BU);
  }

  let barChartDataValues;
  if (pathname.includes("tagging-policy")) {
    barChartDataValues = tagginglabel?.map(
      (currElem: any) => currElem.untagged
    );
  } else {
    barChartDataValues = cloudResourceTypes?.map(
      (currElem: any) => currElem.tagged + currElem.untagged
    );
  }

  const backgroundColors = barChartDataValues?.map((curr, index) => {
    if (cloudData.barChartDataset === null) {
      return Gradient
    } else if (cloudData.barChartDataset !== null && index !== cloudData.barChartDataset) {
      return color
    }
  })

  const data = {
    labels,
    datasets: [
      {
        label: label,
        data: barChartDataValues,
        backgroundColor: backgroundColors,
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="w-100">
      <small className="fw-bold nav-font">Business Unit</small>
      <div className="container">
          <Bar
            id="BarChart"
            ref= {canvasRef}
            height= {canvasHeight}
            width= {canvasWidth}
            options={options}
            data={data}
          />
        </div>
      </div>
    
  );
}
