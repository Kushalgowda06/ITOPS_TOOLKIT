import { Chart as ChartJs, Tooltip, Title, ArcElement, Legend, Chart, ChartData, ChartDataset } from "chart.js";
import { useEffect, useRef, useState } from "react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut } from "react-chartjs-2";
import { Api } from "../../Utilities/api";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useNavigate } from "react-router-dom";
import { setPatchData } from "../PatchingSlice/PatchingSlice";

ChartJs.register(Tooltip, Title, ArcElement, Legend, ChartDataLabels);

interface DoughnutChartDataset extends ChartDataset<'doughnut', number[]> {
  backgroundColor: (string | CanvasGradient)[];
  borderWidth?: number;
  hoverOffset?: number;
  circumference?: number;
  rotation?: number;
  datalabels?: any;
}

interface DoughnutChartData extends ChartData<'doughnut', number[], string> {
  datasets: DoughnutChartDataset[];
}

export const PatchingStatus = () => {
  const navigate = useNavigate();
  const screen = window.outerWidth;
  const [patchDataLocal, setPatchDataLocal] = useState([]);
  const chartRef = useRef<Chart<"doughnut", number[], string> | null>(null);
  const dispatch = useAppDispatch();
  const [plottingData, setPlottingData] = useState({
    patched: 0,
    unPatched: 0,
  });
  const [data, setData] = useState<DoughnutChartData>({
    labels: ["Unpatched", "patched"],
    datasets: [
      {
        label: "Patching Status",
        data: [0, 0], // Initialize with zeros
        backgroundColor: ["#eee3f2", "#B600BA"], // Static colors for initial render
        borderWidth: 1,
        hoverOffset: 4,
        circumference: 360,
        rotation: -270,
        datalabels: {
          color: ["#B600BA", "#fff"],
          display: true,
          font: function (context) {
            var width = context.chart.width;
            var size = Math.round(width / 22);
            return {
              weight: "bold",
              size: size,
            };
          },
        },
      },
    ],
  });

  useEffect(() => {
    Api.getData(
      "http://ec2-3-97-232-96.ca-central-1.compute.amazonaws.com:8000/patch_dashboard/"
    ).then((res: any) => {
      dispatch(setPatchData(res));
      setPatchDataLocal(res);

      let temp = { patched: 0, unPatched: 0 };
      res.forEach((element) => {
        if (element?.AvailablePatches?.length) {
          temp.unPatched = temp.unPatched + 1;
        } else {
          temp.patched = temp.patched + 1;
        }
      });
      setPlottingData(temp);
      setData((prevData) => ({
        ...prevData,
        datasets: [
          {
            ...prevData.datasets[0],
            data: [temp.unPatched, temp.patched], // Update data with fetched values
          },
        ],
      }));
    }).catch(error => {
      console.error("API Error:", error); // Log any API errors
    });
  }, [dispatch]);

  useEffect(() => {
    const chartInstance = chartRef.current;
    if (chartInstance) {
      const canvas = chartInstance.canvas;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) {
        const awsGradient = ctx.createLinearGradient(0, 0, 0, 180);
        awsGradient.addColorStop(0, "#2D2D8F");
        awsGradient.addColorStop(0.7, "rgba(182, 0, 186, 0.5)");
        awsGradient.addColorStop(1, "#21FCEB");
        setData((prevData) => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              backgroundColor: ["#eee3f2", awsGradient], // Apply gradient after data is fetched
            },
          ],
        }));
      }
    }
  }, [chartRef, plottingData]); // Re-run when plottingData updates

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
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#2D2D8F";
      // ctx.fillText(`${plottingData.patched + plottingData.unPatched}`, width / 2, height / 2);
      ctx.restore();
    },
    legend: {
      display: false,
    },
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: 30,
    plugins: { legend: { display: false } },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const clickedLabel = data.labels[elements[0].index];

        navigate({
          pathname: "/patchingstatus-details",
          search: `status=${clickedLabel}`,
        });
      }
    },
  };

  return (
    <div className="flex-column w-100 justify-content-center mb-3">
      <small className="d-flex fw-bold d-inline nav-font ">
        Patching Status
      </small>
  
      <Doughnut
        style={{ margin: "auto", height: '200px', width: '200px' }} // Added basic inline styles for visibility
        id="DoughnutChart"
        ref={chartRef}
        options={options}
        data={data}
        plugins={[plugins]}
        className="chart_height"
      />
    </div>
  );
};