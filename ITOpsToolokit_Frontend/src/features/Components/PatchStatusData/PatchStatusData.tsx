import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { useAxiosFetch } from '../../../hooks/useAxiosFetch';
import Tooltip from '@mui/material/Tooltip';
import Tableedit from "../Table/Tableedit";
import Tile from "../Tiles/Tile";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

interface PatchStatusDataItem {
  _id: string;
  Provider: string;
  OS: string;
  CRNumber: string;
  CRSysID: string;
  Servers: string;
  ResourceName: string;
  PatchGroup: string;
  Environment: string;
  CRStatus: string;
  PatchStartDate: string;
  PatchEndDate: string;
  ScanDate: string;
}

interface ApiResponse {
  data: PatchStatusDataItem[];
  code: number;
  message: string;
}

const PatchStatusTable = () => {
  const { data: apiResponse, loading, error } = useAxiosFetch<ApiResponse>(
    'http://ec2-3-97-232-96.ca-central-1.compute.amazonaws.com:8000/scheduler/'
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!apiResponse?.data) {
    return <div>No data available</div>;
  }

  return (
        <Tableedit customData={apiResponse?.data} apiUrl={null} />
  );
};

export default PatchStatusTable;