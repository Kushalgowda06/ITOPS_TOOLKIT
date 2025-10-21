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
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import { useState, useRef , useEffect} from "react";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController
);


export default function TopUntagged() {
  const canvasRef = useRef(null);
  const [canvasHeight, setCanvasHeight] = useState(window.innerHeight *0.4);
  const [canvasWidth, setCanvasWidth] = useState(window.innerWidth ); // Decrease height by 200px
  console.log(window,"window")
  useEffect(() => {
    const handleResize = () => {
      setCanvasHeight(window.innerHeight * 0.4);
      setCanvasWidth(window.innerWidth );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerHeight]);
  // const useWindowWidth = () => {
  //   const [width, setWidth] = useState(window.innerWidth);

  //   useEffect(() => {
  //     const handleResize = () => setWidth(window.innerWidth);
  //     window.addEventListener('resize', handleResize);
  //     return () => window.removeEventListener('resize', handleResize);
  //   }, []);

  //   return width;
  // };


  const width = window.outerWidth;


  const cloudData = useAppSelector(selectCommonConfig);
  const navigate = useNavigate();
  const [label, setLabel] = useState("");

  var awsGradient, azureGradient, gcpGradient;
  let canvas: any = document.getElementById("BarChart");
  // let canvas = canvasRef.current;
  if (canvas) {
   
    let ctx = canvas?.getContext("2d");
    awsGradient = ctx.createLinearGradient(0, 0, 0, 180);
    awsGradient.addColorStop(0.2772, "#CA531B", 0.3);
    awsGradient.addColorStop(0.615, "#F56B1A");
    awsGradient.addColorStop(1, "#FA880F", 0.1);

    azureGradient = ctx.createLinearGradient(0, 100, 0, 200);
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
            size: width >= 1600 ? 24 : 10,
            family: "GelixRegular"
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
            size: width >= 1600 ? 24 : 10
          },
        },
      },
    },

    onClick: (event, elements) => {
      if (elements.length > 0) {
        const clickedLabel = data.labels[elements[0].index];
        navigate({
          pathname: "/details",
          search: `?label=${clickedLabel}`,
        });
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
    cloudData.filteredTaggingData.forEach((currElem: any, index: number) => {
      if (ResourceType === currElem.ResourceType) {
        cloudVar = currElem.Cloud;
        return;
      }
    });
    return cloudVar;
  };

  let cloudResourceTypes = findOcc(cloudData.filteredTaggingData, "ResourceType");
  const sortedResources = cloudResourceTypes.sort((a, b) => b.untagged - a.untagged);
  const top10Resources = sortedResources.slice(0, 10);
  const tagginglabel = top10Resources.filter(resource => resource.untagged > 0);
  const labels = tagginglabel?.map((currelem: any) => currelem?.ResourceType);

  const barChartDataValues = tagginglabel.map(
    (currElem: any) => currElem.untagged
  );



  const data = {
    labels,
    datasets: [
      {
        label: label,
        data: barChartDataValues,
        borderWidth: 1,
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
          // set label based on backgroundColor
        },
      },
    ],
  };

  return (
    <div className="w-100 ">
      <small className="fw-bold nav-font">Top 10 Un-Tagged</small>
        <div className="container ">
          <Bar
            id="BarChart"
            options={options}
            data={data}
            ref= {canvasRef}
            height= {canvasHeight}
            width= {canvasWidth}
          />
        </div>
    </div>
  );
}
