import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";

import Tile from "../Tiles/Tile";
import UntaggedAging from "../UntaggedAging/UntaggedAging";
import TopUntagged from "../TopUnTagged/TopUntagged";
import { filterData } from "../../Utilities/filterData";
import {
  CloudState,
  selectCloud,
  setCloud,
} from "../Cloudtoggle/CloudToggleSlice";
import {
  selectCommonConfig,
  setCloudData,
  setFilteredTaggingData,
} from "../CommonConfig/commonConfigSlice";
import ServiceNow from "../ServiceNow/ServiceNow";
import Cloudtable from "../Cloudtable/Cloudtable";
import TopBU from "../TopBU/TopBU";
import Application from "../Application/Application";
import { Api } from "../../Utilities/api";
import testapi from "../../../api/testapi.json";
import OverDue from "../OverdueStatus/OverDue";
import PreView from "../Preview/PreView";
import PatchStatus from "../PatchStatus/PatchStatusBar";
import StatusBar from "../StatusBars/StatusBar";
import ChangeRequest from "../ChangeRequest/ChangeRequest";
import PatchStatusData from "../PatchStatusData/PatchStatusData";
import { PatchingStatus } from "../PatchingStatus/PatchingStatus";
import PatchStatusBar from "../PatchStatus/PatchStatusBar";

const PatchDashboardPage = () => {
  const currentCloud: CloudState = useAppSelector(selectCloud);
  const cloudData = useAppSelector(selectCommonConfig);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (cloudData.cloudData.length <= 0) {
      Api.getData(testapi.tagging).then((response: any) => {
        dispatch(setCloudData(response));
        dispatch(setFilteredTaggingData(response))

        if (!currentCloud.currentCloud.length) {
          let filteredCloudData: any = filterData("Cloud", response);
          let availableCLouds = Object.keys(filteredCloudData);
          availableCLouds.length > 0 &&
            dispatch(setCloud(Object.keys(filteredCloudData)));
        }
      })
    } else {
      if (!currentCloud.currentCloud.length) {
        let filteredCloudData: any = filterData("Cloud", cloudData.cloudData);
        let availableCLouds = Object.keys(filteredCloudData);
        availableCLouds.length > 0 &&
          dispatch(setCloud(Object.keys(filteredCloudData)));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currentCloud.currentCloud.length) {
      let filteredCloudData: any = filterData("Cloud", cloudData.cloudData);
      let availableCLouds = Object.keys(filteredCloudData);
      availableCLouds.length > 0 &&
        dispatch(setCloud(Object.keys(filteredCloudData)));
    }
  })


  useEffect(() => {
    let filteredCloudData: any = filterData("Cloud", cloudData.cloudData);
    let tempDataStore = [];
    if (Object.keys(filteredCloudData).length) {
      currentCloud.currentCloud.forEach((selectedCloud: any) => {
        tempDataStore.push(...filteredCloudData[selectedCloud]);
      });
    }

    dispatch(setFilteredTaggingData(tempDataStore));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCloud]);
  return (
    <>
      <div className="mx-3 my-2">
        <div className="row bg-light">
          <div className="col-lg-4 col-md-6 col-row-1 gx-2">
            <Tile style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PatchingStatus />
            </Tile>
          </div>
          <div className="col-lg-4 col-md-6 gx-2">
            <Tile className="container card" style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <OverDue />
            </Tile>
          </div>
          <div className="col-lg-4 col-md-12 mt_md_2 gx-2">
            <Tile style={{ height: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PreView />
            </Tile>
          </div>
        </div>
        <div className="row col-row-2 mt-2">
          <div className="col-lg-4 col-md-6 col-row-1 gx-2">
            <Tile style={{ height: '291px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PatchStatusBar />
            </Tile>
          </div>
          <div className="col-lg-4 col-md-6 gx-2" style={{ height: "15.7rem" }}>
            <Tile style={{ height: '291px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <StatusBar />
            </Tile>
          </div>
          <div className="col-lg-4 col-md-12 mt_md_2 gx-2">
            <Tile style={{ height: '291px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChangeRequest />
            </Tile>
          </div>
        </div>
        <div className="row col-row-2 mt-2">
          <Tile>
            <PatchStatusData />
          </Tile>
        </div>
      </div>

    </>
  );

}
export default PatchDashboardPage;
function setLoading(arg0: boolean) {
  throw new Error("Function not implemented.");
}

function setError(message: any) {
  throw new Error("Function not implemented.");
}

function setData(data: any) {
  throw new Error("Function not implemented.");
}

