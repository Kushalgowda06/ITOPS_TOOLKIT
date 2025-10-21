import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { BarChart, BarPlot } from "@mui/x-charts/BarChart";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectFinopsData,
  setAwsDailyUsage,
  setAwsForecast,
  setAzureDailyUsage,
  setAzureForecast,
  setGcpDailyUsage,
  setGcpForecast,
} from "../FinOpsPage/FinOpsDataSlice";
import { filterData } from "../../Utilities/filterData";
import { Button, Container, Paper, Stack } from "@mui/material";
import { LinePlot, MarkPlot } from "@mui/x-charts/LineChart";
import { ChartsXAxis } from "@mui/x-charts/ChartsXAxis";
import { ResponsiveChartContainer } from "@mui/x-charts/ResponsiveChartContainer";
import { ChartContainer } from "@mui/x-charts/ChartContainer";
import { ChartsTooltip } from "@mui/x-charts/ChartsTooltip";
import { ChartsYAxis } from "@mui/x-charts/ChartsYAxis";
import { ChartsOnAxisClickHandler } from "@mui/x-charts/ChartsOnAxisClickHandler";
import { ChartsReferenceLine } from '@mui/x-charts/ChartsReferenceLine';
const ActualBudgetForecastChart = () => {
  const finopsSliceData = useAppSelector(selectFinopsData);
  const [baritemData, setBarItemData] = React.useState<any>();
  const [lineitemData, setLineItemData] = React.useState<any>();
  const [axisData, setAxisData] = React.useState<any>();
  const [prevSelectedData, setPrevSelectedData] = React.useState(null);
  const [selected, setSelected] = useState("All");
  const dispatch = useAppDispatch();
  var finopsdailyfilterdata = [
    ...finopsSliceData.awsDailyUsage,
    ...finopsSliceData.gcpDailyUsage,
    ...finopsSliceData.azureDailyUsage,
  ];
  var finopsforecastfilterdata = [
    ...finopsSliceData.azureForecast,
    ...finopsSliceData.gcpForecast,
    ...finopsSliceData.awsForecast,
  ];

  function getLastDateOfMonth(monthYearString) {
    const [month, year] = monthYearString.split(" ");

    const monthMap = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };
    if (!monthMap.hasOwnProperty(month) || isNaN(year)) {
      return null; // Or throw an error if you prefer
    }

    const monthInt = monthMap[month]; // Get numerical month from map

    // Create a Date object with the year and adjusted month
    const date = new Date(year, monthInt, 1); // Set day to 1

    // Set the day to 0 (last day of the previous month)
    date.setDate(0);

    // Return only the day of the month as a string
    return date.getDate().toString();
  }

  const parseLabelToDate = (label) => {
    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };
    const [monthLabel, year] = label.split(" ");
    const month = months[monthLabel];
    return `${year}-${month}`;
  };
  React.useEffect(() => {
    if (axisData?.axisValue) {
      setPrevSelectedData(axisData?.axisValue);
      if (axisData?.axisValue === prevSelectedData) {
        dispatch(setAwsDailyUsage(finopsSliceData?.finopsawsDailyUsage));
        dispatch(setAzureDailyUsage(finopsSliceData?.finopsazureDailyUsage));
        dispatch(setGcpDailyUsage(finopsSliceData?.finopsgcpDailyUsage));
        dispatch(setAzureForecast(finopsSliceData?.finopsazureForecast));
        dispatch(setAwsForecast(finopsSliceData?.finopsawsForecast));
        dispatch(setGcpForecast(finopsSliceData?.finopsgcpForecast));
        setPrevSelectedData(null); // Reset selected value
      } else {
        const dateFromLabel = parseLabelToDate(axisData?.axisValue);
        const filterDataByLabel1 = finopsdailyfilterdata.filter((item: any) =>
          item?.Date.startsWith(dateFromLabel)
        );
        const filterDataByLabel2 = finopsforecastfilterdata.filter(
          (item: any) => item?.Date?.startsWith(dateFromLabel)
        );
        var categorizedData1 = filterData("Cloud", filterDataByLabel1);
        var categorizedData2 = filterData("Cloud", filterDataByLabel2);
        //removing actuals
        const AwsActual = categorizedData1?.AWS?.map(
          ({ Aws, ...rest }) => rest
        );
        const AzureActual = categorizedData1?.Azure?.map(
          ({ Cost, ...rest }) => rest
        );
        const GcpActual = categorizedData1?.GCP?.map(
          ({ Cost, ...rest }) => rest
        );
        //removing budget
        const AwsBudget = categorizedData1?.AWS?.map(
          ({ DailyBudget, ...rest }) => rest
        );
        const AzureBudget = categorizedData1?.Azure?.map(
          ({ Budget, ...rest }) => rest
        );
        const GcpBudget = categorizedData1?.GCP?.map(
          ({ Budget_static, ...rest }) => rest
        );
        if (baritemData?.seriesId === "AWS-Actual") {
          dispatch(setAwsDailyUsage(AwsBudget));
          dispatch(setAzureDailyUsage([]));
          dispatch(setGcpDailyUsage([]));
          dispatch(setAzureForecast([]));
          dispatch(setAwsForecast([]));
          dispatch(setGcpForecast([]));
        } else if (baritemData?.seriesId === "Azure-Actual") {
          dispatch(setAwsDailyUsage([]));
          dispatch(setAzureDailyUsage(AzureBudget));
          dispatch(setGcpDailyUsage([]));
          dispatch(setAzureForecast([]));
          dispatch(setAwsForecast([]));
          dispatch(setGcpForecast([]));
        } else if (baritemData?.seriesId === "GCP-Actual") {
          dispatch(setAwsDailyUsage([]));
          dispatch(setAzureDailyUsage([]));
          dispatch(setGcpDailyUsage(GcpBudget));
          dispatch(setAzureForecast([]));
          dispatch(setAwsForecast([]));
          dispatch(setGcpForecast([]));
        } else if (baritemData?.seriesId === "AWS-Forecast") {
          dispatch(setAwsForecast(categorizedData2?.AWS || []));
          dispatch(setAzureDailyUsage([]));
          dispatch(setGcpDailyUsage([]));
          dispatch(setAwsDailyUsage([]));
          dispatch(setAzureForecast([]));
          dispatch(setGcpForecast([]));
        } else if (baritemData?.seriesId === "Azure-Forecast") {
          dispatch(setAzureForecast(categorizedData2?.Azure || []));
          dispatch(setAzureDailyUsage([]));
          dispatch(setGcpDailyUsage([]));
          dispatch(setAwsDailyUsage([]));
          dispatch(setAwsForecast([]));
          dispatch(setGcpForecast([]));
        } else if (baritemData?.seriesId === "GCP-Forecast") {
          dispatch(setGcpForecast(categorizedData2?.GCP || []));
          dispatch(setAzureDailyUsage([]));
          dispatch(setGcpDailyUsage([]));
          dispatch(setAwsDailyUsage([]));
          dispatch(setAwsForecast([]));
          dispatch(setAzureForecast([]));
        } else if (lineitemData?.seriesId === "GCP-Budget") {
          dispatch(setAwsDailyUsage([]));
          dispatch(setAzureDailyUsage([]));
          dispatch(setGcpDailyUsage(GcpActual));
          dispatch(setAzureForecast([]));
          dispatch(setAwsForecast([]));
          dispatch(setGcpForecast([]));
        } else if (lineitemData?.seriesId === "AWS-Budget") {
          dispatch(setAwsDailyUsage(AwsActual));
          dispatch(setAzureDailyUsage([]));
          dispatch(setGcpDailyUsage([]));
          dispatch(setAzureForecast([]));
          dispatch(setAwsForecast([]));
          dispatch(setGcpForecast([]));
        } else if (lineitemData?.seriesId === "Azure-Budget") {
          dispatch(setAwsDailyUsage([]));
          dispatch(setAzureDailyUsage(AzureActual));
          dispatch(setGcpDailyUsage([]));
          dispatch(setAzureForecast([]));
          dispatch(setAwsForecast([]));
          dispatch(setGcpForecast([]));
        }
      }
    }
  }, [axisData?.axisValue, baritemData, lineitemData]);
  const awsdata = finopsSliceData?.awsDailyUsage.reduce(
    (acc: any, entry: any) => {
      const monthYear = moment(entry.Date).format("MMMM YYYY");
      if (!acc[monthYear]) {
        const lastdate: any = getLastDateOfMonth(monthYear);
        acc[monthYear] = {
          AwsTotal: 0,
          DailyBudgetTotal: parseInt(entry.DailyBudget) * lastdate,
          Count: 0,
        };
      }
      acc[monthYear].AwsTotal += parseInt(entry.Aws);
      // acc[monthYear].DailyBudgetTotal += parseInt(entry.DailyBudget); // for dummy kept as invoice
      acc[monthYear].Count += 1;
      return acc;
    },
    {}
  );

  const GCPData = finopsSliceData?.gcpDailyUsage.reduce(
    (acc: any, entry: any) => {
      const monthYear = moment(entry.Date).format("MMMM YYYY");
      if (!acc[monthYear]) {
        acc[monthYear] = {
          GCPTotal: 0,
          DailyBudgetTotal: parseInt(entry.Budget_static),
          Count: 0,
        };
      }
      acc[monthYear].GCPTotal += parseInt(entry.Cost);
      acc[monthYear].Count += 1;
      return acc;
    },
    {}
  );

  const azuredata = finopsSliceData?.azureDailyUsage.reduce(
    (acc: any, entry: any) => {
      const monthYear = moment(entry.Date).format("MMMM YYYY");
      if (!acc[monthYear]) {
        acc[monthYear] = {
          AzureTotal: 0,
          DailyBudgetTotal: entry.Budget_static,
          Count: 0,
        };
      }
      acc[monthYear].AzureTotal += entry.Cost;
      // acc[monthYear].DailyBudgetTotal += entry.Budget_static;
      acc[monthYear].Count += 1;
      return acc;
    },
    {}
  );

  const awsforecast = finopsSliceData?.awsForecast?.reduce(
    (acc: any, entry: any) => {
      const monthYear = moment(entry.Date).format("MMMM YYYY");
      if (!acc[monthYear]) {
        acc[monthYear] = { AwsForeCast: 0, Count: 0 };
      }
      if (typeof entry.Forecast === "number") {
        acc[monthYear].AwsForeCast += entry.Forecast;
      } else if (typeof entry.Forecast === "string") {
        acc[monthYear].AwsForeCast += parseInt(entry.Forecast);
      }
      acc[monthYear].Count += 1;
      return acc;
    },
    {}
  );
  const azureforecast = finopsSliceData?.azureForecast?.reduce(
    (acc: any, entry: any) => {
      const monthYear = moment(entry.Date).format("MMMM YYYY");
      if (!acc[monthYear]) {
        acc[monthYear] = { AzureForeCast: 0, Count: 0 };
      }
      acc[monthYear].AzureForeCast += parseInt(entry.Cost_inr);
      acc[monthYear].Count += 1;
      return acc;
    },
    {}
  );
  const gcpforecast = finopsSliceData?.gcpForecast?.reduce(
    (acc: any, entry: any) => {
      const monthYear = moment(entry.Date).format("MMMM YYYY");
      if (!acc[monthYear]) {
        acc[monthYear] = { GcpForeCast: 0, Count: 0 };
      }
      acc[monthYear].GcpForeCast += parseInt(entry.Forecast);
      acc[monthYear].Count += 1;
      return acc;
    },
    {}
  );

  const azurelabels = Object.keys(azuredata);
  const awslabels = Object.keys(awsdata);
  const gcplabels = Object.keys(GCPData);
  const awsforecastlabels = Object.keys(awsforecast);
  const azureforecastlabels = Object.keys(azureforecast);
  const gcpforecastlabels = Object.keys(gcpforecast);

  var finaldate = [
    ...new Set([
      ...azurelabels,
      ...awslabels,
      ...gcplabels,
      ...awsforecastlabels,
      ...azureforecastlabels,
      ...gcpforecastlabels,
    ]),
  ];

  const seriesData = finaldate.map((monthYear) => {
    const date = new Date(monthYear);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();
    return {
      azureForecast: azureforecast[monthYear]?.AzureForeCast || 0,
      awsForecast: awsforecast[monthYear]?.AwsForeCast || 0,
      gcpForecast: gcpforecast[monthYear]?.GcpForeCast || 0,
      azureDailyBudgetTotal: azuredata[monthYear]?.DailyBudgetTotal || 0,
      azureTotal: azuredata[monthYear]?.AzureTotal || 0,
      awsDailyBudgetTotal: awsdata[monthYear]?.DailyBudgetTotal || 0,
      gcpDailyBudgetTotal: GCPData[monthYear]?.DailyBudgetTotal || 0,
      awsTotal: awsdata[monthYear]?.AwsTotal || 0,
      GCPTotal: GCPData[monthYear]?.GCPTotal || 0,
      month: `${month} ${year}`,
    };
  });
  const [seriesNb, setSeriesNb] = useState(9);
  const [itemNb, setItemNb] = useState(3);

  const handleItemNbChange = (event, newValue) => {
    setItemNb(newValue);
  };

  const handleSeriesNbChange = (event, newValue) => {
    setSeriesNb(newValue);
  };

  const highlightScope = {
    highlighted: "series",
    faded: "global",
  } as const;
  let seriesjson = [
    {
      id: "Azure-Actual",
      data: seriesData.map((data) => data.azureTotal),
      label: "Azure\nActual",
      type: "bar",
      // yAxisKey: "rightAxis",
    },
    {
      id: "GCP-Actual",
      data: seriesData.map((data) => data.GCPTotal),
      label: "GCP\nActual",
      type: "bar",
      // yAxisKey: "rightAxis",
    },
    {
      id: "AWS-Actual",
      data: seriesData.map((data) => data.awsTotal),
      label: "AWS\nActual",
      type: "bar",
      // yAxisKey: "rightAxis",
    },
    // {
    //   id: "AWS-Budget",
    //   data: seriesData.map((data) => data?.awsDailyBudgetTotal),
    //   label: "AWS\nBudget",
    //   type: "line",
    //   //  yAxisKey: 'rightAxis'
    // },
    // {
    //   id: "Azure-Budget",
    //   data: seriesData.map((data) => data.azureDailyBudgetTotal),
    //   label: "Azure\nBudget",
    //   type: "line",
    //   //yAxisKey: 'rightAxis'
    // },
    // {
    //   id: "GCP-Budget",
    //   data: seriesData.map((data) => data.gcpDailyBudgetTotal),
    //   label: "GCP\nBudget",
    //   type: "line",
    //   // yAxisKey: 'rightAxis'
    // },
    {
      id: "AWS-Forecast",
      data: seriesData.map((data) => data.awsForecast),
      type: "line",
      label: "AWS\nForecast",
      // yAxisKey: "rightAxis",
    },
    {
      id: "Azure-Forecast",
      data: seriesData.map((data) => data.azureForecast),
      label: "Azure\nForecast",
      type: "line",
      // yAxisKey: "rightAxis",
    },
    {
      id: "GCP-Forecast",
      data: seriesData.map((data) => data.gcpForecast),
      label: "GCP\nForecast",
      type: "line",
      // yAxisKey: "rightAxis",
    },
  ].map((s) => ({ ...s, highlightScope }));


  const modifiedSeries = seriesjson.slice(0, seriesNb).map((s, index) => ({
    ...s,
    data: s.data.slice(0, itemNb),
  }));

  const Container = ResponsiveChartContainer;

  return (
    <Box sx={{ width: "100%", fontFamily: "GelixRegular" }}>
      <small className="fw-bold nav-font ">Actual & Budget Vs Forecast</small>
      <Paper sx={{ width: "100%", height: 310 }} elevation={0}>
        {/* @ts-ignore */}
        <Container
          series={modifiedSeries as any}
          xAxis={[
            {
              scaleType: "band",
              dataKey: "month",
              id: "x-axis-id",
            },
          ]}
          yAxis={[
            { id: "leftAxis" },
            //  ,{ id: "rightAxis" }
          ]}
          dataset={seriesData.slice(0, itemNb)}
          height={310}
          width={360}
          margin={{ right: 0, bottom: 20, left: 80, top: 10 }}
          sx={{
            // "& .MuiMarkElement-series-GCP-Budget": {
             
            //   stroke: "#00CE37",
            // },
            // "& .MuiLineElement-series-GCP-Budget": {
             
            //   stroke: "#00CE37",
            // },
            // "& .MuiMarkElement-series-Azure-Budget": {
             
            //   stroke: "#3780FA",
            // },
            // "& .MuiLineElement-series-Azure-Budget": {
             
            //   stroke: "#3780FA",
            // },
            // "& .MuiMarkElement-series-AWS-Budget": {
             
            //   stroke: "#FF7B35",
            // },
            // "& .MuiLineElement-series-AWS-Budget": {
            
            //   stroke: "#FF7B35",
            // },
            "& .MuiLineElement-series-GCP-Forecast": {
              strokeDasharray: '5, 5' ,
              stroke: "#00CE37",
              strokeLinejoin: "round",
            },
            "& .MuiMarkElement-series-GCP-Forecast": {
            
              stroke: "#00CE37",
            },
            "& .MuiLineElement-series-Azure-Forecast": {
              strokeDasharray: '5, 5' ,
              stroke: "#3780FA",
              strokeLinejoin: "round",
            },
            "& .MuiMarkElement-series-Azure-Forecast": {
            
              stroke: "#3780FA",
            },
            "& .MuiLineElement-series-AWS-Forecast": {
              strokeDasharray: '5, 5' ,
              stroke: "#FF7B35",
              strokeLinejoin: "round",
            },
            "& .MuiMarkElement-series-AWS-Forecast": {
            
              stroke: "#FF7B35",
            },
            "& .MuiBarElement-series-Azure-Actual": {
              fill: "url(#Azure-Actual-gradient)",
            },
            "& .MuiBarElement-series-AWS-Actual": {
              fill: "url(#AWS-Actual-gradient)",
            },
            "& .MuiBarElement-series-GCP-Actual": {
              fill: "url(#GCP-Actual-gradient)",
            },
          }}
        >
          {" "}
          <defs>
            {/* <linearGradient id="GCP-Forecast-gradient" x2="0" y2="1">
              <stop offset="0%" stop-color="#066206" />
              <stop offset="18%" stop-color="#00E967" />
            </linearGradient> */}
            <linearGradient id="Azure-Forecast-gradient" x2="0" y2="1">
              <stop offset="0%" stop-color="#052966" />
              <stop offset="18%" stop-color="#2C9CE3" />
            </linearGradient>
            <linearGradient id="AWS-Forecast-gradient" x2="0" y2="1">
              <stop offset="0%" stop-color="#7a3612" />
              <stop offset="18%" stop-color="#FA880F" />
            </linearGradient>
            <linearGradient id="Azure-Actual-gradient" x2="0" y2="1">
              <stop offset="0%" stop-color="#052966" />
              <stop offset="18%" stop-color="#2C9CE3" />
            </linearGradient>
            <linearGradient id="AWS-Actual-gradient" x2="0" y2="1">
              <stop offset="0%" stop-color="#7a3612" />
              <stop offset="18%" stop-color="#FA880F" />
            </linearGradient>
            <linearGradient id="GCP-Actual-gradient" x2="0" y2="1">
              <stop offset="0%" stop-color="#066206" />
              <stop offset="18%" stop-color="#00E967" />
            </linearGradient>
          </defs>
          <BarPlot onItemClick={(event, d: any) => setBarItemData(d)} />
          <LinePlot  />
          <MarkPlot onItemClick={(event, d: any) => setLineItemData(d)} />
          <ChartsXAxis label="X axis" position="bottom" axisId="x-axis-id" />
          <ChartsYAxis axisId="leftAxis" />
          <ChartsTooltip trigger="item" />
          <ChartsOnAxisClickHandler
            onAxisClick={(event, d: any) => setAxisData(d)}
          />
            <ChartsReferenceLine y={50000}  lineStyle={{ stroke: 'green', strokeWidth:2 }} />
            <ChartsReferenceLine y={200000} lineStyle={{ stroke: 'blue', strokeWidth:2 }} />
            <ChartsReferenceLine y={210000} lineStyle={{ stroke: 'orange', strokeWidth:2 }} />
        </Container>
      </Paper>
      <Box sx={{ width: 300 }}>
        <Slider
          sx={{ pt: 0, paddingLeft: 4 }}
          value={itemNb}
          size="small"
          onChange={handleItemNbChange}
          valueLabelDisplay="auto"
          min={1}
          max={finaldate.length}
          aria-labelledby="input-item-number"
        />
      </Box>
    </Box>
  );
};

export default ActualBudgetForecastChart;
