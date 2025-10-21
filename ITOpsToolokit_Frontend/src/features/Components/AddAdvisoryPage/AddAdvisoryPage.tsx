// This is the add advisory form component, used in adding the advsiory only on the advisory page.

import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  DialogActions,
  FormControl,
  ListItemText,
  MenuItem,
  Radio,
  Select,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import useApi from "../../../customhooks/useApi";
import getSubscription from "../../../api/subscription";
import { KubernetesPopupWrapper } from "../KubernetesPopUp/KubernetesPopupWrapper";
import { Button, Modal } from "react-bootstrap";
import { Api } from "../../Utilities/api";
import { PopUpModal } from "../../Utilities/PopUpModal";
import testapi from "../../../api/testapi.json";

const AddAdvisoryPage = () => {
  const subscriptionData: any = useApi(getSubscription.getSubscription);
  const [Validation, setValidation] = useState<boolean>(false);
  const [showPopup, setShowPopup] = useState(false);
  const [visible, setvisible] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const [showValidation, setShowValidation] = useState<any>(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    subscriptionData.request();
  }, []);

  var formFeilds = [
    {
      inputType: "text",
      ApiKey: "AdvisoryID",
      Title: "Advisory ID",
      value: "",
    },
    {
      inputType: "dropdown",
      ApiKey: "Cloud",
      Title: "Cloud",
      dropdownValues: ["AWS", "GCP", "Azure"],
      selectedValues: [],
    },
    {
      inputType: "dropdown",
      ApiKey: "SubscriptionID",
      Title: "Subscription ID",
      dropdownValues: [],
      selectedValues: [],
    },
    {
      inputType: "text",
      ApiKey: "AdvisoryName",
      Title: "Advisory Name",
      value: "",
    },
    {
      inputType: "text",
      ApiKey: "ResourceName",
      Title: "Resource Name",
      value: "",
    },
    {
      inputType: "text",
      ApiKey: "Description",
      Title: "Description",
      value: "",
    },
    {
      inputType: "text",
      ApiKey: "Category",
      Title: "Category",
      value: "",
    },
    {
      inputType: "text",
      ApiKey: "AlertCriteria",
      Title: "Alert Criteria",
      value: "",
    },
    {
      inputType: "text",
      ApiKey: "RecommendedAction",
      Title: "Recommended Action",
      value: "",
    },
    {
      inputType: "text",
      ApiKey: "EstimatedMonthlySavings",
      Title: "Estimated Monthly Savings",
      value: "",
    },
    {
      inputType: "RepeatorField",
      ApiKey: "FlaggedResources",
      Title: "Flagged Resources",
      value: {},
    },
  ];

  var flaggedResourcesFields = [
    {
      inputType: "dropdown",
      ApiKey: "Region",
      Title: "Region",
      dropdownValues: ["AWS", "GCP", "Azure"],
      value: "",
    },
    {
      inputType: "dropdown",
      ApiKey: "ResourceID",
      Title: "Resource ID",
      dropdownValues: ["AWS", "GCP", "Azure"],
      value: "",
    },
    {
      inputType: "dropdown",
      ApiKey: "Status",
      Title: "Status",
      dropdownValues: ["AWS", "GCP", "Azure"],
      value: "",
    },
    {
      inputType: "text",
      ApiKey: "CostSaved",
      Title: "Cost Saved",
      dropdownValues: ["AWS", "GCP", "Azure"],
      value: "",
    },
  ];

  var aws = [
    {
      inputType: "dropdown",
      ApiKey: "Region",
      Title: "Region",
      dropdownValues: [
        "ap-south-1",
        "ap-northeast-2",
        "ap-southeast-1",
        "ap-southeast-2",
      ],
      selectedValues: [],
      value: "",
    },
    {
      inputType: "dropdown",
      ApiKey: "ResourceID",
      Title: "Resource ID",
      dropdownValues: ["São Paulo", "Rio de Janeiro", "Salvador"],
      selectedValues: [],
      value: "",
    },
    {
      inputType: "dropdown",
      ApiKey: "Status",
      Title: "Status",
      dropdownValues: ["New York", "San Francisco", "Austin", "Dallas"],
      selectedValues: [],
      value: "",
    },
    {
      inputType: "text",
      ApiKey: "CostSaved",
      Title: "Cost Saved",
      dropdownValues: ["AWS", "GCP", "Azure"],
      value: "",
    },
  ];

  var azure = [
    {
      inputType: "dropdown",
      ApiKey: "Region",
      Title: "Region",
      dropdownValues: [
        "ap-northeast-1",
        "ca-central-1",
        "eu-central-1",
        "eu-west-1",
      ],
      selectedValues: [],
      value: "",
    },
    {
      inputType: "dropdown",
      ApiKey: "ResourceID",
      Title: "Resource ID",
      dropdownValues: ["New York", "San Francisco", "Austin", "Dallas"],
      selectedValues: [],
      value: "",
    },
    {
      inputType: "dropdown",
      ApiKey: "Status",
      Title: "Status",
      dropdownValues: ["São Paulo", "Rio de Janeiro", "Salvador"],
      selectedValues: [],
      value: "",
    },
    {
      inputType: "text",
      ApiKey: "CostSaved",
      Title: "Cost Saved",
      dropdownValues: ["AWS", "GCP", "Azure"],
      value: "",
    },
  ];

  var gcp = [
    {
      inputType: "dropdown",
      ApiKey: "Region",
      Title: "Region",
      dropdownValues: ["eu-west-2", "sa-east-1", "us-east-1", "us-east-2"],
      selectedValues: [],
      value: "",
    },
    {
      inputType: "dropdown",
      ApiKey: "ResourceID",
      Title: "Resource ID",
      dropdownValues: ["New York", "San Francisco", "Austin", "Dallas"],
      selectedValues: [],
      value: "",
    },
    {
      inputType: "dropdown",
      ApiKey: "Status",
      Title: "Status",
      dropdownValues: ["São Paulo", "Rio de Janeiro", "Salvador"],
      selectedValues: [],
      value: "",
    },
    {
      inputType: "text",
      ApiKey: "CostSaved",
      Title: "Cost Saved",
      dropdownValues: ["AWS", "GCP", "Azure"],
      value: "",
    },
  ];

  const [formData, setFormData] = useState<any>(formFeilds);
  const [resForm, setResForm] = useState<any>(flaggedResourcesFields);
  const [selectedCloud, setSelectedCloud] = useState("");
  const [filtered, setFiltered] = useState([]);
  const subscript = subscriptionData?.data?.data;

  const getDropDownvalues = () => {
    if (
      subscriptionData.loading == false &&
      subscriptionData?.data?.data.length > 0
    ) {
      var subscriptionDropDownValues = subscriptionData?.data?.data.map(
        (curr: any, index: number) => {
          return curr.SubscriptionID;
        }
      );
    }
    let tempvar = [...formData];
    tempvar.forEach((curr: any) => {
      if (curr.ApiKey == "SubscriptionID") {
        curr.dropdownValues =
          filtered && filtered?.length > 0
            ? filtered
            : subscriptionDropDownValues;
      }
    });
    setFormData(tempvar);
  };

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: "250px",
        width: 250,
      },
    },
  };
  var tempData = [...formData];
  var flaggedIndex = tempData.findIndex(
    (curr) => curr.ApiKey === "FlaggedResources"
  );

  const handleAddFlaggedResource = () => {
    setvisible(true);
    let tempData = [...formData];
    let flaggedIndex = tempData.findIndex(
      (curr) => curr.ApiKey === "FlaggedResources"
    );
    tempData[flaggedIndex].value[
      Object.keys(tempData[flaggedIndex].value).length
    ] = flaggedResourcesFields;
    checkValidation();
  };

  const handleFormChange = (index, event) => {
    let data = [...formData];
    data[index].value = event.target.value;
    setFormData(data);
    checkValidation();
  };

  const handleFlaggedResourceChange = (objectKey, index, event) => {
    let data = [...formData];
    data[flaggedIndex].value[objectKey][index].value = event.target.value;
    let resData = [...resForm];
    resData[index].value = event.target.value;
    setResForm(resData);
    setFormData(data);
    checkValidation();
  };

  const handleClose = () => {
    setvisible(false);
    let data = [...formData];
    delete data[flaggedIndex].value[
      Object.keys(data[flaggedIndex].value).length - 1
    ];
    setFormData(data);
  };

  const checkValidation = () => {
    formData.forEach((curr: any, index: number) => {
      if (!curr.value) {
        setShowValidation(true);
        setIsFlaggedResourceFilled(true);
        setModalMessage("Please enter all the values");
      }
    });
  };

  const getValidationMessage = (data: any) => {
    return (
      <small className="text-danger">
        {" "}
        {Validation && showValidation ? ` Please  enter ${data}` : ""}{" "}
      </small>
    );
  };

  const [formError, setFormError] = useState("");
  const [isFlaggedResourceFilled, setIsFlaggedResourceFilled] = useState(false);

  const handleSave = () => {
    // Check if all required fields are filled
    const isAllFieldsFilled = flaggedResourcesFields.every((field, index) => {
      const fieldValue =
        formData[flaggedIndex].value[
          Object.keys(formData[flaggedIndex].value).length - 1
        ][index].value;
      return fieldValue && fieldValue.trim() !== "";
    });

    if (!isAllFieldsFilled) {
      setFormError("Please fill this field");
      setValidation(true);
      setShowValidation(true);
    } else {
      setvisible(false);
      setFormError("");
      setValidation(false);
      setIsFlaggedResourceFilled(false);
      setShowValidation(false);
    }
  };

  const handleFlaggedResourceRemove = (index: number) => {
    let data = [...formData];
    delete data[flaggedIndex].value[index];
    setFormData(data);
  };

  var postBody = {};
  formData.forEach((element) => {
    if (element.ApiKey == "FlaggedResources") {
      var allFlaggedResources = Object.values(element.value).map(
        (curr: any, index: number) => {
          let individualFlaggedResources = {};
          curr.forEach((resource) => {
            individualFlaggedResources[resource.ApiKey] = resource.value;
            individualFlaggedResources["IdentifiedOn"] = moment().format();
            individualFlaggedResources["LastObserved"] = moment().format();
            individualFlaggedResources["TicketNumber"] = "";
            individualFlaggedResources["TicketSysID"] = "";
            individualFlaggedResources["LastObservedOn"] = moment().format();
          });
          return individualFlaggedResources;
        }
      );
      postBody[element.ApiKey] = allFlaggedResources;
    } else {
      postBody[element.ApiKey] = element.value;
      postBody["AdvisoryStatus"] = "New";
    }
  });

  const handleFormSave = () => {
    checkValidation();
    setValidation(true);

    if (!Validation && !isFlaggedResourceFilled) {
      try {
        Api.postData(testapi.advisory, postBody).then((response: any) => {
          console.log(response, "response");
          if (response.data.message === "Data added successfully.") {
            setModalMessage("New Advisory submitted successfully!!");
          } // test check
        });
        handleCancel();
        setShowModal(true);
      } catch (error) {
        setShowModal(true);
        setModalMessage("Please fill all the fields!!");
      }
    } else {
      setShowModal(true);
      setModalMessage("Please fill all the fields!!");
    }
  };

  const handleCancel = () => {
    const resetFormFields = formFeilds.map((field) => {
      if (field.inputType === "dropdown") {
        return { ...field, selectedValues: [] };
      } else if (field.inputType === "RepeatorField") {
        return { ...field, value: {} };
      } else {
        return { ...field, value: "" };
      }
    });
    setFormData(resetFormFields);
    setShowValidation(false);
  };

  const handleDropdownChange = (index, event) => {
    setSelectedCloud(event.target.value);
    let data = [...formData];
    data[index].value = event.target.value;
    setFormData(data);
    checkValidation();
    var cloud = event.target.value;
    if (cloud === "AWS") {
      setResForm(aws);
      const filteredData = subscript?.filter((e) => {
        if (e.Cloud === "AWS") {
          return e.SubscriptionID;
        }
      });
      data.forEach((curr: any) => {
        if (curr.ApiKey == "SubscriptionID") {
          curr.value = "";
        }
      });
      let subId = [];
      for (let item of filteredData) {
        subId.push(item.SubscriptionID);
      }
      setFiltered(subId);
    } else if (cloud === "Azure") {
      setResForm(azure);
      const filteredData = subscript?.filter((e) => {
        if (e.Cloud === "Azure") {
          return e.SubscriptionID;
        }
      });
      data.forEach((curr: any) => {
        if (curr.ApiKey == "SubscriptionID") {
          curr.value = "";
        }
      });
      let subId = [];
      for (let item of filteredData) {
        subId.push(item.SubscriptionID);
      }
      setFiltered(subId);
    } else if (cloud === "GCP") {
      setResForm(gcp);
      const filteredData = subscript?.filter((e) => {
        if (e.Cloud === "GCP") {
          return e.SubscriptionID;
        }
      });
      data.forEach((curr: any) => {
        if (curr.ApiKey == "SubscriptionID") {
          curr.value = "";
        }
      });
      let subId = [];
      for (let item of filteredData) {
        subId.push(item.SubscriptionID);
      }

      setFiltered(subId);
    }
    setFormData(data);
    let tempvar = [...formData];
    tempvar.forEach((curr: any) => {
      if (curr.ApiKey == "SubscriptionID") {
        curr.dropdownValues = filtered;
      }
    });
    setFormData(tempvar);
  };

  interface CurrType {
    value: string;
  }

  return (
    <div className=" h-100 bg-white p-1 mx-2 my-2">
      <div className="p-2">
        <h4 className="p-2 ps-3 fw-bold k8title"> Add New Advisory </h4>
        <div className="d-flex justify-content-center h-100 bg-white p-2">
          <div className="launchStack   ps-md-0 ms-md-3 ps-5 ms-5">
            <form className="row gy-2  gx-2 align-items-center">
              {formData?.map((curr: any, index: number) => {
                return (
                  <div className={`col-md-6 d-flex justify-content-center`}>
                    {curr.inputType == "text" ? (
                      <label className="form-label label-width">
                        <div className="d-flex justify-content-between w-75">
                          <span>
                            {curr.Title} <span className="text-danger">*</span>{" "}
                          </span>
                          <span className="d-flex align-items-end">
                            <span>
                              {curr.value.length <= 0 &&
                                getValidationMessage(curr.Title)}{" "}
                            </span>
                          </span>
                        </div>
                        {"  "}
                        <input
                          className={`form-control form-control-m w-75 mt-1`}
                          type={curr.inputType}
                          value={curr.value}
                          onChange={(event) => handleFormChange(index, event)}
                        />
                        <small className="form-text">{curr.description}</small>
                      </label>
                    ) : curr.inputType == "dropdown" ? (
                      <>
                        <label className="form-label label-width">
                          <div>
                            <label className="form-label d-flex justify-content-between w-75">
                              <span>
                                {curr.Title}{" "}
                                <span className="text-danger">*</span>{" "}
                              </span>
                              <span className="d-flex align-items-end">
                                <span>
                                  {!curr.value &&
                                    getValidationMessage(curr.Title)}{" "}
                                </span>
                              </span>
                            </label>
                            <div className="input-group">
                              <FormControl
                                className="form-control form-control-m w-75"
                                size="small"
                                required
                              >
                                <Select
                                  className="h-75 form-control form-control-m w-75"
                                  labelId="demo-simple-select-autowidth-label"
                                  id="demo-simple-select-autowidth"
                                  value={curr.value}
                                  displayEmpty
                                  onChange={(event) => {
                                    handleDropdownChange(index, event);
                                  }}
                                  onClick={() => getDropDownvalues()}
                                  renderValue={(selected) => {
                                    if (!selected) {
                                      return (
                                        <div>
                                          <span className="dropdown-placeholder">
                                            Please select an option
                                          </span>
                                        </div>
                                      );
                                    }
                                    return (
                                      <span className="dropdown-list">
                                        {curr.value}
                                      </span>
                                    );
                                  }}
                                  MenuProps={MenuProps}
                                  multiple={false}
                                >
                                  {curr?.dropdownValues?.map(
                                    (InnerCurr: any, index: any) => {
                                      return (
                                        <MenuItem value={InnerCurr}>
                                          <Radio
                                            checked={curr.value === InnerCurr}
                                          />
                                          <ListItemText>
                                            {InnerCurr}
                                          </ListItemText>
                                        </MenuItem>
                                      );
                                    }
                                  )}
                                </Select>
                              </FormControl>
                            </div>
                          </div>
                        </label>
                      </>
                    ) : (
                      <>
                        {selectedCloud && (
                          <label className="form-label label-width">
                            <div>
                              <p> {curr.Title}</p>
                              <div className="w-75 input-group z_index">
                                {Object.values(curr.value).map(
                                  (curr: CurrType, index) => {
                                    return (
                                      <>
                                        <input
                                          name="members"
                                          type="text"
                                          id="members"
                                          className="rounded w-75 form-control form-control-sm my-1"
                                          value={curr[1].value}
                                        ></input>
                                        <div className="input-group-append ps-2 my-1">
                                          <span className="input-group-text bg-white ">
                                            <FontAwesomeIcon
                                              fontSize={"11px"}
                                              icon={faMinus}
                                              className="flex-shrink-1 py-1 cursor-pointer"
                                              onClick={() => {
                                                handleFlaggedResourceRemove(
                                                  index
                                                );
                                              }}
                                            />
                                          </span>
                                        </div>
                                      </>
                                    );
                                  }
                                )}
                              </div>
                              <span
                                className="d-flex justify-content-center my-2 input-group-text bg-white cursor-pointer w-75"
                                onClick={() => {
                                  handleAddFlaggedResource();
                                }}
                              >
                                <FontAwesomeIcon
                                  fontSize={"11px"}
                                  icon={faPlus}
                                  className="py-1 cursor-pointer"
                                />
                              </span>
                            </div>
                          </label>
                        )}
                        {visible ? (
                          <KubernetesPopupWrapper
                            title="Add Flagged Resources"
                            handleSave={handleSave}
                            handleClose={handleClose}
                          >
                            <div className="row lable_pad">
                              {resForm?.map((curr: any, index: number) => {
                                return (
                                  <div className=" col-md-6 col-lg-6 col-xxl-6">
                                    <label className="form-label label-width">
                                      <div>
                                        <label className="form-label d-flex justify-content-between w-75">
                                          <span>
                                            {curr.Title}{" "}
                                            <span className="text-danger">
                                              *
                                            </span>{" "}
                                          </span>
                                          <span className="d-flex align-items-end">
                                            <span>
                                              {!curr.value &&
                                                getValidationMessage(
                                                  curr.Title
                                                )}{" "}
                                            </span>
                                          </span>
                                        </label>

                                        <div className="input-group">
                                          <FormControl
                                            className="form-control form-control-m w-75"
                                            size="small"
                                            required
                                          >
                                            <Select
                                              className="h-75 form-control form-control-m w-75"
                                              labelId="demo-simple-select-autowidth-label"
                                              id="demo-simple-select-autowidth"
                                              value={curr.value}
                                              displayEmpty
                                              onChange={(event) =>
                                                handleFlaggedResourceChange(
                                                  Object.keys(
                                                    formData[flaggedIndex].value
                                                  ).length - 1,
                                                  index,
                                                  event
                                                )
                                              }
                                              renderValue={(selected) => {
                                                if (!selected) {
                                                  return (
                                                    <div>
                                                      <span className="dropdown-placeholder">
                                                        Please select an option
                                                      </span>
                                                    </div>
                                                  );
                                                }
                                                return (
                                                  <span className="dropdown-list">
                                                    {curr.value}
                                                  </span>
                                                );
                                              }}
                                              MenuProps={MenuProps}
                                              multiple={false}
                                            >
                                              {curr?.dropdownValues?.map(
                                                (
                                                  InnerCurr: any,
                                                  index: any
                                                ) => {
                                                  return (
                                                    <MenuItem value={InnerCurr}>
                                                      <Radio
                                                        checked={
                                                          curr.value ===
                                                          InnerCurr
                                                        }
                                                      />
                                                      <ListItemText>
                                                        {InnerCurr}
                                                      </ListItemText>
                                                    </MenuItem>
                                                  );
                                                }
                                              )}
                                            </Select>
                                          </FormControl>
                                        </div>
                                      </div>
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </KubernetesPopupWrapper>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </form>
            <div className="d-flex justify-content-center">
              <div className="col-8 m-4">
                <DialogActions>
                  <div className="d-grid col-3 mx-auto px-2 ">
                    <button
                      type="button"
                      className="btn btn-outline-danger footer_size"
                      onClick={handleCancel}
                    >
                      <strong>Cancel</strong>
                    </button>
                  </div>
                  <div className="d-grid col-3 mx-auto px-2 py-3">
                    <button
                      type="button"
                      className="btn btn-outline-success footer_size "
                      onClick={handleFormSave}
                    >
                      <strong>Save</strong>
                    </button>
                  </div>
                </DialogActions>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PopUpModal
        show={showModal}
        modalMessage={modalMessage}
        onHide={() => setShowModal(false)}
      />
    </div>
  );
};

export default AddAdvisoryPage;
