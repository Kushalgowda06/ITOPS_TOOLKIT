import React, { useEffect, useState } from "react";
import kubernatesIcon from "../../../assets/Kubernetes 1.png";
import PopupWrapper from "../KubernetePopupWrapper/PopupWrapper";
import awsIcon from "../../../assets/awsIcon.png";
import azureIcon from "../../../assets/azureIcon.png";
import gcpIcon from "../../../assets/gcpIcon.png";
import { Breadcrumbs, TextField } from "@mui/material";
import { filterData } from "../../Utilities/filterData";
import SkeletonGrid from "../../Utilities/SkeletonGrid";
import { Loader } from "../../Utilities/Loader";
import CustomAutoComplete from "../../Utilities/CustomAutoComplete";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineKubernetes } from "react-icons/ai";
import { FaChevronRight } from "react-icons/fa";
import { PiCheckCircleFill } from "react-icons/pi";
import { MdCancel } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { Api } from "../../Utilities/api";
import { wrapIcon } from "../../Utilities/WrapIcons";

const KubernitiesWrapperCard = (props) => {
  const AiOutlineKubernetesIcon = wrapIcon(AiOutlineKubernetes);
  const FaChevronRightIcon = wrapIcon(FaChevronRight);
  const PiCheckCircleFillIcon = wrapIcon(PiCheckCircleFill);
  const MdCancelIcon = wrapIcon(MdCancel);
  const CiLocationOnIcon = wrapIcon(CiLocationOn);
  const CiSearchIcon = wrapIcon(CiSearch);


  const [openPopup, setOPenPopup] = useState(false);
  const [popupData, setPopupData] = useState();
  const [searchInput, setSearchInput] = useState("");
  const [selectedLocation, setSelectedLocation] = useState([]);
  const location = useLocation();
  const pathname = location.pathname;
  const lastPathSegment = location.pathname.split("/").pop();
  const [isLoading, setIsLoading] = useState(false);
  const [load, setLoad] = useState(false);
  

  const breadcrumbs = [
    <Link
      className="border-bottom border-primary fw-normal"
      to="/Cloud-operations"
      title="Cloud operations"
    >
      Cloud operations
    </Link>,
    <Link
      className="pe-auto border-bottom border-primary fw-normal"
      to={"/Cloud-operations/Kubernetes-cluster-manager"}
      title={`Kubernetes-cluster-manager`}
    >
      {"Kubernetes-cluster-manager"}
    </Link>,
    <Link
      className="pe-auto border-bottom border-primary fw-normal"
      to={pathname}
      title={`${lastPathSegment}`}
    >
      {lastPathSegment}
    </Link>,
  ];

  const ports = [
    ...new Set(
      props.data
        .map((item) => item?.IngressApplicationGateway[0]?.ports)
        .flat()
        .filter((port) => port !== undefined)
    ),
  ];
  const filteredData = props.data.filter((item) => {
    const isLocationMatch =
      !selectedLocation.length || selectedLocation.includes(item.Location);
    const isSearchMatch = Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchInput.toLowerCase())
    );

    return isSearchMatch && isLocationMatch;
  });

  const handlePopupClose = () => {
    // Api.setPopUpData(false)
    setOPenPopup(false);
  };

  const handleCardClick = (index) => {
    setLoad(true);
    setPopupData(filteredData[index]);
    setOPenPopup(true);
  };

  const iconSrc = (item) => {
    if (item === "AWS") {
      return awsIcon;
    } else if (item === "Azure") {
      return azureIcon;
    } else {
      return gcpIcon;
    }
  };
  useEffect(() => {
    filteredData.length === 0 ? setIsLoading(true) : setIsLoading(false);
  });

  return (
    <>
      {(filteredData.length === 0 && searchInput.length === 0) ? (
        <Loader load={load} isLoading={isLoading} />
      ) : (
        //  <SkeletonGrid rows={4} columns={3} height="100vh" waveAnimation={true} variant="rectangular" widthPercentage="100%" />
        <div className="p-2 h-100">
          <div className="h-100 bg_color p-2 k8-background">
            <div className=" row d-flex justify-content-between align-items-center">
              <div className="d-flex col-md-12 col-lg-8 col-xxl-9 align-items-center">
                <AiOutlineKubernetesIcon className="k8_logo" />
                <span className=" k8title fw-bolder pe-2">{props.title}</span>
                <span className="align-self-center pt-1">
                  <Breadcrumbs
                    className="d-flex justify-content-start align-items-center card-title fw-bold px-2"
                    separator={<FaChevronRightIcon className="text-primary pt-1" />}
                    aria-label="breadcrumb"
                  >
                    {breadcrumbs}
                  </Breadcrumbs>
                </span>
              </div>
              <div className="d-flex col-md-12 col-lg-4 mt-3 col-xxl-3 align-items-center">
                <div className="col d-flex justify-content-center align-items-center px-2">
                  <div className="px-3">
                    <CustomAutoComplete
                      options={Object.keys(filterData("Location", props.data))}
                      value={selectedLocation}
                      onChange={(event, newValue) => {
                        setSelectedLocation(newValue);
                      }}
                      error={false}
                      placeholder="Location"
                      TextFieldSx={{ width: 200 }}
                      id="multiple-limit-tags"
                      limitTags={2}
                    />
                  </div>
                  <div className="me-0">
                    <TextField
                      id="search-field"
                      // label="Search"
                      type="search"
                      placeholder="Search"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <CiSearchIcon className="text-primary search_icon" />
                        ),
                      }}
                      sx={{ width: 200 }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row d-flex px-5 py-5">
              {filteredData.map((item, index) => (
                <div className="d-flex col-md-6 col-lg-4 justify-content-between py-3 "
                  key={index}
                  // style={{ width: "360px" }}
                >
                  {/* <div className=" py-3" style={{ width: "30rem" }}> */}
                  <div
                    className="card cursor-pointer border-0 card-background  border-0 card_width rounded-4 text-white"
                    onClick={() => handleCardClick(index)}
                    // style={{ width: "310px" }}
                  >
                    <div className="card-body card-pad">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <img
                            src={iconSrc(item.Cloud)}
                            alt="Azure Logo"
                            className="cloudPing-size cloud-logo-shadow"
                          />
                          <span className="f-size card_f_size ps-2 fw-bold">
                            {item.Name}
                          </span>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="f-size card_f_size ps-1">{item.Location}</span>{" "}
                          <CiLocationOnIcon className="text-primary ml-2  location_icon" />
                        </div>
                      </div>
                      <br />
                      <span className="f-size card_f_size">
                        <span className="fw-bold">Version : </span>
                        {item.KubernetesVersion}
                      </span>
                      <br />
                      <span className="f-size card_f_size d-flex  align-items-center">
                        <span className="fw-bold">Status : </span>
                        {item.PowerState === "Running" ? (
                          <PiCheckCircleFillIcon className="text-success mx-1" />
                        ) : (
                          <MdCancelIcon className="text-danger mx-1" />
                        )}
                        {item.PowerState}
                      </span>
                      <span className="f-size card_f_size">
                        <span className="fw-bold">Nodes : </span>
                        {item.NodePoolInfo.length}
                      </span>
                    </div>
                  </div>
                  {/* </div> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {
        <PopupWrapper
          openPopup={openPopup}
          popupData={popupData}
          ports={ports}
          load={load}
          onClose={handlePopupClose}
        />
      }
    </>
  );
};

export default KubernitiesWrapperCard;
