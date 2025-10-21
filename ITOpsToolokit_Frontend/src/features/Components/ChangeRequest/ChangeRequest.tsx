import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useAxiosFetch } from '../../../hooks/useAxiosFetch';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TableDataItem {
  _id: string;
  ResourceName: string;
  Provide: string;
  CRNumber: string;
  Servers: string;
  PatchStartDate: string;
  Environment: string;
}

interface ApiResponse {
  data: TableDataItem[];
  code: number;
  message: string;
}

const ChangeRequest = () => {
  const { data: apiResponse, loading, error } = useAxiosFetch<ApiResponse>(
    'http://ec2-3-97-232-96.ca-central-1.compute.amazonaws.com:8000/scheduler/'
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!apiResponse || !apiResponse.data) {
    return <div>No data available</div>;
  }

  return (
    <div className="table-responsive" style={{ maxHeight: '235px', overflowY: 'auto', fontSize: '12px' }}>
      <table className="table table-borderless">
        <tbody>
          {apiResponse.data.map((row) => (
            <tr key={row._id}>
              <td>
                <div className="d-flex flex-column">
                  <div className="d-flex justify-content-between">
                    <span className="text-primary"><strong>{row.CRNumber}</strong></span>    
                    <span className="text-primary justify-content-center">{row.PatchStartDate}</span>    
                    <span className="text-primary">{row.Environment}</span>
                  </div>
                  <div className="text-primary">
                    <span>{row.Servers}</span>            |      
                    <span>{row.ResourceName}</span>
                  </div>
                </div>
                
                
              </td>
              
            </tr>
            
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChangeRequest;
