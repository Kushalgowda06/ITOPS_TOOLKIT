import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Tooltip } from "@mui/material";

interface MetricPoint {
  Date: string;
  Value: number;
  Unit: string;
}

interface MetricsData {
  [metricName: string]: MetricPoint[];
}

interface TableData {
  [key: string]: string | number;
}

interface ReusableBarChartProps {
  chartData: MetricsData;
  tableData?: TableData[] | null;
  width?: number;
  height?: number;
  margin?: string;
}

const ChatInBarChart: React.FC<ReusableBarChartProps> = ({
  chartData,
  tableData,
  width = 320,
  height = 240,
  margin = "10px"
  
}) => {
  // Format large numbers for better readability
  const formatValue = (value: number) => {
    if (value >= 1000000000) return `${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  // Capitalize first letter helper function
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Format column names for display (remove underscores and capitalize)
  const formatColumnName = (columnName: string) => {
    return columnName
      .replace(/_/g, ' ') // Replace underscores with spaces
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Format dates for better x-axis display
  const formatDateForAxis = (value: string) => {
    try {

      if (value.includes(' to ')) {
        const [startDate, endDate] = value.split(' to ');
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
          const startMonth = start.toLocaleDateString('en-US', { month: 'short' });
          const startDay = start.getDate();
          const endMonth = end.toLocaleDateString('en-US', { month: 'short' });
          const endDay = end.getDate();


          if (start.getMonth() === end.getMonth()) {
            return `${startMonth} ${startDay}-${endDay}`;
          }

          return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
        }
      }


      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
      }


      return value;
    } catch (error) {
      return value;
    }
  };

  const allMetrics = Object.keys(chartData || {});

  const groupedByUnit: Record<string, { metrics: string[], unit: string }> = {};

  allMetrics.forEach((metric) => {
    const dataPoints = Array.isArray(chartData[metric]) ? chartData[metric] : [];
    if (dataPoints.length > 0) {
      const unit = dataPoints[0]?.Unit || "Value";
      const unitKey = unit.toLowerCase();

      if (!groupedByUnit[unitKey]) {
        groupedByUnit[unitKey] = { metrics: [], unit };
      }
      groupedByUnit[unitKey].metrics.push(metric);
    }
  });

  return (
    <div>
      {/* Charts Section */}
      <div className="d-flex">
        {Object.entries(groupedByUnit).map(([unitKey, { metrics, unit }], index) => {
          const dataset: any[] = [];
          const dateMap = new Map<string, any>();

          metrics.forEach((metric) => {
            const dataPoints = chartData[metric] || [];
            dataPoints.forEach(({ Date, Value }) => {
              if (!dateMap.has(Date)) dateMap.set(Date, { Date });
              dateMap.get(Date)[metric] = Value;
            });
          });

          dataset.push(...Array.from(dateMap.values()));

          const hasData = dataset.some((d) =>
            metrics.some((metric) => d[metric] && d[metric] !== 0)
          );

          if (!hasData) return null;

          // const colors = [
          //   "#1e3a8a", "#3b82f6", "#60a5fa", "#93c5fd",
          //   "#1d4ed8", "#2563eb", "#6b7280", "#9ca3af"
          // ];

//           const colors = [
//   "#d4d4d8", // Soft silver gray
//   "#a1a1aa", // Muted stone
//   "#f4f4f5", // Off-white
//   "#e5e7eb", // Light ash
//   "#cbd5e1", // Cool mist
//   "#f3f4f6", // Pale slate
//   "#e2e8f0", // Frosted blue-gray
//   "#f8fafc"  // Gentle cloud
// ];
const colors = [
  "#e0e7ff", // Soft periwinkle (cool tone)
  "#fef3c7", // Pale gold (warm tone)
  "#cbd5e1", // Misty blue-gray (neutral)
  "#fde68a", // Light amber (warm tone)
  "#d1d5db", // Stone gray (neutral)
  "#fbcfe8", // Blush pink (warm tone)
  "#a5b4fc", // Lavender blue (cool tone)
  "#f5f5f5"  // Clean white (neutral)
];
          const series = metrics.map((metric, i) => ({
            dataKey: metric,
            label: metric,
            color: colors[i % colors.length]
          }));

          return (
            <div key={index} className="m-2" style={{ width, height: height }}>
              {/* Chart with legends */}
              <div style={{ position: 'relative' }}>
                <BarChart
                  dataset={dataset}
                  xAxis={[
                    {
                      scaleType: "band",
                      dataKey: "Date",
                      tickLabelStyle: { fontSize: 9 , fill: "#ffffff"},
                      //  axisLine: { stroke: "#ffffff" }, // white axis line
                      //  tickLine: { stroke: "#ffffff" }, 
                      valueFormatter: formatDateForAxis,
                    },
                  ]}
                  yAxis={[
                    {
                      tickLabelStyle: { display: 'none' },
                      valueFormatter: formatValue,
                    },
                  ]}
                  series={series}
                  width={width}
                  height={height}
                  slotProps={{
                    legend: {
                      direction: "row",
                      position: { vertical: "top", horizontal: "middle" },
                      itemMarkWidth: 12,
                      itemMarkHeight: 12,
                      markGap: 6,
                      itemGap: 10,
                      labelStyle: { fontSize: 12,  fill: "#ffffff"  },
                    },
                  }}
                />

                {/* Unit Label Under Legends */}
                <div
                  className="d-flex justify-content-end"
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    fontSize:"12px",
                  }}
                >
                  <div className="px-2">
                    <span className="small fw-medium text-white">
                      Unit: <span className="text-white ">{unit}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        }).filter(Boolean)}
      </div>

      {/* Table Section */}
      {tableData && tableData.length > 0 && (
        <div className="mt-4 overflow-auto w-100 rounded border table-custom-container">
          <table className="table table-bordered w-100  rounded mb-0 table-striped-custom table-equal-columns">
            <thead>
              <tr className="table-header-primary">
                {Object.keys(tableData[0]).map((column, index) => (
                  <th key={index} className="px-2 py-2 fw-semibold text-center text-uppercase ">
                    {formatColumnName(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.entries(row).map(([key, cell], cellIndex) => {
                    const renderCellContent = (value: any) => {
                      if (value === null || value === undefined) {
                        return <span className="text-white fst-italic">N/A</span>;
                      }

                      if (typeof value === 'object') {
                        const objectString = Object.entries(value).map(([k, v]) => `${k}: ${v}`).join('\n');
                        return (
                          <Tooltip
                            title={capitalizeFirstLetter(objectString)}
                            placement="top"
                            arrow
                            followCursor
                            PopperProps={{
                              className: "high-z-index",
                            }}
                          >
                            <div className="object-content-small">
                              {Object.entries(value).map(([k, v], idx) => (
                                <div key={idx} className="object-item-spacing">
                                  <span className="object-key-style">{k}:</span>{' '}
                                  <span className="object-value-style">{String(v)}</span>
                                </div>
                              ))}
                            </div>
                          </Tooltip>
                        );
                      }

                      const stringValue = key.toLowerCase().includes('cost') && typeof value === 'string' && !String(value).includes('$')
                        ? `$${value}`
                        : String(value);

                      if (stringValue.length > 45) {
                        return (
                          <Tooltip
                            title={capitalizeFirstLetter(stringValue)}
                            placement="top"
                            arrow
                            followCursor
                            PopperProps={{
                              className: "high-z-index",
                            }}
                          >
                            <span>
                              {stringValue.substring(0, 45)}
                              {stringValue.length > 45 ? "..." : ""}
                            </span>
                          </Tooltip>
                        );
                      }

                      return stringValue;
                    };

                    return (
                      <td key={cellIndex} className="px-2 py-2 text-center small text-white">
                        {renderCellContent(cell)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ChatInBarChart; 