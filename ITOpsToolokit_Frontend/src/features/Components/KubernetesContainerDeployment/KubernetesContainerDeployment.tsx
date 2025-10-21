import React from "react";
import { Autocomplete, FormControl, TextField, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
  faAngleDoubleRight,
} from "@fortawesome/free-solid-svg-icons";
import Dropdown from "react-bootstrap/Dropdown";
import { capitalizeFirstLetter } from "../../Utilities/capitalise";
import { Loader } from "../../Utilities/Loader";
const KubernetesContainerDeployment = ({
  selectedData,
  isLoading,
  load,
  selectedContainerReg,
  handleChangeContainerReg,
  acrListData,
}) => {

  return (
    <>
     { isLoading ? <Loader isLoading={isLoading} load={load} />: null }
    <div className="d-flex justify-content-center">
    <div className="px-3">
      <p className=" text-muted nav-font fw-bold mb-0">Container Deployment</p>
      <p className="ps-4 text-muted tab">
      Azure Kubernetes Service (AKS) is a managed Kubernetes service that you can use to deploy and manage containerized applications. You need minimal container orchestration expertise to use AKS. AKS reduces the complexity and operational overhead of managing Kubernetes by offloading much of that responsibility to Azure.
      </p>
    </div>
  </div>
    <div>
      <div className="ps-4 ">
        {selectedData.map((currele, key) => {
          return (
            <div className="container popup_content-width  ps-lg-5 ps-md-4">
              <div className="row text-muted ps-lg-5 ps-md-4 tab">
                <div className="col-md-6 pb-1">
                    <span>Subscriptions ID : </span>
                    <span className="text-color fw-bold">
                        {/* {capitalizeFirstLetter(currele.Id).split('/')[2]} */}
                        <Tooltip
                        title={currele.Id.split('/')[2]}
                        placement="top"
                        arrow={true}
                        followCursor={true}
                        PopperProps={{
                        style: { zIndex: 9999 },
                        }}
                    >
                        <span className=" text-color fw-bold cursor-pointer ps-1">
                        {currele.Id.substring(0, 20)}
                        {currele.Id.length > 10 ? "..." : ""}
                        </span>
                    </Tooltip>
                    </span>
                </div>
                <div className="col-md-6">
                <span>ID : </span>
                 <span className="text-color fw-bold">
                    <Tooltip
                        title={currele.Id}
                        placement="top"
                        arrow={true}
                        followCursor={true}
                        PopperProps={{
                        style: { zIndex: 9999 },
                        }}
                    >
                        <span className=" text-color fw-bold cursor-pointer ps-1">
                        {currele.Id.substring(0, 35)}
                        {currele.Id.length > 10 ? "..." : ""}
                        </span>
                    </Tooltip>
                </span>
                </div>
                <div className="w-100"></div>
                <div className="col-md-6 pb-1">
                  <span>Cloud : </span>
                  <span className="text-color fw-bold">{currele.Cloud}</span>
                </div>
                <div className="col-md-6 pb-1">
                  <span>Resource Groups : </span>
                  <span className="text-color fw-bold">{currele.Id.split('/')[4]}</span>
                </div>
                <div className="col-md-6 ">
                  <span>Location : </span>
                  <span className="text-color fw-bold">
                    {capitalizeFirstLetter(currele.Location)}
                  </span>
                </div>
                <div className="col-md-6 pb-1">
                  <span>Type : </span>
                  <span className="text-color fw-bold">
                    {/* {capitalizeFirstLetter(`${currele.Id.split('/')[6]}/${currele.Id.split('/')[7]}`)} */}
                    <Tooltip
                        title={capitalizeFirstLetter(`${currele.Id.split('/')[6]}/${currele.Id.split('/')[7]}`)}
                        placement="top"
                        arrow={true}
                        followCursor={true}
                        PopperProps={{
                        style: { zIndex: 9999 },
                        }}
                    >
                        <span className=" text-color fw-bold cursor-pointer ps-1">
                        {(`${currele.Id.split('/')[6]}/${currele.Id.split('/')[7]}`).substring(0, 30)}
                        {(`${currele.Id.split('/')[6]}/${currele.Id.split('/')[7]}`).length > 10 ? "..." : ""}
                        </span>
                    </Tooltip>
                  </span>
                </div>
                <div className="col-md-6 pb-1">
                    <span>Status : </span>
                    <span className="text-color fw-bold">
                      {currele.PowerState === "Running" ? (
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          className="text-success"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faCircleXmark}
                          className="text-danger"
                        />
                      )}
                      <span> {currele.PowerState}</span>
                    </span>
                  </div>
                <div className="col-md-6 ">
                <span>Nodes : </span>
                    <span className="text-color fw-bold">
                        {currele.NodePoolInfo.length}
                    </span>
                </div>
                <div className="row align-items-center">
                  <div className="col-md-6 pb-1 d-flex ">
                    <div className="pe-2">Container Registry : </div>
                    {/* <span className="text-color fw-bold">
                      {currele.KubernetesVersion}
                    </span> */}
                    <div className="w-50">
                    <FormControl variant="outlined" className="form-control">
                        <Autocomplete
                            // id="combo-box-demo"
                            // freeSolo
                            // id="disable-clearable"
                            // disableClearable
                            // defaultValue={""}
                            options={acrListData.length > 0 ? acrListData[0].ContainerRegistry : ['']}
                            autoHighlight
                            value={currele.selectedContainerReg}
                            // onClick={() => handleChangeContainerReg(item)}
                            onChange={(event, newValue) => {
                                handleChangeContainerReg(newValue);
                            }}
                            // If subscriptionKeys is an array of strings, return the string itself
                            // getOptionLabel={(option) => option}
                            getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                            renderInput={(params) => (
                            <TextField
                            color="success"
                            autoFocus={true}
                            // label="Subscriptions"
                                {...params}
                                placeholder="Container Registry"
                                InputProps={{
                                ...params.InputProps,
                                type: "search",
                                }}
                                
                            />
                            )}
                        />
                        </FormControl>
                        </div>
                    {/* {acrListData.length > 0 && (
                      <Dropdown className="d-inline-flex ps-3 ">
                        <Dropdown.Toggle
                          id="dropdown-upgrade"
                          className="shadow border-0 text-white"
                          style={{
                            backgroundColor: "#066498",
                          }}
                        >
                            <span className="ps-5 ms-5 text-white">{currele.selectedContainerReg}</span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {acrListData[0].ContainerRegistry.map((item, index) => (
                            <Dropdown.Item
                              key={index}
                              className="border-bottom"
                              onClick={() => handleChangeContainerReg(item)}
                            //   disabled={currele.selectedContainerReg === item}
                            >
                              <span className="ps-1 pe-5" title={item}>{item}</span>
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    )} */}
                  </div>
                </div>
                <div className="w-100"></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
    </> );
};

export default KubernetesContainerDeployment;
