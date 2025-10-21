import React, { useRef, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAxiosFetch } from '../../../hooks/useAxiosFetch';
import { ApiResponse } from '../../../Typess/Typess';
import { Modal, Button } from 'react-bootstrap';
import CrStatusData from './CrStatusData'; // Adjust the import path as needed

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PatchStatusBar: React.FC = () => {
  const chartRef = useRef<any>(null);
  const { data: apiResponse, loading, error } = useAxiosFetch<ApiResponse>(
    'http://ec2-3-97-232-96.ca-central-1.compute.amazonaws.com:8000/scheduler/'
  );

  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [gradient, setGradient] = useState<string | CanvasGradient | null>(null);

  useEffect(() => {
    const chart = chartRef.current;
    if (chart && !gradient) {
      const ctx = chart.ctx;
      // const newGradient = ctx.createLinearGradient(0, 0, 0, 210);
      // newGradient.addColorStop(0, "#2D2D8F");
      // newGradient.addColorStop(0.7, "rgba(182, 0, 186, 0.5)");
      // newGradient.addColorStop(1, "#21FCEB");
      const newGradient =   ctx.createLinearGradient(0, 0, 0, 210);
      newGradient.addColorStop(0.2, "#2D2D8F ");
      newGradient.addColorStop(0.5, " rgba(182, 0, 186,0.74)");
      newGradient.addColorStop(0.7, "#21FCEB");

      setGradient(newGradient);
    }
  }, [apiResponse?.data]);

  // useEffect(() => {
  //   const chart = chartRef.current;
  //   if (chart && gradient) {
  //     chart.data.datasets.forEach((dataset: any) => {
  //       dataset.backgroundColor = gradient;
  //     });
  //     chart.update();
  //   }
  // }, [apiResponse, gradient]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!apiResponse || !apiResponse.data) {
    return <div>No data available</div>;
  }

  // Process the API response to get the data for the chart
  const statusCounts = {
    'CR Created': 0,
    'CAB': 0,
    'Scheduled': 0,
    'Completed': 0,
  };

  apiResponse.data.forEach((item) => {
    if (item.CRStatus === 'new') {
      statusCounts['CR Created'] += 1;
    } else if (item.CRStatus === 'Authorize') {
      statusCounts['CAB'] += 1;
    } else if (item.CRStatus === 'Scheduled') {
      statusCounts['Scheduled'] += 1;
    } else if (item.CRStatus === 'Closed') {
      statusCounts['Completed'] += 1;
    }
  });

  const statusBarsData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: gradient,
        barThickness: 27,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 9,
            padding: 5,
          },
        },
      },
      y: {
        stacked: true,
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
    layout: {
      padding: {
        left: 5,
        right: 5,
        top: 5,
        bottom: 20,
      },
    },
    onClick: (event: any, elements: any) => {
      if (elements.length > 0) {
        const { index } = elements[0];
        const status = Object.keys(statusCounts)[index];
        const filteredData = apiResponse.data.filter((item: any) => {
          if (status === 'CR Created' && item.CRStatus === 'new') return true;
          if (status === 'CAB' && item.CRStatus === 'Authorize') return true;
          if (status === 'Scheduled' && item.CRStatus === 'Scheduled') return true;
          if (status === 'Completed' && item.CRStatus === 'Closed') return true;
          return false;
        });
        setSelectedData(filteredData);
        setModalIsOpen(true);
      }
    },
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedData(null);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '250px', width: '500px' }}>
      { apiResponse?.data.length > 0 && 
        <Bar ref={chartRef} data={statusBarsData} options={chartOptions} />
      }
      <Modal show={modalIsOpen} onHide={closeModal} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>CR Status Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedData ? (
            <CrStatusData data={selectedData} />
          ) : (
            <div>No data available</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PatchStatusBar;
