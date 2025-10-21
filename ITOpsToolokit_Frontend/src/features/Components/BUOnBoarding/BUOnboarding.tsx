import React, { useState, useEffect } from "react";
import { DialogActions, Breadcrumbs } from "@mui/material";
import { Button, Modal } from "react-bootstrap";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { Api } from "../../Utilities/api";
import { PopUpModal } from "../../Utilities/PopUpModal"
import testapi from "../../../api/testapi.json";
import CustomAutoComplete from "../../Utilities/CustomAutoComplete";
import { filterData } from "../../Utilities/filterData";
import { Loader } from "../../Utilities/Loader";
import {
  faArrowLeftLong,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectCommonConfig, setCloudData, setFilteredTaggingData } from "../CommonConfig/commonConfigSlice";
import RandomNumberGenerator from "../../Utilities/RandomNumberGenerator";

const BUOnboarding = () => {
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
  const [formData, setFormData] = useState<any>([
    {
      inputType: "text",
      ApiKey: "BuID",
      Title: "BU ID",
      value: uniqueId,
      description: "Please enter Business ID",
    },
    {
      inputType: "text",
      ApiKey: "BUName",
      Title: "BU Name",
      value: "",
      description: "Please enter Business Unit Name",
    },
    {
      inputType: "description",
      ApiKey: "Description",
      Title: "Description",
      value: "",
      description: "Please enter Description",
    },
    {
      inputType: "text",
      ApiKey: "BUOwner",
      Title: "BU Owner",
      value: "",
      description: "Please enter Business Unit Owner",
    },
    {
      inputType: "text",
      ApiKey: "BUSecondaryOwner",
      Title: "BU Secondary Owner",
      value: "",
      description: "Please enter Business Unit Secondary Owner",
    },
    {
      inputType: "number",
      ApiKey: "Budget",
      Title: "Budget per month",
      value: "",
      description: "Please enter Budget per month",
    },
    {
      inputType: "MultiMenus",
      ApiKey: "Applications",
      Title: "Applications",
      value: [],
      description: "Please select Applications",
    },
    {
      inputType: "MultiMenus",
      ApiKey: "Subscriptions",
      Title: "Subscriptions",
      value: [],
      description: "Please select Subscriptions",
    },
    {
      inputType: "MultiMenus",
      ApiKey: "Members",
      Title: "BU Members",
      value: [],
      description: "Please select BU Members",
    },
  ]);

  const cloudData = useAppSelector(selectCommonConfig);
  const userPermission = cloudData.loginDetails.capabilities.Onboarding[0]
  const pathname = location.pathname;
  const crumbs = !id
    ? { to: "/BU-onboarding", title: "BU Onboarding" }
    : { to: pathname, title: "BU update" };

  console.log("formData", formData)

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
      to="/onboarding/BU-onboarding-details"
      title="BU"
    >
      BU
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
      const apiEndPoints = ["mastersubscriptions", "Application", "users"];
      const apiPromises = apiEndPoints.map((type) =>
        Api.getData(testapi[type]).catch((error) => {
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
    Applications: Object.keys(filterData("AppName", data["Application"])),
    Subscriptions: Object.keys(
      filterData("SubscriptionID", data["mastersubscriptions"])
    ),
    Members: Object.keys(filterData("FullName", data["users"])),
  };

  const [dropdownsObject1, setDropDownsObject1] = useState<any>([]);
  const [dropdownsObject2, setDropDownsObject2] = useState<any>([]);


  console.log("dropdownsObject", data["Application"], data["mastersubscriptions"], data["users"])
  const hum = (newValue) => {
    console.log("newValue", newValue)

    let dataa = data["Application"]
    if (dataa) {
      let exist = []
      for (var i = 0; i < newValue.length; i++) {
        if (exist && exist.length > 0) {
          let ex1 = dataa.filter(item => {
            return item.AppName === newValue[i]
          })
          if (ex1 && ex1.length > 0) exist.push(...ex1)
        } else {
          exist = dataa.filter(item => {
            return item.AppName === newValue[i]
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
      setDropDownsObject2(sub)
      console.log("memb", memb, sub)


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
      <small className="text-danger">{showValidation ? `${data}` : ""}</small>
    );
  };

  const handleCancel = () => {
    // Reset the formData fields
    const resetFormFields = formData.map((field) => {
      if (field.inputType === "number") {
        return { ...field, value: "" };
      }
      return field.inputType === "MultiMenus"
        ? { ...field, value: [] }
        : { ...field, value: "" };
    });
    setFormData(resetFormFields);
    setShowValidation(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.getDataByID(testapi.BU, id);
        const updatedFormData = formData.map((field) => {
          if (response.hasOwnProperty(field.ApiKey)) {
            return { ...field, value: response[field.ApiKey] };
          }
          return field;
        });
        setFormData(updatedFormData);
      } catch (error) {
        return error;
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
        const response = !id
          ? Api.postData(testapi.BU, postBody)
          : Api.putData(testapi.BU, postBody, id);
        response
          .then((data) => {
            Api.getData(testapi.tagging).then((response: any) => {
              dispatch(setCloudData(response));
              dispatch(setFilteredTaggingData(response));
            });

            console.log("response : ", data);
          })
          .catch((error) => {
            console.error("Error : ", error);
          });
        handleCancel();
        setShowValidation(false);
        setShowModal(true);
        setModalMessage("Bu Onboarded Successfully!!");
      } catch (error) {
        setShowModal(true);
        setModalMessage(
          ` ${error} An error occurred while submitting the form.`
        );
      }
    } else {
      setShowModal(true);
      setShowValidation(true);
      setModalMessage("Please fill all the fields!!");
    }
  };

  return (
    <div className="m-2">
      <div className="p-2 bg-white onboarding-page-h">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center ps-2">
            <h4 className="p-2 ps-3 fw-bold k8title"> BU Onboarding </h4>
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
        <div className="d-flex justify-content-start pt-4 ms-5 p-2">
          <div className="launchStack ps-lg-5 ps-md-3 ms-lg-5 ms-md-0">
            <form className="row gy-2 align-items-center">
              {formData.map((curr: any, index: number) => {


                return (
                  <div className={`col-md-6 d-flex justify-content-start`}>
                    {curr.inputType == "text" ? (
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
                          className={`form-control form-control-m mt-2 ${!curr.value && showValidation
                            ? "border border-danger"
                            : ""
                            }`}
                          type={curr.inputType}
                          value={curr.value}
                          disabled={curr.ApiKey === "BuID"}
                          onChange={(event) => handleFormChange(index, event)}
                        />
                        <small className="form-text">{curr.description}</small>
                      </label>
                    ) : curr.inputType == "MultiMenus" ? (
                      // <div className="w-75">
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
                        {index === 6 ? <CustomAutoComplete
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
                        /> : (index === 7 ? <CustomAutoComplete
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
                          PaperStyle={{ width: 460, overflow: "auto" }}
                        />)
                        }



                        <small className="form-text description_font">{curr.description}</small>
                      </label>
                    ) : // </div>
                      curr.inputType == "number" ? (
                        <label className="form-label label-width w-75">
                          <div className="d-flex justify-content-between align-items-start">
                            <span>
                              {curr.Title} <span className="text-danger">*</span>{" "}
                            </span>
                            <span className="d-flex align-items-end">
                              <span>
                                {curr.value.length <= 0 && getValidationMessage(curr.description)}
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
                      ) : curr.inputType == "description" ? (
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
                          <textarea
                            className={`form-control form-control-m mt-2 ${!curr.value && showValidation
                              ? "border border-danger"
                              : ""
                              }`}
                            rows={1}
                            value={curr.value}
                            onChange={(event) => handleFormChange(index, event)}
                          />
                          <small className="form-text">{curr.description}</small>
                        </label>
                      ) : null}
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
                      className={
                        !id
                          ? `btn btn-outline-danger btn-width`
                          : "btn btn-outline-secondary btn-width"
                      }
                      onClick={() => (!id ? handleCancel() : navigate(-1))}
                    >
                      <strong>
                        {!id ? (
                          "Cancel"
                        ) : (
                          <FontAwesomeIcon icon={faArrowLeftLong} />
                        )}
                      </strong>
                    </button>
                  </div>
                  <div className="d-grid col-3 mx-auto px-2 py-3">
                    <button
                      type="button"
                      className="btn btn-outline-success btn-width"
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

export default BUOnboarding;
