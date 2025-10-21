import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { BarChart } from "@mui/x-charts/BarChart";
import { capitalizeFirstLetter } from "../../Utilities/capitalise";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
  selectFinopsData,
  setAwsDailyUsage,
  setAzureDailyUsage,
  setGcpDailyUsage,
} from "../FinOpsPage/FinOpsDataSlice";
import { filterData } from "../../Utilities/filterData";
export default function Top10BU() {
  const finopsSliceData = useAppSelector(selectFinopsData);
  const [itemNb, setItemNb] = React.useState(10);
  const [labelNb, setlablesNb] = React.useState(10);
  const [axisData, setAxisData] = React.useState<any>();
  const [prevSelectedData, setPrevSelectedData] = React.useState(null);
  const dispatch = useAppDispatch();
  var finopsdata = [
    ...finopsSliceData.awsDailyUsage,
    ...finopsSliceData.gcpDailyUsage,
    ...finopsSliceData.azureDailyUsage,
  ];

  React.useEffect(() => {
    if (axisData?.axisValue) {
      setPrevSelectedData(axisData?.axisValue);

      if (axisData?.axisValue === prevSelectedData) {
        dispatch(setAwsDailyUsage(finopsSliceData?.finopsawsDailyUsage));
        dispatch(setAzureDailyUsage(finopsSliceData?.finopsazureDailyUsage));
        dispatch(setGcpDailyUsage(finopsSliceData?.finopsgcpDailyUsage));
        setPrevSelectedData(null); // Reset selected value
      } else {
        const filteredData = finopsdata.filter(
          (item: any) =>
            item.BusinessUnit.toLowerCase() ===
            axisData?.axisValue.toLowerCase()
        );
        const categorizedData = filterData("Cloud", filteredData);
        dispatch(setAwsDailyUsage(categorizedData?.AWS || []));
        dispatch(setAzureDailyUsage(categorizedData?.Azure || []));
        dispatch(setGcpDailyUsage(categorizedData?.GCP || []));
      }
    }
  }, [axisData]);

  const counts = {};
  const costs = {};

  function processData(data: any[], BUkey: string, costKey: string) {
    for (const item of data) {
      const BU = item[BUkey];
      const cloud = item.Cloud;
      const cost =
        typeof item[costKey] === "number"
          ? item[costKey]
          : Number(item[costKey]);

      const key = `${cloud}`; // Use cloud as the key

      if (BU in counts) {
        counts[BU] += 1;
        costs[BU] += cost;
      } else {
        counts[BU] = 1;
        costs[BU] = cost;
      }
    }
  }

  processData(finopsSliceData.awsDailyUsage, "BusinessUnit", "Aws");
  processData(finopsSliceData.azureDailyUsage, "BusinessUnit", "Cost");
  processData(finopsSliceData.gcpDailyUsage, "BusinessUnit", "Cost");
  // Sort counts object in descending order
  const sortedData = Object.entries(costs).sort(
    (a, b) => (b[1] as number) - (a[1] as number)
  );
  // const sort = Object.fromEntries(sortedData)// test
  const labels = sortedData.map(([key]) => key);
  const barChartDataValues = sortedData.map(([, value]) => value);
  const Labels = labels.map(capitalizeFirstLetter);
  const handleItemNbChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue !== "number") {
      return;
    }
    setItemNb(newValue);
    setlablesNb(newValue);
  };
  const Category10 = ["rgba(175, 16, 195, 0.7)"];
  const highlightScope = {
    highlighted: "series",
    faded: "global",
  } as const;
  const series = [
    {
      label: "Cost",
      data: barChartDataValues.slice(0, itemNb) as number[],
      highlightScope,
      colors: "linear-gradient(to right bottom, #36EAEF, #6B0AC9)",
    },
  ];
  return (
    <Box sx={{ width: "100%" }}>
      <small className="fw-bold- nav-font ">Top Business Unit</small>
      <BarChart
        yAxis={[{ scaleType: "band", data: Labels.slice(0, labelNb) }]}
        series={series}
        layout="horizontal"
        width={350 }
        height={310}
        colors={Category10}
        margin={{ left: 50, bottom: 20, right: 60, top: 0 }}
        slotProps={{ legend: { hidden: true } }}
        onAxisClick={(event, d: any) => setAxisData(d)}
      />
      <Box sx={{ width: 250 }}>
        <Slider
          sx={{ pt: 0, marginLeft: 4 }}
          value={itemNb}
          size="small"
          onChange={handleItemNbChange}
          valueLabelDisplay="auto"
          max={barChartDataValues.length}
          aria-labelledby="input-item-number"
          min={1}
        />
      </Box>
    </Box>
  );
}
