import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { TaggingStatus } from "../TaggingStatus/TaggingStatus";
import Treeview from "../Tree/Treeview";
import Tile from "../Tiles/Tile";
import { Toast, Modal } from "react-bootstrap";
import { VscFilter } from "react-icons/vsc";
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
  setComplianceData,
  setFilteredComplainceData,
  setFilteredTaggingData,
} from "../CommonConfig/commonConfigSlice";
import ServiceNow from "../ServiceNow/ServiceNow";
import Cloudtable from "../Cloudtable/Cloudtable";
import TopBU from "../TopBU/TopBU";
import Application from "../Application/Application";
import { Api } from "../../Utilities/api";
import testapi from "../../../api/testapi.json";
import { ComplainceAnalysis } from "../ComplianceAnalysis/ComplainceAnalysis";
import ComplainceStatus from "../ComplainceStatus/ComplainceStatus";
import ComplainceAging from "../ComplainceAging/ComplainceAging";
import TopComplaince from "../TopComplaince/TopComplaince";
import ComplainceTable from "../ComplainceTable/ComplainceTable";
import Complaince from "../Complaince.tsx/Complaince";
import { wrapIcon } from "../../Utilities/WrapIcons";
const ComplaincePage = () => {
  const VscFilterIcon = wrapIcon(VscFilter);

  const currentCloud: CloudState = useAppSelector(selectCloud);
  const cloudData = useAppSelector(selectCommonConfig);
  const dispatch = useAppDispatch();
  const [showToast, setShowToast] = useState(false); // alert popUp
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([
      Api.getData(testapi.caccesskey).then((response) => response),
      Api.getData(testapi.cmfa).then((response) => response),
      Api.getData(testapi.cebsvolume).then((response) => response),
      Api.getData(testapi.cs3Lifecycle).then((response) => response),

    ])
      .then((responses) => {
        dispatch(
          setComplianceData([
            ...responses[0],
            ...responses[1],
            ...responses[2],
            ...responses[3],
          ])
        );
        dispatch(setFilteredComplainceData([
          ...responses[0],
          ...responses[1],
          ...responses[2],
          ...responses[3]
        ]));
        if (!currentCloud.currentCloud.length) {
          let filteredCloudData: any = filterData("Cloud", [
            ...responses[0],
            ...responses[1],
            ...responses[2],
            ...responses[3]
          ]);
          let availableCLouds = Object.keys(filteredCloudData);
          availableCLouds.length > 0 &&
            dispatch(setCloud(Object.keys(filteredCloudData)));
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!currentCloud.currentCloud.length) {
      let filteredCloudData: any = filterData("Cloud", cloudData.complianceData);
      let availableCLouds = Object.keys(filteredCloudData);
      availableCLouds.length > 0 &&
        dispatch(setCloud(Object.keys(filteredCloudData)));
    }
  });

  useEffect(() => {
    let filteredCloudData: any = filterData("Cloud", cloudData?.complianceData);
    let tempDataStore = [];
    if (Object.keys(filteredCloudData)?.length) {

      currentCloud?.currentCloud.forEach((selectedCloud: any) => {
        if (filteredCloudData.hasOwnProperty(selectedCloud)) {
          // Only push data if the selectedCloud key exists in filteredCloudData
          tempDataStore?.push(...filteredCloudData[selectedCloud]);
        }
      });
    }
    dispatch(setFilteredComplainceData(tempDataStore));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCloud]);

  const showMessage = (msg) => {
    setMessage(msg);
  };

  return (
    <>
      <>
        <div className="mx-3 my-2">
          <Toast
            show={showToast}
            onClose={() => setShowToast(false)}
            delay={30000000}
            autohide
            className={"position-absolute  top-0  custom_margin "}
          >
            <Toast.Body style={{ fontSize: "12px", padding: "3px 1px 3px 4px" }}>
              <VscFilterIcon style={{ margin: "-5px 2px 1px 8px" }} />{message}</Toast.Body>
          </Toast>

          <div className="row  bg-light">
            <div className="col-lg-3  col-md-6 col-row-1 gx-2">
              <Tile>
                <ComplainceAnalysis />
              </Tile>
            </div>
            <div className="col-lg-4  col-md-6 gx-2">
              <div className="d-flex orphan-status-height bg-white p-2">
                <ComplainceStatus />
              </div>
              <div className="d-flex mt-2 orphan-status bg-white p-2">
                <ComplainceAging />
              </div>
            </div>
            <div className="col-lg-5  col-md-12 gx-2 mt-lg-0 mt-md-2">
              <div className="d-flex bg-white p-2 orphan-status-height">
                <Complaince />
              </div>

              <div className="d-flex mt-2 bg-white p-2">
                <Treeview />
              </div>

            </div>
          </div>
          <div className="row col-row-2 mt-2">
            <div className="col-7 gx-2">
              <Tile>
                <TopComplaince />
              </Tile>
            </div>
            <div className="col-5  gx-2">
              <Tile>
                <ServiceNow height_class="214px" />
              </Tile>
            </div>
          </div>
          <div className="row col-row-2 mt-2">
            <div className="col-7 gx-2">
              <Tile>
                <TopBU setShowToast={setShowToast} showMes={showMessage} />
              </Tile>
            </div>
            <div className="col-5  gx-2">
              <Tile>
                <Application setShowToast={setShowToast} showMes={showMessage} />
              </Tile>
            </div>
          </div>
          <div className="row col-row-2 mb-3">
            <div className="w-100 px-0 py-0">
              <ComplainceTable />
            </div>
          </div>
        </div>
      </>
    </>
  );
};
export default ComplaincePage;
