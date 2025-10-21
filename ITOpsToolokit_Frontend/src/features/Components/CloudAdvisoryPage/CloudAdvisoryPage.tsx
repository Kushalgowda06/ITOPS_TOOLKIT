import Tile from "../Tiles/Tile";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
  selectCommonConfig,
  setAdvisoryData,
  setFilteredAdvisoryData,
} from "../CommonConfig/commonConfigSlice";
import { PopUpModal } from "../../Utilities/PopUpModal";
import {
  CloudState,
  selectCloud,
  setCloud,
} from "../Cloudtoggle/CloudToggleSlice";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { filterData } from "../../Utilities/filterData";
import ServiceNow from "../ServiceNow/ServiceNow";
import Treeview from "../Tree/Treeview";
import AdvisoryAging from "../AdvisoryAging/AdvisoryAging";
import AdvisoryStatus from "../AdvisoryStatus/AdvisoryStatus";
import TopAdvisory from "../TopAdvisory/TopAdvisory";
import CloudAdvisoryTable from "../CloudAdvisoryTable/CloudAdvisoryTable";
import ActionStatus from "../ActionStatus/ActionStatus";
import MasonryCards from "../MasonryCards/MasonryCards";
import TopBU from "../TopBU/TopBU";
import { Toast } from "react-bootstrap";
import { VscFilter } from "react-icons/vsc";
import Application from "../Application/Application";
import { processAdvisoryData } from "../../Utilities/processAdvisoryData";
import { Api } from "../../Utilities/api";
import testapi from "../../../api/testapi.json";
import {useNavigate } from "react-router-dom";
import { wrapIcon } from "../../Utilities/WrapIcons";


const CloudAdvisoryPage: React.FC = () => {
    const VscFilterIcon = wrapIcon(VscFilter);
  
  const currentCloud: CloudState = useAppSelector(selectCloud);
  const [showToast, setShowToast] = useState(false); // alert popUp
  const [message, setMessage] = useState('');
  const cloudData = useAppSelector(selectCommonConfig);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchAdvisoryData = useCallback(async () => {
    setError(null);
    try {
      const response: any = await Api.getData(testapi.advisory);
      const processedData = processAdvisoryData(response);
      dispatch(setAdvisoryData(processedData));
      dispatch(setFilteredAdvisoryData(processedData));
      if (!currentCloud.currentCloud.length) {
        const filteredCloudData: any = filterData("Cloud", processedData);
        const availableClouds = Object.keys(filteredCloudData);
        if (availableClouds.length > 0) {
          dispatch(setCloud(availableClouds));
        }
      }
    } catch (error) {
      console.error("Error fetching advisory data:", error);
      setError("Failed to load advisory  details.");
      setShowModal(true);
    }
  }, [currentCloud.currentCloud, dispatch]);

  useEffect(() => {
    if (cloudData.advisoryData.length <= 0) {
      fetchAdvisoryData();
    }
  }, [cloudData.advisoryData.length, fetchAdvisoryData]);

  const filteredAdvisoryData = useMemo(() => {
    const processedData = processAdvisoryData(cloudData.advisoryData);
    const filteredCloudData: any = filterData("Cloud", processedData);
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
      return processedData; // Show all if no cloud is selected initially
    }

    return tempDataStore;
  }, [cloudData.advisoryData, currentCloud.currentCloud, dispatch]);

  useEffect(() => {
    dispatch(setFilteredAdvisoryData(filteredAdvisoryData));
  }, [filteredAdvisoryData, dispatch]);

  const showMessage = useCallback((msg: string) => {
    setMessage(msg);
    setShowToast(true);
  }, []);

  const handleOkClick = useCallback(() => {
    setShowModal(false);
    navigate(-1); // Go back to the previous page in history
  }, [navigate]);

  if (error) {
    return  (
    <PopUpModal
    show={showModal}
    modalMessage={error}
    onHide={handleOkClick}
  />
    )
  }

  return (
    <>
      <div className=" mx-3 my-2">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={30000000}
          autohide
          className={"position-absolute  top-0  custom_margin "}
        >
          <Toast.Body style={{ fontSize: "12px", padding: "3px 1px 3px 4px" }}>
            <VscFilterIcon style={{ margin: "-5px 2px 1px 8px" }} />{message}
          </Toast.Body>
        </Toast>
        <div className=" row bg-light">
          <div className="col-lg-3 col-md-6 col-row-1 gx-2">
            <Tile>
              <ActionStatus />
            </Tile>
          </div>
          <div className="col-lg-4 col-md-6 gx-2">
            <Tile>{<AdvisoryAging />}</Tile>
          </div>
          <div className="col-lg-5 col-md-12 mt_md_2 mt-lg-0f gx-2">
            <Tile>
              <AdvisoryStatus />
            </Tile>
          </div>
        </div>
        <div className=" row mt-2">
          <div className=" col-lg-7 col-md-6 gx-2">
            <Tile>
              <TopBU setShowToast={setShowToast} showMes={showMessage} />
            </Tile>
          </div>
          <div className=" col-lg-5 col-md-6 gx-2">
            <Tile>
              <Application setShowToast={setShowToast} showMes={showMessage} />
            </Tile>
          </div>
        </div>
        <div className="row col-row mt-2 ">
          <div className="col-lg-7 col-md-12 gx-2 ">
            <div className="h-100 bg-white p-2">
              {" "}
              <MasonryCards />
            </div>
          </div>
          <div className="col-lg-5 col-md-12">
            <div className="row">
              <div className="col  gx-2 ">
                <Tile>
                  <TopAdvisory />
                </Tile>
              </div>
              <div className=" col-lg-12 col-md-6 gx-2 gy-2 service_height">
                <Tile>
                  <ServiceNow />
                </Tile>
              </div>
              <div className="col-lg-12 col-md-6 gx-2 gy-2">
                <Tile>
                  <Treeview childrenString="86 Advisories - $354" />
                </Tile>
              </div>
            </div>
          </div>
        </div>
        <div className="row col-row-2 mb-3">
          <div className="w-100 px-0 py-0">
            <CloudAdvisoryTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default CloudAdvisoryPage;

// const CloudAdvisoryPage: React.FC = () => {
//   const currentCloud: CloudState = useAppSelector(selectCloud);
//   const [showToast, setShowToast] = useState(false); // alert popUp
//   const [message, setMessage] = useState('');
//   const cloudData: any = useAppSelector(selectCommonConfig)
//   var processedData;
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     if (cloudData.advisoryData.length <= 0) {
//       Api.getData(testapi.advisory).then((response: any) => {
//         const arrayData = response;
//         processedData = processAdvisoryData(arrayData);
//         dispatch(setAdvisoryData(processedData));
//         dispatch(setFilteredAdvisoryData(processedData))
//         if (!currentCloud.currentCloud.length) {
//           let filteredCloudData: any = filterData("Cloud", processedData);
//           let availableCLouds = Object.keys(filteredCloudData);
//           availableCLouds.length > 0 &&
//             dispatch(setCloud(Object.keys(filteredCloudData)));
//         }
//       })
//     }else{
//       processedData = processAdvisoryData(cloudData.advisoryData);
//       let filteredCloudData: any = filterData("Cloud", processedData);
//       let tempDataStore = [];
  
//       if (Object.keys(filteredCloudData).length) {
//         currentCloud?.currentCloud?.forEach((selectedCloud: any) => {
//           if (filteredCloudData[selectedCloud]) {
//             tempDataStore.push(...filteredCloudData[selectedCloud]);
//           }
//         });
//       }
//       dispatch(setFilteredAdvisoryData(tempDataStore))
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     processedData = processAdvisoryData(cloudData.advisoryData);
//     let filteredCloudData: any = filterData("Cloud", processedData);
//     let tempDataStore = [];

//     if (Object.keys(filteredCloudData).length) {
//       currentCloud?.currentCloud?.forEach((selectedCloud: any) => {
//         if (filteredCloudData[selectedCloud]) {
//           tempDataStore.push(...filteredCloudData[selectedCloud]);
//         }
//       });
//     }
//     dispatch(setFilteredAdvisoryData(tempDataStore))
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentCloud]);

//   useEffect(() => {
//     if (!currentCloud.currentCloud.length) {
//       processedData = processAdvisoryData(cloudData.advisoryData);
//       let filteredCloudData: any = filterData("Cloud", processedData);
//       let availableCLouds = Object.keys(filteredCloudData);
//       availableCLouds.length > 0 &&
//         dispatch(setCloud(Object.keys(filteredCloudData)));
//     }
//   })
  
//   const showMessage = (msg) => {
//     setMessage(msg);
//   };
