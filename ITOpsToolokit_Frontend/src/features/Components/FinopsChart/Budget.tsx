import React, { useEffect } from "react";
import moment from "moment";
import fin_TotalCost from "../../../assets/fin_TotalCost.png";
import FinopsCard from "./FinopsCard";
import { SetFinOpsBudget, selectFinopsData } from "../FinOpsPage/FinOpsDataSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { GrMoney } from "react-icons/gr";
import FormatNumber from "../../Utilities/FormatNumber";
import { wrapIcon } from "../../Utilities/WrapIcons";

const Budget = () => {
  const GrMoneyIcon = wrapIcon(GrMoney);

  const finopsSliceData = useAppSelector(selectFinopsData);
  const dispatch = useAppDispatch();
  function getLastDateOfMonth(monthYearString) {
    const [month, year] = monthYearString.split(" ");
  
    const monthMap = {
      "January": 0,
      "February": 1,
      "March": 2,
      "April": 3,
      "May": 4,
      "June": 5,
      "July": 6,
      "August": 7,
      "September": 8,
      "October": 9,
      "November": 10,
      "December": 11
    };
    if (!monthMap.hasOwnProperty(month) || isNaN(year)) {
      return null; 
    }
  
    const monthInt = monthMap[month];
  
    const date = new Date(year, monthInt, 1); // Set day to 1

    date.setDate(0);

    return date.getDate().toString();
  }
  const awsdata = finopsSliceData?.awsDailyUsage.reduce((acc:any, entry:any) => {
    const monthYear = moment(entry.Date).format("MMMM YYYY");
    if (!acc[monthYear]) {
const lastdate:any = getLastDateOfMonth(monthYear)
      acc[monthYear] = { DailyBudgetTotal: parseInt(entry.DailyBudget) * lastdate };
    }
    return acc;
  }, {});


  const GCPData = finopsSliceData?.gcpDailyUsage.reduce((acc:any, entry:any) => {
    const monthYear = moment(entry.Date).format("MMMM YYYY");
    if (!acc[monthYear]) {
      acc[monthYear] = { DailyBudgetTotal:  parseInt(entry.Budget_static)};
    }
    return acc;
  }, {});

  const azuredata = finopsSliceData?.azureDailyUsage.reduce((acc:any, entry:any) => {
    const monthYear = moment(entry.Date).format("MMMM YYYY");
    if (!acc[monthYear]) {
      acc[monthYear] = {DailyBudgetTotal: entry.Budget_static};
    } 
    return acc;
  }, {});
  const calculateBudgetTotal= (data:any):any => {
    return Object.values(data).reduce((sum:any, monthData:any) => sum + monthData["DailyBudgetTotal"] , 0);
  }
  
  const totalAzureBudget = calculateBudgetTotal(azuredata);
  const totalGcpBudget = calculateBudgetTotal(GCPData);
  const totalAwsBudget = calculateBudgetTotal(awsdata);
  
  // Sum up all forecast totals
  const totalCloudBudget = totalAzureBudget + totalGcpBudget + totalAwsBudget;

  useEffect(() => {
    dispatch(SetFinOpsBudget({"totalCloudBudget" : totalCloudBudget,
      "totalAzureBudget" : totalAzureBudget,
      "totalGcpBudget" : totalGcpBudget,
      "totalAwsBudget" : totalAwsBudget
    }))
  },[totalCloudBudget])



  return (
    <FinopsCard title={"Budget"} count ={  FormatNumber(totalCloudBudget)} icon={<GrMoneyIcon title="Budget" />} />
  );
};

export default Budget;
