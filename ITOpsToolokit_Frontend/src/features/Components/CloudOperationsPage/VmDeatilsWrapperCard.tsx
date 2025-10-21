import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import awsIcon from "../../../assets/awsIcon.png";
import azureIcon from "../../../assets/azureIcon.png";
import gcpIcon from "../../../assets/gcpIcon.png";
import { filterData } from "../../Utilities/filterData";
import {
  FormControl,
  TextField,
  Autocomplete,
  Chip,
  Checkbox,
  Paper,
} from "@mui/material";
import { capitalizeFirstLetter } from "../../Utilities/capitalise";
import { Link, useLocation } from "react-router-dom";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import PopupWrapper from "../KubernetePopupWrapper/PopupWrapper";
import SkeletonGrid from "../../Utilities/SkeletonGrid";
import FilterCustomAutoComplete from "../../Utilities/FilterCustomAutoComplete";
import { Card } from "react-bootstrap";
import { Breadcrumbs } from "@mui/material";
import { VscFilter } from "react-icons/vsc";
import { CiSearch } from "react-icons/ci";
import { FaChevronRight } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { Loader } from "../../Utilities/Loader";
import { Api } from "../../Utilities/api";
import { wrapIcon } from "../../Utilities/WrapIcons";


const VmDeatilsWrapperCard = (props) => {
    const VscFilterIcon = wrapIcon(VscFilter);
    const FaChevronRightIcon = wrapIcon(FaChevronRight);
    const CiLocationOnIcon = wrapIcon(CiLocationOn);
    const CiSearchIcon = wrapIcon(CiSearch);
  
  const [openPopup, setOpenPopup] = useState(false);
  const [popupData, setPopupData] = useState();
  const [selectedApplication, setSelectedApplication] = useState([]);
  const [selectedBu, setSelectedBu] = useState([]);
  const [selectedCloud, setSelectedCloud] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState([]);
  const [selectedResourceGroup, setSelectedResourceGroup] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const location = useLocation();
  const ref = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [load,setLoad]=  useState(false);
  
  const pathname = location.pathname;

  const lastPathSegment = location.pathname.split('/').pop();

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
      to={pathname}
      title={`${lastPathSegment}`}
    >
      {lastPathSegment}
    </Link>,
  ];

  const handlePopupClose = () => {
    // Api.setPopUpData(false)
    setOpenPopup(false);
  };

  const filteredData = props.data.filter((item) => {
    const isSubscriptionID =
      !selectedSubscription.length ||
      selectedSubscription?.includes(item.SubscriptionID);
    const isApplicationMatch =
      !selectedApplication.length ||
      selectedApplication.includes(item.Application);
    const isResourceGroupMatch =
      !selectedResourceGroup.length ||
      selectedResourceGroup.includes(item.ResourceGroup);
    const isBU = !selectedBu.length || selectedBu.includes(item.BU);
    const isCloud = !selectedCloud.length || selectedCloud.includes(item.Cloud);
    const isSearchMatch = Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchInput.toLowerCase())
    );
    return (
      isSubscriptionID &&
      isApplicationMatch &&
      isResourceGroupMatch &&
      isSearchMatch &&
      isBU &&
      isCloud
      );
    });

  const handleCardClick = (index) => {
    setLoad(true)
    // Api.setPopUpData(true)
    setPopupData(filteredData[index]);
    setOpenPopup(true);
  };

  const isTerminatedOrStoppedOrDeallocated = (item) => {
    return (
      item === "TERMINATED" || item === "stopped" || item === "deallocated"
    );
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
    if (filteredData.length === 0) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [filteredData]);
  

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      var classlist = event.target.className;
      const cls = [
        "Mui-focused",
        "ps-2",
        "cursor-pointer",
        "MuiAutocomplete-listbox",
        "base-Popper-root",
        "MuiInputBase-root",
        "PrivateSwitchBase-input css-1m9pwf3",
        "MuiBox-root css-1flbre6",
        "MuiBox-root",
        "css-1flbre6"
      ];

      const clsNamecheck = cls.some((i) => classlist?.includes(i));
      if (ref.current && !ref.current.contains(event.target) && !clsNamecheck) {
        setShowDropdowns(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const [showDropdowns, setShowDropdowns] = useState(false); // New state to control dropdown visibility

  // Function to toggle dropdown visibility
  const toggleDropdowns = () => {
    setShowDropdowns(!showDropdowns);
  };

  return (
    <>
      {(filteredData.length === 0 && searchInput.length === 0) ? (
        <Loader load={props.load} isLoading={isLoading}
        />
      ) : (
        <div className="p-2">
          <div className="h-100 bg_color p-2">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center ps-2">
                <FontAwesomeIcon icon={props.icon} className="vmicon" />
                <span className="vmtitle pt-2 fw-bolder ">{props.title}</span>
              <span className="align-self-center pt-2">
              <Breadcrumbs
                     className="d-flex justify-content-start align-items-center fw-bold px-2 card-title"
                      separator={
                     <FaChevronRightIcon
                    className="text-primary pt-1"
                  />
                }
                aria-label="breadcrumb"
                >
                {breadcrumbs}
                </Breadcrumbs>
              </span>
              </div>
              <div className="d-flex align-items-center">
                <div className="col d-flex justify-content-center align-items-center px-2">
                  <VscFilterIcon
                    className=" filter_icon text-primary cursor-pointer"
                    onClick={toggleDropdowns} // Toggle dropdowns on click
                  />
                  <div className="px-2">
                    <TextField
                      id="search-field"
                      placeholder="Search"
                      className="seach_font"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      InputProps={{
                        endAdornment: (
                          <CiSearchIcon
                            className="text-primary search_icon"
                          />
                        ),
                      }}
                      sx={{ width: 190 }}
                    />
                  </div>
                </div>
              </div>
            </div>
            {showDropdowns && (
              <div className="d-flex justify-content-end">
                <Card className={`mb-3 d-flex flex-row-reverse filter_resp`} ref={ref}>
                  <Card.Body className="d-flex flex-wrap justify-content-end">
                    <span className="px-2">
                      <FilterCustomAutoComplete
                        options={Object.keys(filterData("SubscriptionID", props.data))}
                        selectCategory={"SubscriptionID"}
                        value={selectedSubscription}
                        setSelectedSubscription={setSelectedSubscription}
                        setSelectedCloud={setSelectedCloud}
                        setSelectedApplication={setSelectedApplication}
                        setSelectedResourceGroup={setSelectedResourceGroup}
                        setSelectedBu={setSelectedBu}
                        onChange={(event, newValue,reason) => {
                          if(reason === "removeOption"){
                            setSelectedSubscription(newValue);
                          }
                          if(event && event.length>0){
                            setSelectedSubscription(event);
                          }else{
                            setSelectedSubscription(newValue);
                          }
                        }}

                        TextFieldSx={{ width: 200 }}
                        id="multiple-limit-tags"
                        limitTags={1}
                        // renderTagsStyle={{ maxHeight: "27px", overflowY: "auto" }}
                        placeholder="SubscriptionID"
                        error={false}
                      />
                    </span>
                    <span className="px-2">
                      <FilterCustomAutoComplete
                        options={Object.keys(filterData("Cloud", props.data))}
                        selectCategory={"Cloud"}
                        value={selectedCloud}
                        setSelectedCloud={setSelectedCloud}
                        setSelectedApplication={setSelectedApplication}
                        setSelectedResourceGroup={setSelectedResourceGroup}
                        setSelectedBu={setSelectedBu}
                        setSelectedSubscription={setSelectedSubscription}
                        onChange={(event, newValue,reason) => {
                          if(reason === "removeOption"){
                            setSelectedCloud(newValue);
                          }
                          if(event && event.length>0){
                            setSelectedCloud(event);
                          }else{
                            setSelectedCloud(newValue);
                          }
                        }}

                        TextFieldSx={{ width: 200 }}
                        id="multiple-limit-tags"
                        limitTags={1}
                        // renderTagsStyle={{ maxHeight: "27px", overflowY: "auto" }}
                        placeholder="Cloud"
                        error={false}
                      />
                    </span>
                    <span className="px-2">
                      <FilterCustomAutoComplete
                        options={Object.keys(
                          filterData("Application", props.data)
                        )}
                        value={selectedApplication}
                        selectCategory={"Application"}
                        setSelectedCloud={setSelectedCloud}
                        setSelectedApplication={setSelectedApplication}
                        setSelectedResourceGroup={setSelectedResourceGroup}
                        setSelectedBu={setSelectedBu}
                        setSelectedSubscription={setSelectedSubscription}
                        // onChange={(event, newValue) => {
                        //   setSelectedApplication(newValue);

                        // }}
                        onChange={(event, newValue,reason) => {
                         
                          if(event && event.length>0){
                            setSelectedApplication(event);
                          }else{
                            setSelectedApplication(newValue);
                          }
                        }}
                        placeholder="Application"
                        error={false}
                        TextFieldSx={{ width: 200 }}
                        id="multiple-limit-tags"
                        limitTags={1}
                        // renderTagsStyle={{ maxHeight: "27px", overflowY: "auto" }}
                        // PaperComponent={({ children }) => (
                        //   <Paper
                        //     elevation={8}
                        //     style={{ width: 200, overflow: "auto" }}
                        //   >
                        //     {children}
                        //   </Paper>
                        // )}
                      />
                    </span>
                    <span className="px-2">
                      <FilterCustomAutoComplete
                        options={Object.keys(
                          filterData("ResourceGroup", props.data)
                        )}
                        value={selectedResourceGroup}
                        selectCategory={"ResourceGroup"}
                        setSelectedCloud={setSelectedCloud}
                        setSelectedApplication={setSelectedApplication}
                        setSelectedResourceGroup={setSelectedResourceGroup}
                        setSelectedBu={setSelectedBu}
                        setSelectedSubscription={setSelectedSubscription}
                        onChange={(event, newValue) => {
                          if(event && event.length>0){
                            setSelectedResourceGroup(event);
                          }else{
                            setSelectedResourceGroup(newValue);
                          }
                        }}
                        error={false}
                        placeholder="Resource Group"
                        TextFieldSx={{ width: 200 }}
                        id="multiple-limit-tags"
                        limitTags={2}
                        renderTagsStyle={{
                          maxHeight: "32px",
                          overflowY: "auto",
                        }}
                        PaperComponent={({ children }) => (
                          <Paper
                            elevation={8}
                            style={{ width: 200, overflow: "auto" }}
                          >
                            {children}
                          </Paper>
                        )}
                      />
                    </span>
                    <div className="px-2">
                      <FilterCustomAutoComplete
                        options={Object.keys(filterData("BU", props.data))}
                        value={selectedBu}
                        setSelectedCloud={setSelectedCloud}
                        setSelectedApplication={setSelectedApplication}
                        setSelectedResourceGroup={setSelectedResourceGroup}
                        setSelectedBu={setSelectedBu}
                        setSelectedSubscription={setSelectedSubscription}
                        selectCategory={"BU"}
                        onChange={(event, newValue) => {
                          if(event && event.length>0){
                            setSelectedBu(event);
                          }else{
                            setSelectedBu(newValue);
                          }
                        }}
                        error={false}
                        placeholder="BU"
                        TextFieldSx={{ width: 200 }}
                        id="multiple-limit-tags"
                        limitTags={2}
                        // renderTagsStyle={{ maxHeight: "32px", overflowY: "auto" }}
                        PaperComponent={({ children }) => (
                          <Paper
                            elevation={8}
                            style={{ width: 200, overflow: "auto" }}
                          >
                            {children}
                          </Paper>
                        )}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </div>
            )}
            {/* <div className="row row-cols-1 row-cols-md-4 g-0"> */}
            <div className="row d-flex ps-3 justify-content-around align-items-center">
              {filteredData.map((item, index) => (
                <div
                  key={index}
                  className="k8-card-container col-md-6 col-lg-4  col-xxl-4   py-3"
                  // style={{ width: "360px" }}
                >
                  <div
                    className="card title-card-background cardwidth cursor-pointer border-0 card-background  rounded-4 text-white"
                    // style={{ width: "310px" }}
                    onClick={() => handleCardClick(index)}
                  >
                    <div className="card-body card-pad">
                      <div className="d-flex justify-content-between align-items-center padding_bottom">
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
                          <span className="f-size  card_f_size pe-1">{item.Region}</span>
                          <CiLocationOnIcon
                            className="text-primary ml-2  location_icon"
                          />
                        </div>
                      </div>

                      <br />
                      <span className="f-size card_f_size">
                        <span className="fw-bold">ResourceGroup : </span>{" "}
                        {item.ResourceGroup}
                      </span>
                      <br />
                      {pathname.includes("/Vm-status-manager") ? (
                        <span>
                          <span className="f-size fw-bold">Status : </span>{" "}
                          {isTerminatedOrStoppedOrDeallocated(item.State) ? (
                            <FontAwesomeIcon
                              icon={faCircleXmark}
                              className="text-danger card_f_size f-size"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faCircleCheck}
                              className="text-success card_f_size f-size"
                            />
                          )}{" "}
                          <span className=" card_f_size f-size">
                            {capitalizeFirstLetter(item.State)}
                          </span>
                        </span>
                      ) : (
                        <span className=" card_f_size f-size">
                          <span className="fw-bold">Size : </span> {item.Size}
                        </span>
                      )}
                      <br />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {
        <PopupWrapper
          openPopup={openPopup}
          load={load}
          popupData={popupData}
          onClose={handlePopupClose}
        />
      }
    </>
  );
};

export default VmDeatilsWrapperCard;
