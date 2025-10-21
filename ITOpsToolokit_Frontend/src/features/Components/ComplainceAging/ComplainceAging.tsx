import React, { useEffect, useState } from "react";
import moment from "moment";
import Aging from "../Aging/Aging";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";

interface CalculatedData {
  gr1moncount: number;
  less1moncount: number;
  less1weekcount: number;
  less1daycount: number;
  grmon: number;
  lesmon: number;
  w: number;
  d: number;
}

const ComplainceAging: React.FC = () => {
  const advisoryData = useAppSelector(selectCommonConfig);
  let less1daycount: number = 0,
    less1weekcount: number = 0,
    less1moncount: number = 0,
    gr1moncount: number = 0;
  let total: number, grmon: number, lesmon: number, w: number, d: number;
  let filterdata: string[];


  const initialData = advisoryData.filteredComplainceData.filter((item: any) => {
    return item.Compliance === "Non-Compliant";
  });

  filterdata = initialData.map(
    (currElem: any) => currElem.IdentifiedOn
  );
  filterdata?.map((currElem: any) =>
    moment.utc().diff(moment(currElem), "days") < 1
      ? (less1daycount = less1daycount + 1)
      : moment.utc().diff(moment(currElem), "weeks") < 1
      ? (less1weekcount = less1weekcount + 1)
      : moment.utc().diff(moment(currElem), "months") < 1
      ? (less1moncount = less1moncount + 1)
      : (gr1moncount = gr1moncount + 1)
  );

  total = gr1moncount + less1moncount + less1weekcount + less1daycount;
  grmon = (gr1moncount / total) * 100;
  lesmon = (less1moncount / total) * 100;
  w = (less1weekcount / total) * 100;
  d = (less1daycount / total) * 100;

  const calculatedata: CalculatedData = {
    gr1moncount,
    less1moncount,
    less1weekcount,
    less1daycount,
    grmon,
    lesmon,
    w,
    d,
  };

  return (
    <>
      <Aging
        case={"complaince-aging"}
        title={"Non-Compliant Aging"}
        lowerPadding={" "}
        upperPadding={" "}
        calculatedata={calculatedata}
      />
    </>
  );
};
export default ComplainceAging;
