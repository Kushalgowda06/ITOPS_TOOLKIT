import Tableedit from "../Table/Tableedit";
import Tile from "../Tiles/Tile";
import moment from "moment";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
const ComplainceAgingTable: React.FC = () => {
  const cloudData = useAppSelector(selectCommonConfig);

  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  let filterData: any,
    gmonthfilter: any,
    smonthfilter: any,
    weekfilter: any,
    dayfilter: any,
    initialData: any;


    initialData = cloudData.filteredComplainceData.filter((item: any) => {
       return item.Compliance === "Non-Compliant";
     });
    gmonthfilter =   initialData.filter((currElem: any) => {
        const currentDate = moment.utc();
        const identifiedOnDate = moment(currElem.IdentifiedOn);
        const diffInMonths = currentDate.diff(identifiedOnDate, "months", true);
        return diffInMonths >= 1;
      });
    
      smonthfilter =   initialData.filter((currElem: any) => {
        return (
          moment.utc().diff(moment(currElem.IdentifiedOn), "months") < 1 &&
          moment.utc().diff(moment(currElem.IdentifiedOn), "weeks") >= 1
        );
      });
      weekfilter =   initialData.filter((currElem: any) => {
        return (
          moment.utc().diff(moment(currElem.IdentifiedOn), "weeks") < 1 &&
          moment.utc().diff(moment(currElem.IdentifiedOn), "days") >= 1
        );
      });
    
      dayfilter =   initialData.filter((currElem: any) => {
        const identifiedOn = moment.utc(currElem.IdentifiedOn);
        const diffInDays = moment.utc().diff(identifiedOn, "days");
        return diffInDays < 1;
      });

  const [searchParams] = useSearchParams();

  const label = searchParams.get("label");

  switch (label) {
    case ">1Month":
      filterData = gmonthfilter;
      break;
    case "<1Month":
      filterData = smonthfilter;
      break;
    case "<1Week":
      filterData = weekfilter;
      break;
    case "<1Day":
      filterData = dayfilter;
      break;
  }
 
    return (
    <div className="mx-3 my-2">
      <div className="row col-row-2 mt-2">
        <div className="col-12 gx-2">
          <Tile>
            {pathname.includes("/complaince-policy") ||
            (pathname.includes("complaince-aging") &&
            cloudData.filteredComplainceData.length > 0) ? (
              <Tableedit customData={filterData} />
            ) : (
              navigate({
                pathname: "/complaince-policy",
              })
            )}
          </Tile>
        </div>
      </div>
    </div>
  );
};
export default ComplainceAgingTable;
