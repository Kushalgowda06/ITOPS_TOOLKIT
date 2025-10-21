import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import Tableedit from "../Table/Tableedit";
import Tile from "../Tiles/Tile";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import testapi from '../../../api/testapi.json'

const Cloudtable: React.FC = () => {
  const cloudData = useAppSelector(selectCommonConfig);
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const checkNullValues: any = (element: any) => {
    return element === null || element === "Null";
  };

  const [searchParams] = useSearchParams();

  const label = searchParams.get("label");
  const cloud = searchParams.get("cloud");
  const status = searchParams.get("status");

  let filterData = cloudData?.filteredTaggingData.filter((item) => {
    if (item.Cloud === cloud) {
      if (status === "Tagged") {
        return !Object.values(item).some(checkNullValues);
      } else if (status === "Untagged") {
        return Object.values(item).some(checkNullValues);
      } else {
        return true;
      }
    } else if (item.ResourceType === label) {
      return Object.values(item).some(checkNullValues);
    } else {
      return false;
    }
  });
  let finalExportData =
    status === null && label === null && cloud === null
      ? cloudData?.filteredTaggingData
      : filterData;
  const apiUrl =
    `${testapi.baseURL}/reports`;

  return (
    <div className="px-1 py-2">
      <Tile>
        {pathname.includes("tagging-policy") ||
        (pathname.includes("details") && cloudData?.filteredTaggingData.length > 0) ? (
          <Tableedit customData={finalExportData} apiUrl={apiUrl} />
        ) : (
          navigate({
            pathname: "/tagging-policy",
          })
        )}
      </Tile>
    </div>
  );
};

export default Cloudtable;
