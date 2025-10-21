import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import { useAxiosFetch } from "../../../hooks/useAxiosFetch";
import { ApiResponse, PatchDashboardData } from "../../../Typess/Typess";
import StatusBarsTable from "./StatusBarsTable";

const StatusBar = () => {
  const { data: apiResponse1, loading: loading1, error: error1 } = useAxiosFetch<ApiResponse>(
    'http://ec2-3-97-232-96.ca-central-1.compute.amazonaws.com:8006/reports/'
  );

  const { data: apiResponse2, loading: loading2, error: error2 } = useAxiosFetch<ApiResponse>(
    'http://ec2-3-97-232-96.ca-central-1.compute.amazonaws.com:8000/patch_dashboard/'
  );

  const [resourceNamesByApplication, setResourceNamesByApplication] = useState<{ [key: string]: { resources: string[]; total: number } }>({});
  const [scheduledPercentages, setScheduledPercentages] = useState<{ [key: string]: number }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<PatchDashboardData[] | null>(null);

  useEffect(() => {
    if (apiResponse1 && Array.isArray(apiResponse1.data)) {
      const items: PatchDashboardData[] = apiResponse1.data;
      const uniqueApplications = Array.from(new Set(items.map((item) => item.Application)));
      const resourceNames = uniqueApplications.reduce((acc, application) => {
        const resources = items
          .filter((item) => item.Application === application)
          .map((item) => item.ResourceName);
        acc[application] = {
          resources,
          total: resources.length,
        };
        return acc;
      }, {} as { [key: string]: { resources: string[]; total: number } });

      setResourceNamesByApplication(resourceNames);
    }
  }, [apiResponse1]);

  useEffect(() => {
    if (apiResponse2 && resourceNamesByApplication && Array.isArray(apiResponse2.data)) {
      const demo = Object.entries(resourceNamesByApplication);

      const percentages = demo.reduce((acc, [application, { resources, total }]) => {
        const filteredItems = apiResponse2.data.filter((item) => resources.includes(item.ServerName));
        const scheduledCount = filteredItems.filter((item) => item.AvailablePatches).length;
        const percentage = total > 0 ? (scheduledCount / total) * 100 : 0;
        acc[application] = percentage;
        return acc;
      }, {} as { [key: string]: number });

      setScheduledPercentages(percentages);
    }
  }, [apiResponse2, resourceNamesByApplication]);

  if (loading1 || loading2) {
    return <div>Loading...</div>;
  }

  if (error1 || error2) {
    return <div>Error loading data.</div>;
  }

  const handleBarClick = (elements: any[]) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const application = Object.keys(scheduledPercentages)[index];
      if (application && apiResponse2 && Array.isArray(apiResponse2.data)) {
        const data = apiResponse2.data.filter((item) => resourceNamesByApplication[application]?.resources.includes(item.ServerName));
        setModalData(data);
        setModalOpen(true);
      }
    }
  };

  const data = {
    labels: Object.keys(scheduledPercentages),
    datasets: [
      {
        label: 'Scheduled Patches (%)',
        data: Object.values(scheduledPercentages),
        backgroundColor: ['#00CE37', '#3780FA', '#FF7B35'],
        borderColor: ['#00CE37', '#3780FA', '#FF7B35'],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        grid: {
          display: false,
        },
        title: {
          display: false,
          text: 'Percentage',
        },
        // ticks: {
        //   callback: function (value) {
        //     if (value === 20 || value === 40 || value === 60 || value === 80 || value === 100) {
        //       return value;
        //     }
        //     return ''; // Return an empty string for other values
        //   },
        // },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
        },
        title: {
          display: false,
          text: 'Applications',
        },
      },
    },
    onClick: (event, elements) => handleBarClick(elements),
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.x !== null) {
              label += context.parsed.x.toFixed(2) + '%';
            }
            return label;
          }
        }
      },
      datalabels: {
        display: false,
      },
    },
    elements: {
      bar: {
        borderRadius: 5,
      },
    },
  };
  console.log("modalData", modalData)
  return (
    <div style={{ width: '100%', overflowY: 'auto', height: "234px" }}> {/* Added horizontal scroll */}
      <div style={{ minWidth: '600px', height: '400px' }}> {/* Ensure minimum width for scroll */}
        <Bar data={data} options={options} />
      </div>
      <StatusBarsTable open={modalOpen} handleClose={() => setModalOpen(false)} data={modalData} />
    </div>
  );
};

export default StatusBar;
