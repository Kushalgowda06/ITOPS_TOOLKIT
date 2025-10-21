import { LineChart } from "@mui/x-charts/LineChart";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectFinopsData,
  setAwsDailyUsage,
  setAzureDailyUsage,
  setAzureForecast,
  setGcpDailyUsage,
} from "../FinOpsPage/FinOpsDataSlice";
import { filterData } from "../../Utilities/filterData";

const CostUsageChart = () => {
  const finopsSliceData = useAppSelector(selectFinopsData);
  const [itemLabel, setItemLabel] = React.useState<any>();
  const [itemDate, setItemDate] = React.useState<any>();
  const [itemNb, setItemNb] = React.useState(10);
  const [labelNb, setlablesNb] = React.useState(10);
  const [prevSelectedData, setPrevSelectedData] = React.useState(null);
  const dispatch = useAppDispatch();

  var finopsdailyfilterdata = [
    ...finopsSliceData.awsDailyUsage,
    ...finopsSliceData.gcpDailyUsage,
    ...finopsSliceData.azureDailyUsage,
  ];
  // var finopsforecastfilterdata = [
  //   ...finopsSliceData.azureForecast,
  //  //,...finopsSliceData.gcpForecast,
  //   // ...finopsSliceData.awsForecast
  // ];
  React.useEffect(() => {
    if (itemDate?.axisValue) {
      setPrevSelectedData(itemDate?.axisValue);
      if (itemDate?.axisValue === prevSelectedData) {
        dispatch(setAwsDailyUsage(finopsSliceData?.finopsawsDailyUsage));
        dispatch(setAzureDailyUsage(finopsSliceData?.finopsazureDailyUsage));
        dispatch(setGcpDailyUsage(finopsSliceData?.finopsgcpDailyUsage));
        // dispatch(setAzureForecast(finopsSliceData?.finopsazureForecast || []));
        setPrevSelectedData(null); // Reset selected value
      } else {
        const dailyfilter = finopsdailyfilterdata.filter(
          (item: any) => itemDate?.axisValue === item.Date
        );

        const categorizedData = filterData("Cloud", dailyfilter);
        if (itemLabel?.seriesId === "AWS") {
          dispatch(setAwsDailyUsage(categorizedData?.AWS || []));
          dispatch(setAzureDailyUsage([]));
          dispatch(setGcpDailyUsage([]));
        }
        if (itemLabel?.seriesId === "Azure") {
          dispatch(setAzureDailyUsage(categorizedData?.Azure || []));
          dispatch(setAwsDailyUsage([]));
          dispatch(setGcpDailyUsage([]));
        }
        if (itemLabel?.seriesId === "GCP") {
          dispatch(setGcpDailyUsage(categorizedData?.GCP || []));
          dispatch(setAwsDailyUsage([]));
          dispatch(setAzureDailyUsage([]));
        }
      }
    }
  }, [itemDate, itemLabel]);

  const azure = finopsSliceData?.azureDailyUsage?.reduce(
    (acc: any, entry: any) => {
      if (!acc[entry.Date]) {
        acc[entry.Date] = { AzureData: 0, Count: 0 };
      }
      acc[entry.Date].AzureData += Number(entry.Cost);
      acc[entry.Date].Count += 1;
      return acc;
    },
    {}
  );

  const aws = finopsSliceData?.awsDailyUsage?.reduce((acc: any, entry: any) => {
    if (!acc[entry.Date]) {
      acc[entry.Date] = { AwsData: 0, Count: 0 };
    }
    acc[entry.Date].AwsData += Number(entry.Aws);
    acc[entry.Date].Count += 1;
    return acc;
  }, {});

  const gcp = finopsSliceData?.gcpDailyUsage?.reduce((acc: any, entry: any) => {
    if (!acc[entry.Date]) {
      acc[entry.Date] = { GcpData: 0, Count: 0 };
    }
    acc[entry.Date].GcpData += Number(entry.Cost);
    acc[entry.Date].Count += 1;
    return acc;
  }, {});
  const azurelabels = Object.keys(azure);
  const awslabels = Object.keys(aws);
  const gcplabels = Object.keys(gcp);

  const finaldate = Array.from(
    new Set([...azurelabels, ...awslabels, ...gcplabels])
  );

  const seriesData = finaldate?.map((date: any) => {
    return {
      Azure: azure[date]?.AzureData || 0,
      Aws: aws[date]?.AwsData || 0,
      Gcp: gcp[date]?.GcpData || 0,
      month: date,
    };
  });

  const handleItemNbChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue !== "number") {
      return;
    }
    setItemNb(newValue);
    setlablesNb(newValue);
  };
  const highlightScope = {
    highlighted: "series",
    faded: "global",
  } as const;
  const series = [
    {
      id: "Azure",
      data: seriesData?.map((data: any) => data.Azure),
      label: "Azure Cost",
      color: "#3780FA",
    },
    {
      id: "AWS",
      data: seriesData?.map((data: any) => data.Aws),
      label: "AWS Cost",
      color: "#FF7B35",
    },
    {
      id: "GCP",
      data: seriesData?.map((data: any) => data.Gcp),
      label: "GCP Cost",
      color: "#00CE37",
    },
  ].map((s) => ({ ...s, highlightScope }));
  const modifiedSeries = series.map((s, index) => ({
    ...s,
    data: s.data.slice(0, itemNb),
  }));
  const lineChartsParams = {
    series: modifiedSeries,
    xAxis: [{ scaleType: "point", dataKey: "month" }],
  };

  return (
    <Box sx={{ width: "100%" }}>
      <small className="fw-bold nav-font ">Cost Usage</small>
      <LineChart
        {...(lineChartsParams as any)}
        dataset={seriesData.slice(0, itemNb)}
        // className="hshs"
        width={390}
        height={310}
        margin={{ left: 50, bottom: 20 }}
        slotProps={{
          legend: {
            itemMarkWidth: 11,
            itemMarkHeight: 11,
            itemGap: 25,
            padding: 1,
            labelStyle: {
              fontSize: 14,
              fontFamily: "GelixRegular",
            },
          },
        }}
        onMarkClick={(event, d: any) => setItemLabel(d)} //data
        onAxisClick={(event, d: any) => setItemDate(d)} //data
      />
      <Box sx={{ width: 350 }}>
        <Slider
          sx={{ pt: 0, marginLeft: 1 }}
          value={itemNb}
          size="small"
          onChange={handleItemNbChange}
          valueLabelDisplay="auto"
          max={finaldate.length}
          min={1}
          aria-labelledby="input-item-number"
        />
      </Box>
    </Box>
  );
};

export default CostUsageChart;
