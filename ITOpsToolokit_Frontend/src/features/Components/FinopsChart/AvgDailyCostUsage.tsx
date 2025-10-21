import React, { useState } from "react";
import moment from "moment";
import FinopsCard from "./FinopsCard";
import { useAppSelector } from "../../../app/hooks";
import { selectFinopsData } from "../FinOpsPage/FinOpsDataSlice";
import { AiOutlinePieChart } from "react-icons/ai";
import FormatNumber from "../../Utilities/FormatNumber";
import { wrapIcon } from "../../Utilities/WrapIcons";

const AvgDailyCostUsage = (props) => {
  const AiOutlinePieChartIcon = wrapIcon(AiOutlinePieChart);
  const finopsSliceData = useAppSelector(selectFinopsData);
  const awsdata = finopsSliceData?.awsDailyUsage.reduce(
    (acc: any, entry: any) => {
      const monthYear = moment(entry.Date).format("MMMM YYYY");
      if (!acc[monthYear]) {
        acc[monthYear] = { AwsTotal: 0 };
      }
      acc[monthYear].AwsTotal += parseInt(entry.Aws);
      return acc;
    },
    {}
  );

  const GCPData = finopsSliceData?.gcpDailyUsage.reduce(
    (acc: any, entry: any) => {
      const monthYear = moment(entry.Date).format("MMMM YYYY");
      if (!acc[monthYear]) {
        acc[monthYear] = { GCPTotal: 0 };
      }
      acc[monthYear].GCPTotal += parseInt(entry.Cost);
      return acc;
    },
    {}
  );

  const azuredata = finopsSliceData?.azureDailyUsage.reduce(
    (acc: any, entry: any) => {
      const monthYear = moment(entry.Date).format("MMMM YYYY");
      if (!acc[monthYear]) {
        acc[monthYear] = { AzureTotal: 0 };
      }
      acc[monthYear].AzureTotal += entry.Cost;
      return acc;
    },
    {}
  );

  const calculateTotal = (data: any, forecastKey: string): any => {
    return Object.values(data).reduce(
      (sum: any, monthData: any) => sum + monthData[forecastKey],
      0
    );
  };

  const totalAzure = calculateTotal(azuredata, "AzureTotal");
  const totalGcp = calculateTotal(GCPData, "GCPTotal");
  const totalAws = calculateTotal(awsdata, "AwsTotal");

  const daysDifference = moment(props?.From_date).diff(
    moment(props?.To_date),
    "days"
  );
  const avgtotalCloud = (totalAzure + totalGcp + totalAws) / daysDifference;


  return (
    <FinopsCard
      title={"Avg Daily Cost Usage"}
      count={ FormatNumber(avgtotalCloud)}
      icon={<AiOutlinePieChartIcon title="Average Daily Costusage" />}
    />
  );
};

export default AvgDailyCostUsage;
