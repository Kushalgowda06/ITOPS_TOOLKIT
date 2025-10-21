import React, { useState, useEffect } from "react";
import { Form, Modal } from "react-bootstrap";
import { DialogActions, Button, FormControl, Breadcrumbs } from "@mui/material";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { Api } from "../../Utilities/api";
import { PopUpModal } from "../../Utilities/PopUpModal"
import testapi from "../../../api/testapi.json";
import { filterData } from "../../Utilities/filterData";
import CustomAutoCompleteRadio from "../../Utilities/CustomAutoCompleteRadio";
import CustomAutoComplete from "../../Utilities/CustomAutoComplete";
import { Loader } from "../../Utilities/Loader";
import {
  faArrowLeftLong,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector,  useAppDispatch } from "../../../app/hooks";
import { selectCommonConfig , setCloudData, setFilteredTaggingData } from "../CommonConfig/commonConfigSlice";
import RandomNumberGenerator from "../../Utilities/RandomNumberGenerator";

const ApplicationOnboarding = () => {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showValidation, setShowValidation] = useState<any>(false);
  const [modalMessage, setModalMessage] = useState("");
  const [data, setData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const uniqueId = RandomNumberGenerator();
  const [isLoading, setIsLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [dropdownsObject1, setDropDownsObject1] = useState<any>([]);
  const [subDropdownsObject, setSubDropDownsObject] = useState<any>([]);
  const [appDropdownsObject, setAppDropdownsObject] = useState<any>([]);
  const [costDropdownsObject, setCostDropdownsObject] = useState<any>([]);

  const [formData, setFormData] = useState<any>([
    {
      inputType: "text",
      ApiKey: "AppID",
      Title: "Application ID",
      value: uniqueId,
      description: "Please enter Application ID"
    },
    {
      inputType: "text",
      ApiKey: "AppName",
      Title: "Application Name",
      value: "",
      description: "Please enter Application Name"
    },
    {
      inputType: "text",
      ApiKey: "AppPrimaryOwner",
      Title: "Application Primary Owner",
      value: "",
      description: "Please enter Application Primary Owner"
    },
    {
      inputType: "text",
      ApiKey: "AppSecondaryOwner",
      Title: "Application Secondary Owner",
      value: "",
      description: "Please enter Application Secondary Owner"
    },
    {
      inputType: "MultiMenus",
      ApiKey: "BusinessUnit",
      Title: "Business Unit",
      value: [],
      description: "Please select Business Unit"
    },
    {
      inputType: "MultiMenus",
      ApiKey: "Projects",
      Title: "Projects",
      value: [],
      description: "Please select Projects"
    },
    {
      inputType: "MultiMenus",
      ApiKey: "Subscriptions",
      Title: "Subscriptions",
      value: [],
      description: "Please select Subscriptions"
    },
    {
      inputType: "number",
      ApiKey: "Budget",
      Title: "Annual Budget",
      value: "",
      description: "Please enter Annual Budget"
    },
    {
      inputType: "radio",
      ApiKey: "CostCode",
      Title: "Cost Code",
      value: "",
      description: "Please select CostCode"
    },
    {
      inputType: "MultiMenus",
      ApiKey: "Members",
      Title: "Members",
      value: [],
      description: "Please select Members"
    },
  ]);

  const cloudData = useAppSelector(selectCommonConfig);
  const userPermission = cloudData.loginDetails.capabilities.Onboarding[0]
  const pathname = location.pathname;
  const crumbs = !id
    ? { to: "/application-onboarding", title: "Application Onboarding" }
    : { to: pathname, title: "Application update" };

  const breadcrumbs = [
    <Link
      className="border-bottom border-primary fw-normal"
      to="/onboarding"
      title="Onboarding"
    >
      Onboarding
    </Link>,
    <Link
      className="border-bottom border-primary fw-normal"
      to="/onboarding/application-onboarding-details"
      title="application"
    >
      application
    </Link>,
    <Link
      className="pe-auto border-bottom border-primary fw-normal"
      to={crumbs.to}
      title={crumbs.title}
    >
      {crumbs.title}
    </Link>,
  ];

  
  useEffect(() => {
    const fetchData = async () => {
      const apiEndPoints = ['users', 'mastersubscriptions', 'BU', 'project', 'costCode'];
      const apiPromises = apiEndPoints.map(type =>
        Api.getData(testapi[type]).catch(error => {
          console.error(`Error fetching data from ${type}:`, error);
          return null;
        })
      );
      const responses = await Promise.all(apiPromises);
      const responseData = responses.reduce((acc, response, index) => {
        if (response) {
          acc[apiEndPoints[index]] = response;
        }
        return acc;
      }, {});
      setData(responseData);
    };

    fetchData();
  }, []);

  const dropdownsObject = { "Members": Object.keys(filterData("FullName", data["users"])), "Subscriptions": Object.keys(filterData("SubscriptionID", data["mastersubscriptions"])), "BusinessUnit": Object.keys(filterData("BUName", data["BU"])), "CostCode": Object.keys(filterData("CostCode", data["costCode"])), "Projects": Object.keys(filterData("ProjectName", data["project"])) }

  

const hum = (newValue) => {
  let dataa = data["BU"]
  if (dataa) {
    let exist = []
    for (var i = 0; i < newValue.length; i++) {
      if (exist && exist.length > 0) {
        let ex1 = dataa.filter(item => {
          return item.BUName === newValue[i]
        })
        if (ex1 && ex1.length > 0) exist.push(...ex1)
      } else {
        exist = dataa.filter(item => {
          return item.BUName === newValue[i]
        })
      }
    }
    let memb = []
    let sub = []
    for (var i = 0; i < exist.length; i++) {
      memb.push(...exist[i].Members)
      sub.push(...exist[i].Subscriptions)
      }
    setDropDownsObject1(memb)
    setSubDropDownsObject(sub)


  }
  let dat = data["project"]
  if (dat) {
    let ex = []
    for (var i = 0; i < newValue.length; i++) {
      if (ex && ex.length > 0) {
        let ex1 = dat.filter(item => {
          return item.BusinessUnit === newValue[i]
        })
        if (ex1 && ex1.length > 0) ex.push(...ex1)
      } else {
        ex = dat.filter(item => {
          return item.BusinessUnit === newValue[i]
        })
      }
    }
    let project = ex.map((item ) => item.ProjectName)
    let costCode = ex.map((item ) => item.CostCode)
    setAppDropdownsObject(project)
    setCostDropdownsObject(costCode)


  }

}

  const handleFormChange = (index, event) => {
    if (userPermission[cloudData.activeOnboarding].includes("Update")) {
      let data = [...formData];
      data[index].value = event.target.value;
      setFormData(data);
    }
  };

  // Update isFormValid to also check dynamic fields
  const isFormValid = () => {
    const formFieldsValid = formData.every((field) => {
      if (field.inputType === "MultiMenus") {
        return field.value.length > 0;
      }
      return field.value !== "";
    });
    return formFieldsValid;
  };

  const getValidationMessage = (data: any) => {
    return (
      <small className="text-danger">
        {showValidation ? `${data}` : ""}
      </small>
    );
  };

  const handleCancel = () => {
    // Reset the formData fields
    const resetFormFields = formData.map((field) => {
      if (field.inputType === "number") {
        return { ...field, value: "" };
      }
      return field.inputType === "MultiMenus" ? { ...field, value: [] } : { ...field, value: "" };
    });
    setFormData(resetFormFields);
    setShowValidation(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.getDataByID(testapi.Application, id);
        const updatedFormData = formData.map((field) => {
          if (response.hasOwnProperty(field.ApiKey)) {
            return { ...field, value: response[field.ApiKey] };
          }
          return field;
        });
        setFormData(updatedFormData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    if (id) {
      fetchData();
    }
  }, []);


  var postBody = {};
  formData.forEach((element) => {
    postBody[element.ApiKey] = element.value;
  });
  const handleOnHide = () => {
    setIsLoading(false)
    setShowModal(false)
    }

  const handleFormSave = async () => {
    setIsLoading(true)
    if (isFormValid()) {
        try {
          const response = !id ? Api.postData(testapi.Application, postBody) : Api.putData(testapi.Application, postBody, id) 
          response.then(data => {
            Api.getData(testapi.tagging).then((response: any) => {
              dispatch(setCloudData(response));
              dispatch(setFilteredTaggingData(response));
            });
            console.log("response : ", data)
          })
          .catch(error => {
            console.error("Error : ", error)
          });
        handleCancel();
        setShowValidation(false);
        setShowModal(true);
        setModalMessage("Application Onboarded Successfully!!");
      } catch (error) {
        setShowModal(true);
        setModalMessage(` ${error} An error occurred while submitting the form.`);
      }
    } else {
      setIsLoading(false)
      setShowModal(true);
      setShowValidation(true);
      setModalMessage("Please fill all the fields!!");
    }
  };



  return (
    <div className="m-2">
      <div className="p-2 onboarding-page-h bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center ps-2">
            <h4 className="p-2 ps-3 fw-bold k8title"> Application Onboarding </h4>
            <span className="align-self-center">
              <Breadcrumbs
                className="d-flex justify-content-start align-items-center fw-bold px-2 card-title"
                separator={
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="text-primary pt-1"
                  />
                }
                aria-label="breadcrumb"
              >
                {breadcrumbs}
              </Breadcrumbs>
            </span>
          </div>
        </div>
        <div className="d-flex justify-content-start pt-5 ms-5 p-2">
          <div className="launchStack ps-5 ms-5">
            <form className="row gy-2 align-items-center">
              {formData.map((curr: any, index: number) => {
                return (
                  <div className={`col-md-6 d-flex justify-content-start`}>
                    {curr.inputType == "text" ?
                      (
                        <label className="form-label label-width w-75">
                          <div className="d-flex justify-content-between">
                            <span>
                              {curr.Title} <span className="text-danger">*</span>{" "}
                            </span>
                            <span className="d-flex align-items-end">
                              <span>
                                {curr.value.length <= 0 &&
                                  getValidationMessage(curr.description)}
                              </span>
                            </span>
                          </div>
                          {"  "}
                          <input
                            className={`form-control form-control-m mt-2 ${!curr.value && showValidation ? "border border-danger" : ""}`}
                            type={curr.inputType}
                            value={curr.value}
                            disabled={curr.ApiKey === "AppID"}
                            onChange={(event) => handleFormChange(index, event)}
                          />
                          <small className="form-text">{curr.description}</small>
                        </label>
                      ) : curr.inputType == "radio" ? (
                        <FormControl
                          className="w-75"
                          size="small"
                          required
                        >
                          <Form.Label className="w-100">
                            <div className="d-flex justify-content-between">
                              <span>
                                {curr.Title} <span className="text-danger">*</span>{" "}
                              </span>
                              <span className="d-flex  align-items-end">
                                <span>
                                  {
                                    curr.value.length <= 0 &&
                                    getValidationMessage(curr.description)}
                                </span>
                              </span>
                            </div>
                          </Form.Label>
                          <CustomAutoCompleteRadio
                            id="radio-autocomplete"
                            options={costDropdownsObject}
                            value={curr.value}
                            onChange={(newValue) => {
                              try {
                                if (newValue !== null && newValue !== undefined) {
                                  const updatedFormData = [...formData];
                                  updatedFormData[index].value = newValue;
                                  setFormData(updatedFormData);
                                }
                              } catch (error) {
                                console.error("Error updating form data:", error);
                              }
                            }}
                            error={false}
                            placeholder={curr.Title}
                          />
                          <small className="text-muted pt-1 form_text_des">
                            {curr.description}
                          </small>
                        </FormControl>
                      ) : curr.inputType == "MultiMenus" ? (
                        <label className="form-label label-width w-75">
                          <div className="d-flex justify-content-between pb-2">
                            <span>
                              {curr.Title} <span className="text-danger">*</span>{" "}
                            </span>
                            <span className="d-flex align-items-end">
                              <span>
                                {curr.value.length <= 0 &&
                                  getValidationMessage(curr.description)}
                              </span>
                            </span>
                          </div>
                          {/* <CustomAutoComplete
                            id="multiple-limit-tags"
                            limitTags={1}
                            options={dropdownsObject[curr.ApiKey]}
                            value={curr.value}
                            onChange={(event, newValue) => {
                              // Update the value of the current field when a new option is selected
                              const updatedFormData = [...formData];
                              updatedFormData[index].value = newValue;
                              setFormData(updatedFormData);
                            }}
                            placeholder={curr.Title}
                            error={false}
                          // TextFieldSx={{ height: 200 }}
                          /> */}

                        {index === 4 ? <CustomAutoComplete
                          id="multiple-limit-tags"
                          limitTags={1}
                          options={dropdownsObject[curr.ApiKey]}
                          value={curr.value}
                          onChange={(event, newValue) => {
                            // Update the value of the current field when a new option is selected
                            const updatedFormData = [...formData];
                            updatedFormData[index].value = newValue;
                            setFormData(updatedFormData);
                            hum(newValue)
                          }}
                          placeholder={curr.Title}
                          error={false}
                        // TextFieldSx={{ width: 200 }}
                        /> : (index === 6 ? <CustomAutoComplete
                          id="multiple-limit-tags"
                          limitTags={1}
                          options={subDropdownsObject}
                          value={curr.value}
                          onChange={(event, newValue) => {
                            // Update the value of the current field when a new option is selected
                            const updatedFormData = [...formData];
                            updatedFormData[index].value = newValue;
                            setFormData(updatedFormData);
                          }}
                          placeholder={curr.Title}
                          error={false}
                        // TextFieldSx={{ width: 200 }}
                        /> : (index === 5 ? <CustomAutoComplete
                          id="multiple-limit-tags"
                          limitTags={1}
                          options={appDropdownsObject}
                          value={curr.value}
                          onChange={(event, newValue) => {
                            // Update the value of the current field when a new option is selected
                            const updatedFormData = [...formData];
                            updatedFormData[index].value = newValue;
                            setFormData(updatedFormData);
                          }}
                          placeholder={curr.Title}
                          error={false}
                        // TextFieldSx={{ width: 200 }}
                        /> : <CustomAutoComplete
                          id="multiple-limit-tags"
                          limitTags={1}
                          options={dropdownsObject1}
                          value={curr.value}
                          onChange={(event, newValue) => {
                            // Update the value of the current field when a new option is selected
                            const updatedFormData = [...formData];
                            updatedFormData[index].value = newValue;
                            setFormData(updatedFormData);
                          }}
                          placeholder={curr.Title}
                          error={false}
                        // TextFieldSx={{ width: 200 }}
                        />))
                        }

                          <small className="text-muted pt-1 111">
                            {curr.description}
                          </small>
                        </label>
                      ) : curr.inputType == "number" ? (<label className="form-label label-width w-75">
                        <div className="d-flex justify-content-between align-items-start">
                          <span>
                            {curr.Title} <span className="text-danger">*</span>{" "}
                          </span>
                          <span className="d-flex align-items-end">
                            <span>
                              {curr.value.length <= 0 &&
                                getValidationMessage(curr.description)}
                            </span>
                          </span>
                        </div>
                        {"  "}
                        <input
                          className={`form-control form-control-m mt-2 ${!curr.value && showValidation ? "border border-danger" : ""}`}
                          type={curr.inputType}
                          value={curr.value}
                          onChange={(event) => handleFormChange(index, event)}
                          min="0"
                        />
                        <small className="form-text">{curr.description}</small>
                      </label>
                    ) : curr.inputType == "radio" ? (
                      <FormControl
                        className="w-75"
                        size="small"
                        required
                      >
                        <Form.Label className="w-100">
                        <div className="d-flex justify-content-between">
                          <span>
                            {curr.Title} <span className="text-danger">*</span>{" "}
                          </span>
                          <span className="d-flex  align-items-end">
                            <span>
                              {
                              curr.value.length <= 0 &&
                                getValidationMessage(curr.description)}
                            </span>
                          </span>
                        </div>
                      </Form.Label>
                      <CustomAutoCompleteRadio
                      id="radio-autocomplete"
                      options={dropdownsObject[curr.ApiKey]}
                      value={curr.value}
                      onChange={(newValue) => {
                        try {
                          if (newValue !== null && newValue !== undefined) {
                            const updatedFormData = [...formData];
                                updatedFormData[index].value = newValue;
                                setFormData(updatedFormData);
                          }
                        } catch (error) {
                          console.error("Error updating form data:", error);
                        }
                      }}
                      error={false}
                      placeholder={curr.Title}
                      PaperStyle={{ width: 460, overflow: "auto" }}
                    />
                        <small className="text-muted pt-1">
                          {curr.description}
                        </small>
                      </FormControl>
                    ) : curr.inputType == "MultiMenus" ? (
                      <label className="form-label label-width w-75">
                    <div className="d-flex justify-content-between pb-2">
                      <span>
                        {curr.Title} <span className="text-danger">*</span>{" "}
                      </span>
                      <span className="d-flex align-items-end">
                        <span>
                          {curr.value.length <= 0 &&
                            getValidationMessage(curr.description)}
                        </span>
                      </span>
                    </div>
                    <CustomAutoComplete
                      id="multiple-limit-tags"
                      limitTags={1}
                      options={dropdownsObject[curr.ApiKey]}
                      value={curr.value}
                      onChange={(event, newValue) => {
                        // Update the value of the current field when a new option is selected
                        const updatedFormData = [...formData];
                        updatedFormData[index].value = newValue;
                        setFormData(updatedFormData);
                      }}
                      placeholder={curr.Title}
                      error={false}
                      PaperStyle={{ width: 460, overflow: "auto" }}
                      // TextFieldSx={{ height: 200 }}
                    />
                    <small className="text-muted pt-1">
                        {curr.description}
                      </small>
                  </label>
                    ) : curr.inputType == "number" ? (<label className="form-label label-width w-75">
                    <div className="d-flex justify-content-between align-items-start">
                      <span>
                        {curr.Title} <span className="text-danger">*</span>{" "}
                      </span>
                      <span className="d-flex align-items-end">
                        <span>
                          {curr.value.length <= 0 &&
                            getValidationMessage(curr.description)}
                        </span>
                      </span>
                    </div>
                    {"  "}
                    <div className="input-group mt-2">
                      <span className="input-group-text">$</span>
                      <input
                        className={`form-control form-control-m ${!curr.value && showValidation ? "border border-danger" : ""}`}
                        type={curr.inputType}
                        value={curr.value}
                        onChange={(event) => handleFormChange(index, event)}
                        min="0"
                      />
                    </div>
                    <small className="form-text">
                      {!curr.value ? curr.description : `Budget per day is $ ${(curr.value / 365).toFixed(2)}`}
                    </small>
                  </label>) : null}
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
                      className={!id ? `btn btn-outline-danger btn-width` : "btn btn-outline-secondary btn-width"}
                      onClick={() => (!id ? handleCancel() : navigate(-1))}
                    >
                      <strong>{!id ? "Cancel" : <FontAwesomeIcon icon={faArrowLeftLong} />}</strong>
                    </button>
                  </div>
                  <div className="d-grid col-3 mx-auto px-2 py-3">
                    <button
                      type="button"
                      className="btn btn-outline-success btn-width "
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
     {isLoading ? <Loader load={load} isLoading={isLoading} /> : null } 
      <PopUpModal show={showModal} modalMessage={modalMessage} onHide={handleOnHide} />
    </div>
  );
};

export default ApplicationOnboarding;