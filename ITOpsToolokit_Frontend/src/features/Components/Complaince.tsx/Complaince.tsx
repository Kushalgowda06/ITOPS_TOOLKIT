import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import findOcc from "../../Utilities/Findoccurence";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectCommonConfig,
  setComplainceBarChartDataSet,
  updatecomplainceFilterArray,
  updateComplainceFilterData,
} from "../CommonConfig/commonConfigSlice";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController
);

export default function Complaince() {
  const cloudData = useAppSelector(selectCommonConfig);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [label, setLabel] = useState("");
  const [selfClicked, setSelfClicked] = useState(false);
  var awsGradient, azureGradient, gcpGradient;

  const updatedData = (selectedData) => {
    dispatch(
      updatecomplainceFilterArray({
        key: "ResourceType",
        values: [`${selectedData}`],
      })
    );
    dispatch(updateComplainceFilterData());
  };

  useEffect(()=>{
    setSelfClicked(!selfClicked)
  }, [cloudData] )

  // let canvas: any = document.getElementById("BarChart");
  // if (canvas) {
  //   let ctx = canvas?.getContext("2d");
  //   awsGradient = ctx.createLinearGradient(0, 0, 0, 180);
  //   awsGradient.addColorStop(0.2772, "#CA531B", 0.3);
  //   awsGradient.addColorStop(0.615, "#F56B1A");
  //   awsGradient.addColorStop(1, "#FA880F", 0.1);

  //   azureGradient = ctx.createLinearGradient(0, 100, 0, 200);
  //   azureGradient.addColorStop(0, "#0C6DCD");
  //   azureGradient.addColorStop(0.3498, "#007AD8");
  //   azureGradient.addColorStop(0.5734, "#198CDC");
  //   azureGradient.addColorStop(0.7045, "#2C9CE3");
  //   azureGradient.addColorStop(1, "#3BC9F3");

  //   gcpGradient = ctx.createLinearGradient(0, 0, 0, 180);
  //   gcpGradient.addColorStop(0.1, "#0B9B08", 1);
  //   gcpGradient.addColorStop(0.8, "#03A400");
  //   gcpGradient.addColorStop(1, "#00E967", 0.1);
  // }


  var Gradient;
  let canvas: any = document.getElementById("BarChart");
  let ctx = canvas?.getContext("2d");

  if (canvas) {
    Gradient = ctx.createLinearGradient(0, 10, 0, 260);
    Gradient.addColorStop(0, "#8574FF");
    Gradient.addColorStop(0.27, "rgba(182, 0, 186, 0.4)");
    Gradient.addColorStop(0.9999, "rgba(255, 255, 255, 0)");
  }
  
  var color;
  if (canvas) {
    color = ctx.createLinearGradient(0, 100, 0, 600);
    color.addColorStop(0, "rgba(133, 116, 255, 0.1)"); // Fully opaque
    color.addColorStop(0.27, "rgba(182, 0, 186, 0.2)"); // 40% opacity
    color.addColorStop(0.9999, "rgba(255, 255, 255, 0.1)");
  }



  const handleChartClick = async (datasetIndex, dataIndex, chartref, clickedLabel) => {

    if (cloudData.complaincebarChartDataset == null) {
      dispatch(setComplainceBarChartDataSet(dataIndex))
      updatedData(clickedLabel)
    }

    if (cloudData.complaincebarChartDataset !== null && cloudData.complaincebarChartDataset== dataIndex) {
      dispatch(setComplainceBarChartDataSet(null))
      updatedData(clickedLabel)
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
        display: false,
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
            family: "GelixRegular",
          },
          callback: function (value) {
            if (this.getLabelForValue(value).length > 7) {
              return this.getLabelForValue(value).substr(0, 7) + "...";
            } else {
              return this.getLabelForValue(value);
            }
          },
        },
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
            family: "GelixRegular",
            size: 8,
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

  const findCloud = (ResourceType: string) => {
    let cloudVar: string = "";
    cloudData.filteredComplainceData.forEach((currElem: any, index: number) => {
      if (ResourceType === currElem.ResourceType) {
        cloudVar = currElem.Cloud;
        return;
      }
    });
    return cloudVar;
  };



  let dataVariable = (cloudData.complaincebarChartDataset || cloudData.complaincebarChartDataset === 0) ? cloudData.complianceData : cloudData.filteredComplainceData;
 let cloudResourceTypes = findOcc(dataVariable, "ResourceType");

  let ResourceTypeCount = cloudResourceTypes.map((item) => ({
    ...item,
    sum: item.tagged + item.untagged,
  }));
  const sortedResources = ResourceTypeCount.sort((a, b) => b.sum - a.sum);
  // const top10Resources = sortedResources.slice(0, 10);
  const labels = sortedResources.map((currelem: any) => currelem.ResourceType);

  const barChartDataValues = sortedResources.map(
    (currElem: any) => currElem.sum
  );

  const backgroundColors = barChartDataValues?.map((curr, index) => {

    if (cloudData.complaincebarChartDataset === null) {
      return Gradient
    } else if (cloudData.complaincebarChartDataset !== null && index !== cloudData.complaincebarChartDataset) {
      return color
    }
  })

  const data = {
    labels,
    datasets: [
      {
        label: label,
        data: barChartDataValues,
        borderWidth: 1,
        backgroundColor: backgroundColors ,
      },
    ],
  };
  return (
    <div className="d-flex flex-column w-100">
      <small className="fw-bold nav-font">Compliance</small>
      <div className="d-flex w-100">
        <div className="w-100">
          <Bar
            id="BarChart"
            style={{ height: "100px", width: "474px" }}
            options={options}
            data={data}
            className="soe"
          />
        </div>
      </div>
    </div>
  );
}
