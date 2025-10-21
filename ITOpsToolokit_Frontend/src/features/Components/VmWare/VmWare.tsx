import React, { useEffect, useState } from "react";
import { Tabs, Tab, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import DialogActions from "@mui/material/DialogActions";
import windowsOS from "../../../assets/windowsOS.png";
import redhatOS from "../../../assets/redhatOS.jpg";
import centosOS from "../../../assets/centosOS.png";
import { PopUpModal } from "../../Utilities/PopUpModal"

const ITEM_HEIGHT = 125;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT,
      minWidth: '300px',
    },
  },
};

const VmWare = (props) => {
  const params = useParams();
  const [key, setKey] = useState("stackDetails");
  const [showModal, setShowModal] = useState(false);
  const [showValidation, setShowValidation] = useState<any>(false);
  const [modalMessage, setModalMessage] = useState("");
  const [vmcount, setVMcount] = useState(1);
  const [activekey, setActiveKey] = useState("1");

  const [formData, setFormData] = useState({
    "1": {
      stackDetails: [],
      stackTags: [],
    },
  });

  const feilds: any = [
    {
      name: "Virtual Machine hostname",
      type: "text",
      value: "",
    },
    {
      name: "Name validated via Naming convention portal",
      type: "text",
      value: "",
    },
    {
      name: "vCPU",
      type: "Select",
      dropDownValues: [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
      ],
      selectedValues: "",
    },
    {
      name: "# GB RAM",
      type: "Select",
      dropDownValues: [
        "2 GB",
        "4 GB",
        "6GB",
        " 18 GB",
        "32 GB",
        "64 GB",
        "128 GB",
        "256 GB",
        "512 GB",
      ],
      selectedValues: "",
    },
    {
      name: "VLAN ID NIC 0",
      type: "text",
      value: "",
   
    },
    {
      name: "NIC Type NIC0",
      type: "text",
      value: "",
   
    },
    {
      name: "Network type  NIC0",
      type: "text",
      value: "",
     
    },
    {
      name: "MAC Address (spoofing address)  NIC0",
      type: "text",
      value: "",
     
    },
    {
      name: "IP Address  NIC0",
      type: "text",
      value: "",
     
    },
    {
      name: "Gateway Address  NIC0",
      type: "text",
      value: "",
    
    },
    {
      name: "Patch possibilities",
      type: "text",
      value: "",
    
    },
    {
      name: "Patch exception #",
      type: "text",
      value: "",
    
    },
    {
      name: "Network/Subnet Mask  NIC0",
      type: "text",
      value: "",
    
    },
    {
      name: "Backup type",
      type: "Select",
      dropDownValues: [
        "Onetime backup to Rubrik",
        "Daily snapshot to Rubrik",
        "File to Rubrik (Agent will be installed)",
      ],
      selectedValues: "",
    },
    {
      name: "Patching schedule",
      type: "Select",
      dropDownValues: ["Group1", "Group2", "Group3"],
      selectedValues: "",
    },
    {
      name: "Operating System",
      type: "Select",
      selectedValues: "",
      dropDownValues: [
        { label: "CentOs 4", icon: centosOS },
        { label: "CentOs 5", icon: centosOS },
        { label: "CentOs 6", icon: centosOS },
        { label: "CentOs 7", icon: centosOS },
        { label: "CentOs 8", icon: centosOS },
        { label: "Red Hat Enterprise Linux 5", icon: redhatOS },
        { label: "Red Hat Enterprise Linux 6", icon: redhatOS },
        { label: "Red Hat Enterprise Linux 7", icon: redhatOS },
        { label: "Red Hat Enterprise Linux 8", icon: redhatOS },
        { label: "Red Hat Enterprise Linux 9", icon: redhatOS },
        { label: "Windows Server 2008", icon: windowsOS },
        { label: "Windows Server 2012", icon: windowsOS },
        { label: "Windows Server 2016", icon: windowsOS },
        { label: "Windows Server 2019", icon: windowsOS },
        { label: "Windows Server 2022", icon: windowsOS },
      ],
    },
    {
      name: "Backup required?",
      type: "radio",
      optionValues: ["yes", "no"],
      selectedValues: "",
    },
    {
      name: "License requested",
      type: "radio",
      optionValues: ["yes", "no"],
      selectedValues: "",
    },
  ];
  const tags: any = [
    {
      name: "Application",
      type: "text",
      value: "",
    },
    {
      name: "CostCenter",
      type: "text",
      value: "",
     
    },
    {
      name: "Environment",
      type: "text",
      value: "",
   
    },
    {
      name: "Support",
      type: "text",
      value: "",
   
    },
    {
      name: "AvailabilityTime",
      type: "text",
      value: "",
   
    },
    {
      name: "Owner",
      type: "text",
      value: "",
   
    },
    {
      name: "BU",
      type: "text",
      value: "",
   
    },
  ];

  const [fields, setFields] = useState<any>({
    details: feilds,
    tags: tags,
  });

  function ValidateIPaddress(ipaddress: any) {
    if (
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        ipaddress
      )
    ) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    setKey("stackDetails");
  }, [params]);

  const submitData = async () => {

    let allValues: any = [];
    let ipValidationFlag: any = false;
    setShowValidation(true);
    Object.keys(fields).forEach((currEle: any, index: number) => {
      fields[currEle].forEach((curr: any) => {
        let flag = curr.hasOwnProperty("selectedValues")
          ? curr?.selectedValues
          : curr?.value;
        allValues.push(flag);
        if (curr.name === "IP Address  NIC0" && !ValidateIPaddress(flag)) {
          ipValidationFlag = true;
        }
      });
    });



    if (ipValidationFlag) {
      setModalMessage("Please check the 'IP Address NIC0' format");
    } else if (allValues.includes("")) {
      setModalMessage("Please fill all the fields");
    } else {
      setModalMessage("submitted");
    }

    setShowModal(true);
  };

  const handleTabChange = (e: any) => {
    setKey(key === "stackDetails" ? "stackTags" : "stackDetails");
  };

  const handleChange = (
    event: any,
    index: any,
    key: any,
    activeKey: any
  ) => {
    const {
      target: { value },
    } = event;
    const tempStore = { ...fields };
    tempStore[key][index].selectedValues = value;
    setFields(tempStore);
    formData[activeKey] = { ...tempStore }
    setFormData({...formData});
  };

  const handleTextChange = (
    event: any,
    index: number,
    key: any,
    activeKey: any
  ) => {
    const {
      target: { value },
    } = event;
    const tempStore = { ...fields };
    tempStore[key][index].value = value;
    setFields(tempStore);
    formData[activeKey] = { ...tempStore }
    setFormData({...formData});
  };

  return (
    <div className=" VmWare-background text-white h-100 bg-white p-1 mx-2 my-2">
      <h4 className="p-2 ps-3 fw-bold"> {"Vm Ware"} </h4>
      <div>
        <div className="launchStack">
          <Tabs
            id="controlled-tab-example"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="px-3 mb-3 border-bottom-0"
          >
            <Tab eventKey="stackDetails" title="Stack Details">
              <form
                onSubmit={submitData}
                className="row gy-2 launchStackFormSpacing gx-4 align-items-center"
              >
                <div className={`col-6 d-flex justify-content-center`}>
                  <label className="form-label label-width">
                    No of VM's {"  "}
                    <span className="text-danger">*</span>
                    <input
                      onChange={(e) => setVMcount(parseInt(e.target.value))}
                      className={`form-control form-control-sm ${showValidation && vmcount < 1
                          ? "border border-danger"
                          : ""
                        }`}
                      type="number"
                      value={vmcount}
                    />
                  </label>
                </div>

                {fields?.details?.map((currentFeild: any, index: number) => {
                  switch (currentFeild.type) {
                    case "radio":
                      return (
                        <div className="col-6 d-flex ps-5 footer_size">
                          <div>
                            <div>{currentFeild.name}</div>
                            <div>
                              {currentFeild.optionValues.map(
                                (curr: any, innerIndex: number) => {
                                  return (
                                    <Form.Check
                                      inline
                                      label={curr}
                                      name={currentFeild.name}
                                      type={currentFeild.type}
                                      id={`inline-${currentFeild.type}-2`}
                                      onClick={(e) => {
                                        handleChange(
                                          e,
                                          index,
                                          "details",
                                          activekey
                                        );
                                      }}
                                    />
                                  );
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      );
                     
                    case "Select":
                      return (
                        <>
                          <div className="col-6 d-flex justify-content-center">
                            <label className="form-label label-width">
                              <FormControl className="w-100">

                                <span>{currentFeild.name} <span className="text-danger">*</span></span>
                                <Select
                                  className={`form-control form-control-sm ${showValidation &&
                                      currentFeild.selectedValues.length < 1
                                      ? "border border-danger"
                                      : ""
                                    }`}
                                  sx={{ height: "32px" }}
                                  labelId="demo-multiple-checkbox-label"
                                  id="demo-multiple-checkbox"
                                  displayEmpty
                                  value={currentFeild.selectedValues}
                                  renderValue={() => {
                                    if (
                                      currentFeild.selectedValues.length === 0
                                    ) {
                                      return (
                                        <span className="dropdown-placeholder">
                                          Select a Option
                                        </span>
                                      );
                                    }
                                    return (
                                      <span className="dropdown-list">
                                        {currentFeild.selectedValues}
                                      </span>
                                    );
                                  }}
                                  MenuProps={MenuProps}
                                  onChange={(e) =>
                                    handleChange(e, index, "details", activekey)
                                  }
                                >
                                  {currentFeild.dropDownValues.map((list) => {
                                    if (typeof list === "object") {
                                      return (
                                        <MenuItem
                                          key={list.label}
                                          value={list.label}
                                        >
                                          {/* <Checkbox checked={currentFeild.selectedValues.includes(list)} /> */}
                                          <img
                                          alt="cloud-icon"
                                            src={list.icon}
                                            className="cloud-icon p-1"
                                          />
                                          <ListItemText primary={list.label} />
                                        </MenuItem>
                                      );
                                    } else {
                                      return (
                                        <MenuItem key={list} value={list}>
                                          {/* <Checkbox checked={currentFeild.selectedValues.includes(list)} /> */}
                                          <ListItemText primary={list} />
                                        </MenuItem>
                                      );
                                    }
                                  })}
                                </Select>
                              </FormControl>
                            </label>
                          </div>
                        </>
                      );
                    
                    default:
                      return (
                        <>
                          <div
                            className={`col-6 d-flex justify-content-center`}
                          >
                            <label className="form-label label-width">
                              {currentFeild.name}
                              <span className="text-danger">*</span>
                              <input
                                onChange={(e) => {
                                  handleTextChange(
                                    e,
                                    index,
                                    "details",
                                    activekey
                                  );
                                }}
                                className={`form-control form-control-sm ${showValidation &&
                                    currentFeild.value.length < 1
                                    ? "border border-danger"
                                    : ""
                                  }`}
                                type={currentFeild.type}
                                value={currentFeild.value}
                              />
                              <small className="form-text">
                                {currentFeild.description}
                              </small>
                            </label>
                          </div>
                        </>
                      );
                  }
                })}
              </form>
              <div className="d-flex justify-content-center">
                <div className="col-10 m-4">
                  <DialogActions>
                    <div className="d-grid col-5 mx-auto px-2 ">
                      {key === "stackDetails" ? (
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                          }}
                          className="btn bg-white btn-outline-danger footer_size"
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          onClick={handleTabChange}
                          className="btn bg-white btn-outline-danger footer_size"
                        >
                          Back
                        </button>
                      )}
                    </div>
                    <div className="d-grid col-5 mx-auto px-2 py-3">
                      {key === "stackDetails" ? (
                        <button
                          onClick={(e) => {
                            handleTabChange(e);
                          }}
                          className="btn bg-white btn-outline-primary footer_size"
                        >
                          {"Next >"}
                        </button>
                      ) : (
                        <button
                          type="submit"
                          className="btn bg-white btn-outline-success footer_size"
                          onClick={(e) => {
                            handleTabChange(e);
                            if (parseInt(activekey) >= vmcount) {
                              submitData();
                            } else {
                              setActiveKey((parseInt(activekey) + 1).toString());
                            }
                          }}
                        >
                          {parseInt(activekey) === vmcount ? "Submit" : "Continue"}
                        </button>
                      )}
                    </div>
                  </DialogActions>
                </div>
              </div>
            </Tab>
            <Tab eventKey="stackTags" title="Stack Tags">
          <form className="row gy-2 launchStackFormSpacing gx-4 align-items-center">
                {fields?.tags?.map((currentFeild: any, index: number) => {
                  return (
                    <>
                      <div className={`col-6 d-flex justify-content-center`}>
                        <label className="form-label label-width">
                          {currentFeild.name}
                          <span className="text-danger">*</span>
                          <input
                            onChange={(e) => {
                              handleTextChange(e, index, "tags", activekey);
                            }}
                            className={`form-control form-control-sm ${showValidation && currentFeild.value.length < 1
                                ? "border border-danger"
                                : ""
                              }`}
                            type={currentFeild.type}
                       
                          />
                          <small className="form-text">
                            {currentFeild.description}
                          </small>
                        </label>
                      </div>
                    </>
                  );
                })}
              </form>
              <div className="d-flex justify-content-center">
                <div className="col-10 m-4">
                  <DialogActions>
                    <div className="d-grid col-5 mx-auto px-2 ">
                      {key === "stackDetails" ? (
                        <button
                          onClick={(event) => {
                            event.preventDefault();
                          }}
                          className="btn btn-outline-danger footer_size"
                        >
                          Cancel
                        </button>
                      ) : (
                        <button
                          onClick={handleTabChange}
                          className="btn bg-white btn-outline-danger footer_size"
                        >
                          Back
                        </button>
                      )}
                    </div>
                    <div className="d-grid col-5 mx-auto px-2 py-3">
                      {key === "stackDetails" ? (
                        <button
                          onClick={(e) => {
                            handleTabChange(e);
                          }}
                          className="btn bg-white btn-outline-primary footer_size"
                        >
                          {"Next >"}
                        </button>
                      ) : (
                        <button
                          className="btn bg-white btn-outline-success footer_size"
                          onClick={(e) => {
                            handleTabChange(e);
                            if (parseInt(activekey) >= vmcount) {
                              submitData();
                            } else {
                              setActiveKey((parseInt(activekey) + 1).toString());
                            }
                          }}
                        >
                          {parseInt(activekey) === vmcount ? "Submit" : "Continue"}

                        </button>
                      )}
                    </div>
                  </DialogActions>
                </div>
              </div>
            </Tab>
          </Tabs>
          <PopUpModal show={showModal} modalMessage={modalMessage} onHide={() => setShowModal(false)} />
        </div>
      </div>
    </div>
  );
};
export default VmWare;
