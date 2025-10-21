
import React, { useEffect, useState } from "react";
import moment from "moment";
import fin_TotalCost from "../../../assets/fin_TotalCost.png";
import FinopsCard from "./FinopsCard";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { selectFinopsData, setFinOpsTotalCost } from "../FinOpsPage/FinOpsDataSlice";
import { TbCloudDollar } from "react-icons/tb";
import FormatNumber from "../../Utilities/FormatNumber";
import { wrapIcon } from "../../Utilities/WrapIcons";

const TotalCost = () => {
  const finopsSliceData = useAppSelector(selectFinopsData);
  const TbCloudDollarIcon = wrapIcon(TbCloudDollar);

  const dispatch = useAppDispatch();
  const awsdata = finopsSliceData?.awsDailyUsage?.reduce((acc: any, entry: any) => {
    const monthYear = moment(entry?.Date).format("MMMM YYYY");
    if (!acc[monthYear]) {
      acc[monthYear] = { AwsTotal: 0 };
    }
    acc[monthYear].AwsTotal += parseInt(entry?.Aws);
    return acc;
  }, {});

  const GCPData = finopsSliceData?.gcpDailyUsage?.reduce((acc: any, entry: any) => {
    const monthYear = moment(entry?.Date).format("MMMM YYYY");
    if (!acc[monthYear]) {
      acc[monthYear] = { GCPTotal: 0 };
    }
    acc[monthYear].GCPTotal += parseInt(entry?.Cost);
    return acc;
  }, {});

  const azuredata = finopsSliceData?.azureDailyUsage?.reduce((acc: any, entry: any) => {
    const monthYear = moment(entry?.Date).format("MMMM YYYY");
    if (!acc[monthYear]) {
      acc[monthYear] = { AzureTotal: 0 };
    }
    acc[monthYear].AzureTotal += entry?.Cost;
    return acc;
  }, {});

  const calculateTotal = (data: any, forecastKey: string): any => {
    return Object.values(data).reduce((sum: any, monthData: any) => sum + monthData[forecastKey], 0);
  }

  const totalAzure = calculateTotal(azuredata, "AzureTotal");
  const totalGcp = calculateTotal(GCPData, "GCPTotal");
  const totalAws = calculateTotal(awsdata, "AwsTotal");

  // Sum up all forecast totals
  const totalCloud = totalAzure + totalGcp + totalAws;

  useEffect(() => {
    dispatch(setFinOpsTotalCost({
      "totalCloud": totalCloud,
      "totalAzure": totalAzure,
      "totalGcp": totalGcp,
      "totalAws": totalAws
    }))
  }, [totalCloud])


  return (
    <FinopsCard title={"Total Cost"} count={FormatNumber(totalCloud)} icon={<TbCloudDollarIcon title="Total Cost" />} />
  );
};

export default TotalCost;