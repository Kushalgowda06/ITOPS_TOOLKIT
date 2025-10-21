import React, { useState } from "react";
import FinopsCard from "./FinopsCard";
import { useAppSelector } from "../../../app/hooks";
import { selectFinopsData } from "../FinOpsPage/FinOpsDataSlice";
import { MdWaterfallChart } from "react-icons/md";
import FormatNumber from "../../Utilities/FormatNumber";
import { wrapIcon } from "../../Utilities/WrapIcons";



const MaxDailyCostUsage = () => {
  const finopsSliceData = useAppSelector(selectFinopsData);
  const awsdata = finopsSliceData?.awsDailyUsage.reduce((maxAwsSoFar: any, entry: any) => {
    const awsValue = Number(entry.Aws);
    return Math.max(maxAwsSoFar, awsValue);
  }, 0);
  const MdWaterfallChartIcon = wrapIcon(MdWaterfallChart);


  const GCPData = finopsSliceData?.gcpDailyUsage.reduce(
    (maxGcpSoFar: any, entry: any) => {
      const gcpValue = Number(entry.Cost);
      return Math.max(maxGcpSoFar, gcpValue);
    }, 0);

  const azuredata = finopsSliceData?.azureDailyUsage.reduce(
    (maxAzureSoFar: any, entry: any) => {
      const azureValue = Number(entry.Cost);
      return Math.max(maxAzureSoFar, azureValue);
    }, 0);

  return (
    <FinopsCard title={" Max Daily Cost Usage"} count={FormatNumber(GCPData + azuredata + awsdata)} icon={<MdWaterfallChartIcon  title="Max Daily CostUsage" />} />

  );
};

export default MaxDailyCostUsage;
