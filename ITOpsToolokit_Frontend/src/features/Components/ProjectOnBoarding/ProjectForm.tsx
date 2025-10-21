import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { DialogActions, FormControl, Breadcrumbs } from "@mui/material";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { Api } from "../../Utilities/api";
import testapi from "../../../api/testapi.json";
import { filterData } from "../../Utilities/filterData";
import { PopUpModal } from "../../Utilities/PopUpModal"
import CustomAutoCompleteRadio from "../../Utilities/CustomAutoCompleteRadio";
import CustomAutoComplete from "../../Utilities/CustomAutoComplete";
import { Loader } from "../../Utilities/Loader";
import {
  faArrowLeftLong,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  useAppDispatch,useAppSelector } from "../../../app/hooks";
import { selectCommonConfig , setCloudData, setFilteredTaggingData } from "../CommonConfig/commonConfigSlice";
import RandomNumberGenerator from "../../Utilities/RandomNumberGenerator";

const ProjectForm = () => {
  const dispatch = useAppDispatch();
  const [showValidation, setShowValidation] = useState<any>(false);
  const [modalMessage, setModalMessage] = useState("");
  const [severity, setSeverity] = useState("")
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [data, setData] = useState([]);
  const [dropdownsObject1, setDropDownsObject1] = useState<any>([]);
  const [dropdownsObject2, setDropDownsObject2] = useState<any>([]);
  const [costDropdownsObject2, setCostDropdownsObject2] = useState<any>([]);


  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const uniqueId = RandomNumberGenerator();
  const [formData, setFormData] = useState<any>([
    {
      inputType: "text",
      ApiKey: "ProjectID",
      Title: "Project ID",
      value: uniqueId,
      description: "Please enter Project ID"
    },
    {
      inputType: "text",
      ApiKey: "ProjectName",
      Title: "Project Name",
      value: "",
      description: "Please enter Project Name"
    },
    {
      inputType: "radio",
      ApiKey: "BusinessUnit",
      Title: "BusinessUnit",
      value: "",
      description: "Please Select BusinessUnit"
    },
    {
      inputType: "text",
      ApiKey: "ProjectManager",
      Title: "Project Manager",
      value: "",
      description: "Please enter Project Manager"
    },
    {
      inputType: "number",
      ApiKey: "Budget",
      Title: "Budget per month",
      value: "",
      description: "Please enter Budget per month"
    },
    {
      inputType: "MultiMenus",
      ApiKey: "Subscriptions",
      Title: "Subscriptions",
      value: [],
      description: "Please select Subscriptions"
    },
    {
      inputType: "radio",
      ApiKey: "CostCode",
      Title: "Cost Code",
      value: "",
      description: "Please select Cost Code"
    },
    {
      inputType: "MultiMenus",
      ApiKey: "Members",
      Title: "Members",
      value: [],
      description: "Please select ProjectMembers"
    },
  ]);
  const cloudData = useAppSelector(selectCommonConfig);
  const userPermission = cloudData.loginDetails.capabilities.Onboarding[0]

  const pathname = location.pathname;
  const crumbs = !id ? { "to": "/project-onboarding", "title": "Project Onboarding" } : { "to": pathname, "title": "project update" }

  const breadcrumbs = [
    <Link className="border-bottom border-primary fw-normal" to='/onboarding' title="Onboarding">
      Onboarding
    </Link>,
    <Link className="border-bottom border-primary fw-normal" to='/onboarding/project-onboarding-details' title="Project details">
      Project
    </Link>,
    <Link className="pe-auto border-bottom border-primary fw-normal" to={crumbs.to} title={crumbs.title}>
      {crumbs.title}
    </Link>
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

  const dropdownsObject = {
    "Members": Object.keys(filterData("FullName", data["users"])),
    "Subscriptions": Object.keys(filterData("SubscriptionID", data["mastersubscriptions"])),
    "BusinessUnit": Object.keys(filterData("BUName", data["BU"])),
    "Projects": Object.keys(filterData("ProjectName", data["project"])),
    "CostCode": Object.keys(filterData("CostCode", data["costCode"]))
  }
  console.log("dropdownsObject", data["BU"])

  const hum = (newValue) => {
    let dataa = data["BU"]

    let ds = [newValue]
    console.log("newValue", ds)

    if (dataa) {
      let exist = []
      for (var i = 0; i < ds.length; i++) {
        if (exist && exist.length > 0) {
          let ex1 = dataa.filter(item => {
            return item.BUName === ds[i]
          })
          if (ex1 && ex1.length > 0) exist.push(...ex1)
        } else {
          exist = dataa.filter(item => {
            return item.BUName === ds[i]
          })
        }
      }
      console.log("dataa", dataa)
      console.log("exist", exist)

      let memb = []
      let sub = []
      for (var i = 0; i < exist.length; i++) {
        memb.push(...exist[i].Members)
        sub.push(...exist[i].Subscriptions)
      }
      setDropDownsObject1(memb)
      setDropDownsObject2(sub)


    }

    let dat = data["project"]
    if (dat) {
      let ex = []
      for (var i = 0; i < ds.length; i++) {
        if (ex && ex.length > 0) {
          let ex1 = dat.filter(item => {
            return item.BusinessUnit === ds[i]
          })
          if (ex1 && ex1.length > 0) ex.push(...ex1)
        } else {
          ex = dat.filter(item => {
            return item.BusinessUnit === ds[i]
          })
        }
      }
      let costCode = ex.map((item) => item.CostCode)
      setCostDropdownsObject2(costCode)


    }

  }
  console.log("nannna", data)

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
      if (field.inputType === "number" || field.inputType === "radio") {
        return { ...field, value: "" };
      }
      return field.inputType === "MultiMenus" ? { ...field, value: [] } : { ...field, value: "" };
    });
    setFormData(resetFormFields);
    setShowValidation(false);
  };
  // Fetch and show data according to the id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.getDataByID(testapi.project, id);
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
        const response = !id ? Api.postData(testapi.project, postBody) : Api.putData(testapi.project, postBody, id)
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
        setSeverity("success")
        setModalMessage("Project Onboarded Successfully!!");
      } catch (error) {
        setShowModal(true);
        setSeverity("error")
        setModalMessage(` ${error} An error occurred while submitting the form.`);
      }
    } else {
      setIsLoading(false)
      setShowModal(true);
      setShowValidation(true);
      setSeverity("error")
      setModalMessage("Please fill all the fields!!");
    }
  };

  return (
    <div className="m-2">
      <div className="p-2 onboarding-page-h bg_color">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center ps-2">
            <h4 className="p-2 ps-3 fw-bold k8title"> Project Onboarding </h4>
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
          <div className="launchStack ps-lg-5 ms-lg-5 ps-md-0 ms-md-4 ">
            <form className="row gy-2 align-items-center">
              {formData.map((curr: any, index: number) => {

                return (
                  <div className={`col-md-6 d-flex justify-content-start`}>
                    {curr.inputType === "text" ?
                      (
                        <label className="form-label label-width w-75">
                          <div className="d-flex justify-content-between">
                            <span>
                              {curr.Title} <span className="text-danger">*</span>{" "}
                            </span>
                            <span className="d-flex align-items-end">
                              <span>
                                {curr.value.length <= 0 &&
                                  getValidationMessage(curr.Title)}
                              </span>
                            </span>
                          </div>
                          {"  "}
                          <input
                            className={`form-control form-control-m mt-2 ${!curr.value && showValidation ? "border border-danger" : ""}`}
                            type={curr.inputType}
                            value={curr.value}
                            disabled={curr.ApiKey === "ProjectID"}
                            onChange={(event) => handleFormChange(index, event)}
                          />
                          <small className="form-text">{curr.description}</small>
                        </label>
                      ) : curr.inputType === "number" ? (<label className="form-label label-width w-75">
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
                          />
                      </div>
                        <small className="form-text">{curr.description}</small>
                      </label>
                      ) : curr.inputType === "number" ? (<label className="form-label label-width w-75">
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
                          onChange={(event) => handleFormChange(index, event)}
                        />
                        <small className="form-text">{curr.description}</small>
                      </label>) : curr.inputType === "radio" ? (
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
                          {index === 2 ? <CustomAutoCompleteRadio
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
                              hum(newValue)
                            }}
                            placeholder={curr.Title}
                            error={false}
                            PaperStyle={{ width: 370, overflow: "auto" }}
                          /> : <CustomAutoCompleteRadio
                            id="radio-autocomplete"
                            options={costDropdownsObject2}
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
                            placeholder={curr.Title}
                            error={false}
                            PaperStyle={{ width: 370, overflow: "auto" }}
                          />}
                          <small className="form-text form_text_des">{curr.description}</small>
                        </FormControl>
                      ) :
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
                          {index === 5 ? <CustomAutoComplete
                            id="multiple-limit-tags"
                            limitTags={1}
                            options={dropdownsObject2}
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
                          />}
                          <small className="form-text ">{curr.description}</small>
                        </label>}
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
      {isLoading ? <Loader load={load} isLoading={isLoading} /> : null}
      <PopUpModal show={showModal} modalMessage={modalMessage} onHide={handleOnHide} />
    </div>
  );
};

export default ProjectForm;