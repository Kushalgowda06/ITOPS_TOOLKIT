import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { TaggingStatus } from "../TaggingStatus/TaggingStatus";
import Treeview from "../Tree/Treeview";
import { Toast } from "react-bootstrap";
import { PopUpModal } from "../../Utilities/PopUpModal";
import { VscFilter } from "react-icons/vsc";
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
import {useNavigate } from "react-router-dom";
import { wrapIcon } from "../../Utilities/WrapIcons";

const TaggingPage: React.FC = () => {
  const VscFilterIcon = wrapIcon(VscFilter);  
  const currentCloud:CloudState = useAppSelector(selectCloud);
  const cloudData = useAppSelector(selectCommonConfig);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  
    const fetchTaggingData = useCallback(async () => {
      setError(null);
    try {
      const response: any = await Api.getData(testapi.tagging);
      dispatch(setCloudData(response));
      dispatch(setFilteredTaggingData(response));
      if (!currentCloud.currentCloud.length) {
        const filteredCloudData: any = filterData("Cloud", response);
        const availableClouds = Object.keys(filteredCloudData);
        if (availableClouds.length > 0) {
          dispatch(setCloud(availableClouds));
        }
      }
    } catch (error) {
      console.error("Error fetching tagging data:", error);
      setError("Failed to load tagging details.");
      setShowModal(true);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCloud.currentCloud, dispatch]);

  useEffect(() => {
    if (cloudData.cloudData.length <= 0) {
      fetchTaggingData();
    }
  }, [cloudData.cloudData.length, fetchTaggingData]);

  const filteredTaggingData = useMemo(() => {
    const filteredCloudData: any = filterData("Cloud", cloudData.cloudData);
    const tempDataStore: any[] = [];

    if (Object.keys(filteredCloudData).length && currentCloud?.currentCloud?.length > 0) {
      currentCloud.currentCloud.forEach((selectedCloud: string) => {
        tempDataStore.push(...(filteredCloudData[selectedCloud] || []));
      });
    } else if (!currentCloud.currentCloud.length && Object.keys(filteredCloudData).length > 0) {
      const availableClouds = Object.keys(filteredCloudData);
      if (availableClouds.length > 0) {
        dispatch(setCloud(availableClouds));
      }
      return cloudData.cloudData; // Show all if no cloud is selected initially
    }

    return tempDataStore;
  }, [cloudData.cloudData, currentCloud.currentCloud, dispatch]);

  useEffect(() => {
    dispatch(setFilteredTaggingData(filteredTaggingData));
  }, [filteredTaggingData, dispatch]);

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
      <div className="container-fluid mx-2 my-1">
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

        <div className="row  bg-light">
          <div className="col-lg-3 col-md-6  gx-2">
            <Tile>
              <TaggingStatus />
            </Tile>
          </div>
          <div className="col-lg-4  col-md-6 gx-2">
            <Tile className="container card">
              <UntaggedAging />
            </Tile>
          </div>
          <div className="col-lg-5 col-md-12 mt_md_2 gx-2">
            <Tile>
              <Treeview childrenString="29 Untagged" />
            </Tile>
          </div>
        </div>
        <div className="row col-row-2 mt-2">
          <div className="col-7 gx-2">
            <Tile>
              <TopUntagged />
            </Tile>
          </div>
          <div className="col-5 gx-2">
            <Tile>
              <ServiceNow />
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
            <Cloudtable />
          </div>
        </div>
      </div>
    </>
  );
};

export default TaggingPage;

/******************************** Before Optimization *************************/

// const TaggingPage = () => {
//   const currentCloud: CloudState = useAppSelector(selectCloud);
//   const cloudData = useAppSelector(selectCommonConfig);
//   const [showToast, setShowToast] = useState(false); // alert popUp
//   const [message, setMessage] = useState('');
//   const dispatch = useAppDispatch();
//   useEffect(() => {
//     if(cloudData.cloudData.length<=0){
//       Api.getData(testapi.tagging).then((response: any) => {
//         dispatch(setCloudData(response));
//         dispatch(setFilteredTaggingData(response))
        
//         if (!currentCloud.currentCloud.length) {
//           let filteredCloudData: any = filterData("Cloud", response);
//           let availableCLouds = Object.keys(filteredCloudData);
//           availableCLouds.length > 0 &&
//             dispatch(setCloud(Object.keys(filteredCloudData)));
//         }
//       })
//     }else{
//       if (!currentCloud.currentCloud.length) {
//         let filteredCloudData: any = filterData("Cloud", cloudData.cloudData);
//         let availableCLouds = Object.keys(filteredCloudData);
//         availableCLouds.length > 0 &&
//           dispatch(setCloud(Object.keys(filteredCloudData)));
//       }
//     }

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(()=>{
//     if (!currentCloud.currentCloud.length) {
//       let filteredCloudData: any = filterData("Cloud", cloudData.cloudData);
//       let availableCLouds = Object.keys(filteredCloudData);
//       availableCLouds.length > 0 &&
//         dispatch(setCloud(Object.keys(filteredCloudData)));
//     }
//   })


//   useEffect(() => {
//     let filteredCloudData: any = filterData("Cloud", cloudData.cloudData);
//     let tempDataStore = [];
//     if (Object.keys(filteredCloudData).length) {
//       currentCloud.currentCloud.forEach((selectedCloud: any) => {
//         tempDataStore.push(...filteredCloudData[selectedCloud]);
//       });
//     }

//     dispatch(setFilteredTaggingData(tempDataStore));
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [currentCloud]);

//   const showMessage = (msg) => {
//     setMessage(msg);
//   };
