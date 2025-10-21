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
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Barchart() {
  const cloudData = useAppSelector(selectCommonConfig);
  const navigate = useNavigate();
  const options = {
    responsive: true,
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
  };

  const findCloud = (ResourceType: string) => {
    let cloudVar: string = "";
    cloudData.cloudData.forEach((currElem: any, index: number) => {
      if (ResourceType === currElem.ResourceType) {
        cloudVar = currElem.Cloud;
      }
    });
    return cloudVar;
  };

  let cloudResourceTypes = findOcc(cloudData.cloudData, "ResourceType");

  const labels = cloudResourceTypes.map(
    (currelem: any) => currelem.ResourceType
  );

  const barChartDataValues = cloudResourceTypes.map(
    (currElem: any) => currElem.untagged
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Top 10 untagged.",
        data: barChartDataValues,
        backgroundColor: (color: any) => {
          let cloudType: string = findCloud(labels[color.dataIndex]);
          let colors =
            "AWS" === cloudType
              ? "#FF7B35"
              : "GCP" === cloudType
              ? "#00CE37"
              : "#3780FA";
          return colors;
        },
      },
    ],
  };
  return (
    <div className="d-flex flex-column w-100">
      <small className="fw-bold">Top 10 Un-Tagged</small>
      <div className="d-flex w-100">
        <div className="barchartWidth">
          <Bar options={options} data={data} />
        </div>
      </div>
    </div>
  );
}
