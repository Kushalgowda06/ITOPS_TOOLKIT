import React from "react";
import moment from "moment";
import Aging from "../Aging/Aging";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
const UntaggedAging = () => {
  const cloudData = useAppSelector(selectCommonConfig);
  let less1daycount:number = 0,
    less1weekcount:number = 0,
    less1moncount:number = 0,
    gr1moncount:number = 0;
  let total:number, grmon:number, lesmon:number, w:number, d:number, filterdata:any[];
const checkNullValues: any = (element: any) => {
  return element === null || element === "Null";
};

let untaggeddata = cloudData?.filteredTaggingData.filter((item) => {
      return Object.values(item).some(checkNullValues);
});
  filterdata = untaggeddata.map(
    (currElem: any, index: number) => currElem.IdentifiedOn
  );
  filterdata?.map((currElem: any, index: number) =>
    moment.utc().diff(moment(currElem), "days") < 1
      ? (less1daycount += 1)
      : moment.utc().diff(moment(currElem), "weeks") < 1
      ? (less1weekcount += 1)
      : moment.utc().diff(moment(currElem), "months") < 1
      ? (less1moncount += 1)
      : (gr1moncount += 1)
  );

  total = gr1moncount + less1moncount + less1weekcount + less1daycount;
  grmon = (gr1moncount / total) * 100;
  lesmon = (less1moncount / total) * 100;
  w = (less1weekcount / total) * 100;
  d = (less1daycount / total) * 100;

  const calculatedata = {
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
        case={"Untagged-Aging"}
        title={"Un-Tagged Aging"}
        lowerPadding={"pt-4"}
        upperPadding={"pt_5"}
        calculatedata={calculatedata}
      />
    </>
  );
};
export default UntaggedAging;
