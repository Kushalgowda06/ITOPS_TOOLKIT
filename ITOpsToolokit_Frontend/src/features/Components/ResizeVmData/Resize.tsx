// created this pop up data details for Resize VM page & VM Status Manager

import {
  faCircleCheck,
  faCircleXmark,
  faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { capitalizeFirstLetter } from "../../Utilities/capitalise";
import { Api } from "../../Utilities/api";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
  selectCommonConfig,
  setAwsSize,
} from "../CommonConfig/commonConfigSlice";
import testapi from "../../../api/testapi.json";
import { Loader } from "../../Utilities/Loader";
import {
  Autocomplete,
  TextField,Tooltip 
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const Resize = ({
  selectedData,
  pathname,
  cloud,
  load,
  isLoading,
  setIsLoading,
  handleSizeChange,
  handleClose,
  setStateAlert,
  showMod,
  setShowMod,
  setTicketId,
  setStatusData,
  navigate,
}) => {
  const [getAzureSize, setAzureSize] = useState<string[]>([""]);
  const [getGcpSize, setGcpSize] = useState<string[]>([""]);
  const [filteredData, setFilteredData] = useState([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [clickedButton, setClickedButton] = useState<string>("");
  const [Region, setRegion] = useState<string>("");
  const [RG, setRG] = useState<string>("");
  const [RId, setRId] = useState<string>("");
  const [SubscriptionID, setSubscriptionID] = useState<string>("");
  const [azureCost, setAzureCost] = useState("");
  const [awsCost, setAwsCost] = useState<any>();
  const [tempRegion, setTempRegion] = useState("");
  const [tempSize, setTempSize] = useState("");
  const [tempOS, setTempOS] = useState("");
  const cloudData = useAppSelector(selectCommonConfig);
  const prevCostRef = useRef(null);
  const dispatch = useAppDispatch();
  const userCapabilities = cloudData.loginDetails.capabilities.CloudOps[0];

  useEffect(() => {
    if (cloud === "AWS") {
      if (cloudData.AwsSize.length === 0) {
        Api.getCall(testapi.awssizetypes).then((response: any) => {
          dispatch(setAwsSize(response?.data));
        });
      }

      setRId(selectedData.map((item) => item.ResourceId).join(""));
      setRG("NA");
      setRegion(selectedData.map((item) => item.Region).join(""));
      setSubscriptionID("361568250748");
    } else if (cloud === "Azure") {
      Api.getCall(testapi.azuresizetypes).then((response: any) => {
        setAzureSize(response?.data);
      });
      setRId(selectedData.map((item) => item.Name).join(""));
      setRG(selectedData.map((item) => item.ResourceGroup).join(""));
      setRegion(selectedData.map((item) => item.Region).join(""));
      setSubscriptionID("aab65732-30e7-48a6-93c9-1acc5c8e4413");
    } else if (cloud === "GCP") {
      Api.getCall(testapi.gcpsizetype).then((response: any) => {
        setGcpSize(response?.data);
      });
      setRId(selectedData.map((item) => item.Name).join(""));
      setRG("NA");
      setRegion(selectedData.map((item) => item.Zone).join(""));
      setSubscriptionID("cis-icmp-engineering-v");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloud]);

  useEffect(() => {
    if (cloud && clickedButton.length > 0) {
      setIsLoading(true);
      try {
        Api.postData(testapi.start_stop_restart, {
          data: [
            {
              ResourceID: RId,
              ResourceGroup: RG,
              Region: Region,
              OperationName: clickedButton,
              Cloud: cloud,
              SubscriptionID: SubscriptionID,
            },
          ],
        }).then((data: any) => {
          setTicketId(data?.data.data.result.number);
          if (data?.status === 200) {
            setIsLoading(false);
            setShowMod(true);
          }
        });
      } catch (error) {
        console.error("error");
      }
    }
  }, [cloud, clickedButton]);

  const handleInputChange = (event, newValue) => {
    setInputValue(newValue);
    let filtered;
    if (cloud === "Azure") {
      filtered = getAzureSize.filter((item) =>
        item.toLowerCase().includes(newValue.toLowerCase())
      );
    } else if (cloud === "AWS") {
      filtered = cloudData.AwsSize.filter((item) =>
        item.toLowerCase().includes(newValue.toLowerCase())
      );
    } else if (cloud === "GCP") {
      filtered = getGcpSize.filter((item) =>
        item.toLowerCase().includes(newValue.toLowerCase())
      );
    }
    setFilteredData(filtered);
  };

  useEffect(() => {
    if (cloud === "AWS") {
      setFilteredData(cloudData.AwsSize);
    }
    if (cloud === "Azure") {
      setFilteredData(getAzureSize);
    } else if (cloud === "GCP") {
      setFilteredData(getGcpSize);
    }
  });

  handleSizeChange(inputValue);

  const isTerminatedOrStoppedOrDeallocated = (item) => {
    return (
      item === "TERMINATED" || item === "stopped" || item === "deallocated"
    );
  };
  if (
    clickedButton === "Stop" ||
    clickedButton === "Restart" ||
    clickedButton === "Start"
  ) {
    setStatusData(clickedButton);
    setStateAlert(true);
    if (!showMod) {
      // Api.setPopUpData(false)
      setTimeout(() => {
        navigate({
          pathname: "/Cloud-operations",
        });
      }, 900);
    }
  }

  const GetAzureCostData = (region, size) => {
    if (tempRegion !== region || tempSize !== size) {
      setTempRegion(region);
      setTempSize(size);
      setIsLoading(true);
      Api.getCall(
        `https://costdetails.azurewebsites.net/api/Cost4Sizes?region=${region}&size=${size}&code=v-f7i8y_XYUR2Uq_g2gCijLx_RORX-JOYeJpg7Vx7IQLAzFuKghPtQ==`
      ).then((response: any) => {
        setAzureCost(response.data);
        setIsLoading(false);
      });
    }
    if (azureCost) {
      return Object?.values(azureCost)?.length === 0
        ? "NA"
        : `$ ${(Number(Object?.values(azureCost)) * 720).toFixed(3)}`;
    }
  };
  const GetAwsCostData = (region, size, os) => {
    if (tempRegion !== region || tempSize !== size || tempOS !== os) {
      setTempRegion(region);
      setTempSize(size);
      setTempOS(os);
      setIsLoading(true);
      Api.getCall(
        `${testapi.baseURL}/aws_pricing/?Region=${region}&Type=${size}&OperatingSystem=${os}`
      ).then((response: any) => {
        setAwsCost(response.data.data);
        setIsLoading(false);
      });
    }
    if (awsCost) {
      return awsCost.length === 0
        ? "NA"
        : `$ ${Number(awsCost[0].Cost).toFixed(2)}`;
    }
  };

  const pricecalculator = (region, size, os, cloud) => {
    if (cloud === "AWS") {
      if (inputValue.length > 0) {
        const awstotalcost: any = GetAwsCostData(region, inputValue, os);

        return awstotalcost;
      }
    } else if (cloud === "Azure") {
      if (inputValue.length > 0) {
        const azuretotalcost: any = GetAzureCostData(region, inputValue);

        return azuretotalcost;
      }
    }
  };
  const defaultPrice = (region, size, os, cloud) => {
    if (cloud === "AWS") {
      if (inputValue.length === 0) {
        const awstotalcost: any = GetAwsCostData(region, size, os);
        prevCostRef.current = awstotalcost;
        return awstotalcost;
      } else {
        return prevCostRef.current;
      }
    } else if (cloud === "Azure") {
      if (inputValue.length === 0) {
        const azuretotalcost: any = GetAzureCostData(region, size);
        prevCostRef.current = azuretotalcost;
        return azuretotalcost;
      } else {
        return prevCostRef.current;
      }
    }
  };
  return (
    <>
      <Loader isLoading={isLoading} load={null} />
      <div className="d-flex justify-content-center">
        <div className="px-3">
          <p className=" text-muted fw-bold mb-0 nav-font">Operations</p>
          <p className="ps-4 text-muted tab">
            The ability to change the size of your VM based on the needs for
            CPU, Network or disk performance. When you start a VM, it goes from
            a stopped state to a running state.Stopping a VM means transitioning
            it from a running state to a stopped state.Restarting a VM combines
            the actions of stopping and starting.
          </p>
        </div>
      </div>
      <div>
        {selectedData.map((currele, key) => {
          return (
            <div className="container popup_content-width ps-md-5">
              <div className="row text-muted ps-md-5 tab">
                <div className="col-md-6 pb-2 ">
                  Name :{" "}
                  <Tooltip
                    title={capitalizeFirstLetter(currele.Name)}
                    placement="top"
                    arrow={true}
                    followCursor={true}
                    PopperProps={{
                      style: { zIndex: 9999 },
                    }}
                  >
                    <span className=" text-color fw-bold cursor-pointer ps-1">
                      {currele.Name.substring(0, 45)}
                      {currele.Name.length > 40 ? "..." : ""}
                    </span>
                  </Tooltip>
                </div>
                <div className="col-md-6 pb-2">
                  IPAddress :{" "}
                  <span className="text-color fw-bold">
                    {currele.IPAddress}
                  </span>
                </div>

                <div className="w-100"></div>

                {/* need to add condition to show pricing api data cost instead of data  */}

                <div className="col-md-6 ">
                  Region :{" "}
                  <span className="text-color fw-bold">
                    {capitalizeFirstLetter(currele.Region)}
                  </span>{" "}
                </div>
                <div className="col-md-6 ">
                  Environment :{" "}
                  <span className="text-color fw-bold">
                    {currele.Environment}
                  </span>
                </div>

                <div className="col-md-6 pt-2">
                  ResourceGroup :{" "}
                  <span className="text-color fw-bold">
                    {currele.ResourceGroup}
                  </span>
                </div>
                <div className="col-md-6 pt-2">
                  BU : <span className="text-color fw-bold">{currele.BU}</span>
                </div>
                {/**logic for hide current resize  inputValue==="" */}
                <div className="row align-items-center pt-1 pb-1">
                  <div
                    className={`
                     ${currele.Cloud === "AWS" ||
                        currele.Cloud === "Azure" ||
                        currele.Cloud === "GCP"
                        ? "col-lg-2 col-md-3"
                        : "col-lg-1 col-md-1 pe-0"
                      }`}
                  >
                    Size :{" "}
                    {currele.Cloud === "AWS" ||
                      currele.Cloud === "Azure" ||
                      currele.Cloud === "GCP" ? (
                      <Tooltip
                        title={capitalizeFirstLetter(currele.Size)}
                        placement="top"
                        arrow={true}
                        followCursor={true}
                        PopperProps={{
                          style: { zIndex: 9999 },
                        }}
                      >
                        <span className=" text-color fw-bold cursor-pointer ps-1">
                          {currele.Size.substring(0, 6)}
                          {currele.Size.length > 6 ? "..." : ""}
                        </span>
                      </Tooltip>
                    ) : (
                      <></>
                    )}
                  </div>

                  {pathname.includes("Vm-status-manager") ? (
                    <div className="   col-lg-4 col-md-3"></div>
                  ) : (
                    <div className="   col-lg-4 col-md-3 p-0 d-inline d-flex ">
                      {userCapabilities["Resize VM"].includes("Update") ? (
                        <>
                          <Autocomplete
                            disablePortal
                            disableClearable={inputValue === ""}
                            className="dropdown-width autocomplte-font-size"
                            disabled={currele?.source?.length === 0}
                            autoHighlight
                            loading={currele?.source?.length === 0}
                            id="autocomplete"
                            options={filteredData}
                            value={inputValue}
                            onInputChange={(
                              event: any,
                              newValue: string | null
                            ) => {
                              handleInputChange(event, newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                className=" autocomplte-font-size margin-test"
                                placeholder={"Enter size"}
                                sx={{ height: "32px", width: "180px" }}
                              />
                            )}
                          />
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  )}

                  <div className="col-lg-6 ps-md-4 col-md-6">
                    Application :{" "}
                    <span className="text-color fw-bold">
                      {currele.Application}
                    </span>
                  </div>
                </div>
                <div className="w-100"></div>

                {currele.Cloud === "AWS" || currele.Cloud === "Azure" ? (
                  <div className="col-md-6 pt-1 d-inline d-flex">
                    Cost :{" "}
                    <span className="text-color fw-bold ">
                      {/* prizing */}

                      {defaultPrice(
                        currele.Region,
                        currele.Size,
                        currele.OperatingSystem,
                        currele.Cloud
                      )}
                    </span>
                    <span>
                      {inputValue !== "" && (
                        <div className="d-inline  ">
                          <FontAwesomeIcon
                            fontSize={"14px"}
                            icon={faAngleDoubleRight}
                            className="cursor-pointer  pe-2 ps-2"
                          />
                          <span className="text-primary fw-bold ">
                            {" "}
                            {/* prizing */}
                            {pricecalculator(
                              currele.Region,
                              currele.Size,
                              currele.OperatingSystem,
                              currele.Cloud
                            )}
                          </span>
                        </div>
                      )}
                      <span className="text-muted ps-1 fw-bold ">
                        {" "}
                        per month
                      </span>
                    </span>
                  </div>
                ) : (
                  <div className="col-md-6 ">
                    Cloud :{" "}
                    <span className="text-color fw-bold">{currele.Cloud}</span>
                  </div>
                )}
                <div className="col-md-6 pt-1">
                  Owner :{" "}
                  <Tooltip
                    title={capitalizeFirstLetter(currele.Owner)}
                    placement="top"
                    arrow={true}
                    followCursor={true}
                    PopperProps={{
                      style: { zIndex: 9999 },
                    }}
                  >
                    <span className=" text-color fw-bold cursor-pointer ps-1">
                      {currele.Owner.substring(0, 23)}
                      {currele.Owner.length > 10 ? "..." : ""}
                    </span>
                  </Tooltip>
                </div>

                <div className="row align-items-center  pt-1">
                  <div className="col-md-6 d-flex align-items-center py-1 ">
                    State :
                    <span className="text-color fw-bold ps-1 ">
                      {isTerminatedOrStoppedOrDeallocated(currele.State) ? (
                        <FontAwesomeIcon
                          icon={faCircleXmark}
                          className="text-danger"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          className="text-success"
                        />
                      )}{" "}
                      {capitalizeFirstLetter(currele.State)}
                      {"  "}
                    </span>
                    {pathname.includes("Vm-status-manager") ? (
                      currele.State === "running" ||
                        currele.State === "RUNNING" ? (
                        <>
                          {userCapabilities["Restart VM"].includes("Update") ? (
                            <button
                              type="button"
                              className="btn btn-restart px-2  btn-sm ms-2 me-2"
                              onClick={() => setClickedButton("Restart")}
                            >
                              Restart
                            </button>
                          ) : (
                            <></>
                          )}
                          {userCapabilities["Stop VM"].includes("Update") ? (
                            <button
                              type="button"
                              className="btn btn-danger px-2 btn-danger-color  btn-sm"
                              onClick={() => setClickedButton("Stop")}
                            >
                              Stop
                            </button>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (
                        <>
                          {userCapabilities["Start VM"]?.includes("Update") ? (
                            <button
                              type="button"
                              className="btn btn-blue px-2 ms-2 btn-sm"
                              onClick={() => setClickedButton("Start")}
                            >
                              Start
                            </button>
                          ) : (
                            <></>
                          )}
                        </>
                      )
                    ) : (
                      ""
                    )}
                  </div>
                  {cloud === "AWS" || cloud === "GCP" ? (
                    <div className="col-md-6 ps-md-4 ">
                      ResourceId:{" "}
                      <span className="text-color fw-bold">
                        {currele.ResourceId}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
export default Resize;
