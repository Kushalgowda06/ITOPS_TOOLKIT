import React, { useState } from "react";
import moment from "moment";
import fin_TotalCost from "../../../assets/fin_TotalCost.png";
import FinopsCard from "./FinopsCard";
import { useAppSelector } from "../../../app/hooks";
import { selectFinopsData } from "../FinOpsPage/FinOpsDataSlice";
import { GiChart } from "react-icons/gi";
import FormatNumber from "../../Utilities/FormatNumber";
import { wrapIcon } from "../../Utilities/WrapIcons";



const ForeCast = () => {
  const finopsSliceData = useAppSelector(selectFinopsData);
  const GiChartIcon = wrapIcon(GiChart);

  const awsforecast = finopsSliceData?.awsForecast?.reduce((acc: any, entry: any) => {
    const monthYear = moment(entry.Date).format("MMMM YYYY");
    if (!acc[monthYear]) {
      acc[monthYear] = { AwsForeCast: 0 };
    }
    if (typeof entry.Forecast === "number") {
      acc[monthYear].AwsForeCast += entry.Forecast;
    } else if (typeof entry.Forecast === "string") {
      acc[monthYear].AwsForeCast += parseInt(entry.Forecast);
    }
    return acc;
  }, {});

  const gcpforecast = finopsSliceData?.gcpForecast?.reduce((acc: any, entry: any) => {
    const monthYear = moment(entry.Date).format("MMMM YYYY");
    if (!acc[monthYear]) {
      acc[monthYear] = { GcpForeCast: 0 };
    }
    acc[monthYear].GcpForeCast += parseInt(entry.Forecast);
    return acc;
  }, {});

  const azureforecast = finopsSliceData?.azureForecast?.reduce((acc: any, entry: any) => {
    const formattedDate = moment(entry.Date).format("MMMM YYYY");;
    if (!acc[formattedDate]) {
      acc[formattedDate] = { AzureForeCast: 0 };
    }
    acc[formattedDate].AzureForeCast += parseInt(entry.Cost_inr);
    return acc;
  }, {});

  const calculateForecastTotal = (data: any, forecastKey: string): any => {
    return Object.values(data).reduce((sum: any, monthData: any) => sum + monthData[forecastKey], 0);
  }

  const totalAzureForecast = calculateForecastTotal(azureforecast, "AzureForeCast");
  const totalGcpForecast = calculateForecastTotal(gcpforecast, "GcpForeCast");
  const totalAwsForecast = calculateForecastTotal(awsforecast, "AwsForeCast");

  // Sum up all forecast totals
  const totalCloudForecast = totalAzureForecast + totalGcpForecast + totalAwsForecast;



  return (
    <FinopsCard title={"ForeCast"} count={FormatNumber(totalCloudForecast)} icon={<GiChartIcon title="ForeCast" />} />
  );
};

export default ForeCast;
