import moment from "moment";
import Aging from "../Aging/Aging";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";

interface OrphanData {
  ResourceStatus: string;
  IdentifiedOn: string;
}

const OrphanAging: React.FC = () => {
  const cloudData = useAppSelector(selectCommonConfig);
  let less1daycount: number = 0,
    less1weekcount: number = 0,
    less1moncount: number = 0,
    gr1moncount: number = 0;
  let total: number, grmon: number, lesmon: number, w: number, d: number;
  let initialData: OrphanData[], filterdata: string[];
  initialData = cloudData.filteredOrphanData.filter((item: OrphanData) => {
    return item.ResourceStatus === "Orphaned";
  });

  filterdata = initialData.map((currElem: OrphanData) => currElem.IdentifiedOn);
  filterdata?.map((currElem: string) =>
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
        case={"orphan-object"}
        title={"Orphan Objects Aging"}
        lowerPadding={" "}
        upperPadding={" "}
        calculatedata={calculatedata}
      />
    </>
  );
};
export default OrphanAging;
