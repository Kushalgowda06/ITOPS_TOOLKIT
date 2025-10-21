
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
  CloudState,
  selectCloud,
  setCloud,
} from "../Cloudtoggle/CloudToggleSlice";
import { PopUpModal } from "../../Utilities/PopUpModal";
import {
  selectCommonConfig,
  setFilteredOrphanData,
  setOrphanData,
} from "../CommonConfig/commonConfigSlice";
import { CostAnalysis } from "../CostyAnalysis/CostAnalysis";
import Tile from "../Tiles/Tile";
import Treeview from "../Tree/Treeview";
import { filterData } from "../../Utilities/filterData";
import OrphanStatus from "../OrphanStatus/OrphanStatus";
import OrphanAging from "../OrphanAging/OrphanAging";
import TopOrphan from "../TopOrphan/TopOrphan";
import ServiceNow from "../ServiceNow/ServiceNow";
import OrphanTable from "../OrphanTable/OrphanTable";
import TopBU from "../TopBU/TopBU";
import Application from "../Application/Application";
import { Api } from "../../Utilities/api";
import testapi from "../../../api/testapi.json";
import { Toast } from "react-bootstrap";
import { VscFilter } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import { wrapIcon } from "../../Utilities/WrapIcons";

const OrphanPage: React.FC = () => {
  const VscFilterIcon = wrapIcon(VscFilter);

  const currentCloud: CloudState = useAppSelector(selectCloud);
  const cloudData = useAppSelector(selectCommonConfig);
  const [showToast, setShowToast] = useState(false); // alert popUp
  const [message, setMessage] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchOrphanData = useCallback(async () => {
    setError(null);
    try {
      const response: any = await Api.getData(testapi.orphan);
      dispatch(setOrphanData(response));
      dispatch(setFilteredOrphanData(response));
      if (!currentCloud.currentCloud.length) {
        const filteredCloudData: any = filterData("Cloud", response);
        const availableClouds = Object.keys(filteredCloudData);
        if (availableClouds.length > 0) {
          dispatch(setCloud(availableClouds));
        }
      }
    } catch (error) {
      console.error("Error fetching orphan data:", error);
      setError("Failed to load tagging details.");
      setShowModal(true);
    }
  }, [currentCloud.currentCloud, dispatch]);

  useEffect(() => {
    if (cloudData.orphanData.length <= 0) {
      fetchOrphanData();
    }
  }, [cloudData.orphanData.length, fetchOrphanData]);

  const filteredOrphanData = useMemo(() => {
    const filteredCloudData: any = filterData("Cloud", cloudData.orphanData);
    const tempDataStore: any[] = [];

    if (Object.keys(filteredCloudData).length && currentCloud?.currentCloud?.length > 0) {
      currentCloud.currentCloud.forEach((selectedCloud: string) => {
        if (filteredCloudData[selectedCloud]) {
          tempDataStore.push(...filteredCloudData[selectedCloud]);
        }
      });
    } else if (!currentCloud.currentCloud.length && Object.keys(filteredCloudData).length > 0) {
      const availableClouds = Object.keys(filteredCloudData);
      if (availableClouds.length > 0) {
        dispatch(setCloud(availableClouds));
      }
      return cloudData.orphanData; // Show all if no cloud is selected initially
    }

    return tempDataStore;
  }, [cloudData.orphanData, currentCloud.currentCloud, dispatch]);

  useEffect(() => {
    dispatch(setFilteredOrphanData(filteredOrphanData));
  }, [filteredOrphanData, dispatch]);

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setShowToast(true);
  }, []);

  const handleOkClick = useCallback(() => {
    setShowModal(false);
    navigate(-1); // Go back to the previous page in history
  }, [navigate]);

  if (error) {
    return (
      <PopUpModal
        show={showModal}
        modalMessage={error}
        onHide={handleOkClick}
      />
    )
  }

  return (
    <>
      <div className="mx-3 my-2">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          className={"position-absolute  top-0  custom_margin "}
        >
          <Toast.Body style={{ fontSize: "12px", padding: "3px 1px 3px 4px" }}>
            <VscFilterIcon style={{ margin: "-5px 2px 1px 8px" }} />{message}
          </Toast.Body>
        </Toast>

        <div className="row  bg-light">
          <div className="col-lg-3  col-row-1 col-md-6 gx-2">
            <Tile>
              <CostAnalysis />
            </Tile>
          </div>
          <div className="col-lg-4  col-md-6 gx-2">
            <div className="d-flex orphan-status-height bg-white p-2 ">
              <OrphanStatus />
            </div>
            <div className="d-flex mt-2 orphan-status bg-white p-2">
              <OrphanAging />
            </div>
          </div>
          <div className="col-lg-5  col-md-12 gx-2 mt-lg-0 mt-md-2">
            <Tile>
              <Treeview />
            </Tile>
          </div>
        </div>
        <div className="row col-row-2 mt-2">
          <div className="col-7 gx-2">
            <Tile>
              <TopOrphan />
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
            <OrphanTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default OrphanPage;

/******************************** Before Optimization *************************/

// const OrphanPage: React.FC = () => {
//   const currentCloud: CloudState = useAppSelector(selectCloud);
//   const cloudData = useAppSelector(selectCommonConfig);
//   const [showToast, setShowToast] = useState(false); // alert popUp
//   const [message, setMessage] = useState('');
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     if (cloudData.orphanData.length <= 0) {
//       Api.getData(testapi.orphan).then((response: any) => {
//         dispatch(setOrphanData(response));
//         dispatch(setFilteredOrphanData(response));
//         if (!currentCloud.currentCloud.length) {
//           let filteredCloudData: any = filterData("Cloud", response);
//           let availableCLouds = Object.keys(filteredCloudData);
//           availableCLouds.length > 0 &&
//             dispatch(setCloud(Object.keys(filteredCloudData)));
//         }
//       });
//     }else{
//       let filteredCloudData: any = filterData("Cloud", cloudData.orphanData);
//       let availableCLouds = Object.keys(filteredCloudData);
//       availableCLouds.length > 0 &&
//         dispatch(setCloud(Object.keys(filteredCloudData)));
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (!currentCloud.currentCloud.length) {
//       let filteredCloudData: any = filterData("Cloud", cloudData.orphanData);
//       let availableCLouds = Object.keys(filteredCloudData);
//       availableCLouds.length > 0 &&
//         dispatch(setCloud(Object.keys(filteredCloudData)));
//     }
//   });

//   useEffect(() => {
//     let filteredCloudData: any = filterData("Cloud", cloudData.orphanData);
//     let tempDataStore = [];
//     if (Object.keys(filteredCloudData).length) {
//       currentCloud.currentCloud.forEach((selectedCloud: any) => {
//         tempDataStore.push(...filteredCloudData[selectedCloud]);
//       });
//     }
//     dispatch(setFilteredOrphanData(tempDataStore));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentCloud]);

//   const showMessage = (msg) => {
//     setMessage(msg);
//   };

