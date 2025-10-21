import React, { useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { faPlus, faMinus, faEdit, faChevronRight, faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DialogActions, Breadcrumbs } from "@mui/material";
import CustomAutoComplete from "../../Utilities/CustomAutoComplete";
import { KubernetesPopupWrapper } from "../KubernetesPopUp/KubernetesPopupWrapper";
import SnakeBarAlert from "../../Utilities/SnakeBarAlert";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { Api } from "../../Utilities/api";
import { Loader } from "../../Utilities/Loader";
import { PopUpModal } from "../../Utilities/PopUpModal"
import testapi from "../../../api/testapi.json";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { selectCommonConfig, setCloudData, setFilteredTaggingData } from "../CommonConfig/commonConfigSlice";

const UserForm = () => {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showValidation, setShowValidation] = useState<any>(false);
  const [modalMessage, setModalMessage] = useState("");
  const [searchInputProjects, setSearchInputProjects] = useState("");
  const [searchInputRoles, setSearchInputRoles] = useState("");
  const [filteredResultsProjects, setFilteredResultsProjects] = useState([]);
  const [invalidProjectInputs, setInvalidProjectInputs] = useState([]);
  const [selectedCloud, setSelectedCloud] = useState([]);
  const [showCloudPopup, setShowCloudPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [data, setData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeFieldIndex, setActiveFieldIndex] = useState(null);
  const [selectRoles, setSelectRoles] = useState([]);
  const [formData, setFormData] = useState<any>([
    {
      inputType: "text",
      ApiKey: "FirstName",
      Title: "First Name",
      value: "",
      description: "Please enter User First Name",
    },
    {
      inputType: "text",
      ApiKey: "LastName",
      Title: "Last Name",
      value: "",
      description: "Please enter User Last Name",
    },
    {
      inputType: "text",
      ApiKey: "FullName",
      Title: "Full Name",
      value: "",
      description: "Please enter User Full Name",
    },
    {
      inputType: "text",
      ApiKey: "UserName",
      Title: "UserName",
      value: "",
      description: "Please enter  UserName",
    },
    {
      inputType: "email",
      ApiKey: "EmailID",
      Title: "Email ID",
      value: "",
      description: "Please enter the User Email ID",
    },
    {
      inputType: "text",
      ApiKey: "ServiceNowID",
      Title: "ServiceNowID",
      value: "",
      description: "Please enter User ServiceNowID",
    },
    {
      inputType: "MultiMenus",
      ApiKey: "Projects",
      Title: "Projects",
      value: [],
      subscriptions: {},
    },
    {
      inputType: "MultiMenus",
      ApiKey: "Roles",
      Title: "Roles",
      value: [],
      rolesOptions: [],
    },
  ]);
  const [dynamicFields, setDynamicFields] = useState({
    Projects: [""],
    Roles: [""],
  });
  const cloudData = useAppSelector(selectCommonConfig);
  const userPermission = cloudData.loginDetails.capabilities.Onboarding[0]

  const pathname = location.pathname;
  const crumbs = !id
    ? { to: "/user-onboarding", title: "User Management" }
    : { to: pathname, title: "user update" };

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
      to="/onboarding/user-onboarding-details"
      title="user"
    >
      user
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
      const apiEndPoints = ["roles", "project", "mastersubscriptions"];
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

  const validateAndHighlightField = (fieldApiKey, formData, apiData) => {
    if (fieldApiKey === "Projects") {
      const formValues =
        formData.find((field) => field.ApiKey === fieldApiKey)?.value || [];
      const apiValues = apiData.map((item) => item.ProjectName);
      const invalidIndices = formValues.reduce((acc, value, index) => {
        if (!apiValues.includes(value)) {
          acc.push(index);
        }
        return acc;
      }, []);

      if (fieldApiKey === "Projects") {
        setInvalidProjectInputs(invalidIndices);
      }

      if (invalidIndices.length > 0) {
        setShowModal(true);
        setModalMessage(`The ${fieldApiKey} do not match the API data.`);
        return false;
      }
    }
    return true;
  };

  const handleFormChange = (index, event) => {
    if (userPermission[cloudData.activeOnboarding].includes("Update")) {
      let data = [...formData];
      data[index].value = event.target.value;
      setFormData(data);
    }
  };

  const handleDynamicFieldChange = (fieldKey, index, event) => {
    const updatedFields = {
      ...dynamicFields,
      [fieldKey]: dynamicFields[fieldKey].map((value, i) =>
        i === index ? event.target.value : value
      ),
    };
    setDynamicFields(updatedFields);

    const fieldIndex = formData.findIndex((field) => field.ApiKey === fieldKey);
    if (fieldIndex !== -1) {
      let updatedFormData = [...formData];
      updatedFormData[fieldIndex].value = updatedFields[fieldKey];
      setFormData(updatedFormData);
    }

    if (fieldKey === "Projects" && data["project"]) {
      setSearchInputProjects(event.target.value);
      const filteredDataProjects = data["project"].filter((item) =>
        item.ProjectName?.toLowerCase().includes(
          event.target.value.toLowerCase()
        )
      );
      setFilteredResultsProjects(filteredDataProjects);
    }
    if (fieldKey === "Roles" && data["project"]) {
      setSearchInputRoles(event.target.value);
      const filteredDataProjects = data["project"].filter((item) =>
        item.ProjectName?.toLowerCase().includes(
          event.target.value.toLowerCase()
        )
      );
      setFilteredResultsProjects(filteredDataProjects);
    }

    // Set the active field index when a field is focused
    if (event.type !== "focus") {
      setActiveFieldIndex(index);
    }
  };

  useEffect(() => {
    let updatedFormData = [...formData];
    const projectFieldIndex = updatedFormData.findIndex(
      (field) => field.ApiKey === "Projects"
    );
    if (projectFieldIndex !== -1) {
      updatedFormData[projectFieldIndex].value = dynamicFields.Projects;
    }
    setFormData(updatedFormData);
  }, [dynamicFields]);

  //  handler for adding a new dynamic field
  const handleAddDynamicField = (fieldKey) => {
    const lastValue =
      dynamicFields[fieldKey][dynamicFields[fieldKey].length - 1];
    if (lastValue !== "") {
      setDynamicFields({
        ...dynamicFields,
        [fieldKey]: [...dynamicFields[fieldKey], ""],
      });
    }
  };

  //  handler for removing a dynamic field
  const handleRemoveDynamicField = (fieldKey, index) => {
    const updatedFields = {
      ...dynamicFields,
      [fieldKey]: dynamicFields[fieldKey].filter((_, i) => i !== index),
    };
    setDynamicFields(updatedFields);

    // Also remove the project from the formData subscriptions
    if (fieldKey === "Projects") {
      const projectToRemove = dynamicFields[fieldKey][index];
      let updatedFormData = [...formData];
      const projectFieldIndex = updatedFormData.findIndex(
        (field) => field.ApiKey === "Projects"
      );
      if (projectFieldIndex !== -1) {
        // Remove the project from the value array
        updatedFormData[projectFieldIndex].value = updatedFormData[
          projectFieldIndex
        ].value.filter((projectName) => projectName !== projectToRemove);
        // Remove the project from the subscriptions object
        if (
          updatedFormData[projectFieldIndex].subscriptions &&
          updatedFormData[projectFieldIndex].subscriptions[projectToRemove]
        ) {
          delete updatedFormData[projectFieldIndex].subscriptions[
            projectToRemove
          ];
        }
        setFormData(updatedFormData);
      }
    }
  };

  // Update isFormValid to also check dynamic fields
  const isFormValid = () => {
    const formFieldsValid = formData.every((field) => field.value);
    const dynamicFieldsValid = Object.values(dynamicFields).every(
      (fieldArray) => fieldArray.every((value) => value !== "")
    );
    return formFieldsValid && dynamicFieldsValid;
  };

  const getValidationMessage = (data: any) => {
    return (
      <small className="text-danger">
        {showValidation ? ` Please  enter ${data}` : ""}
      </small>
    );
  };

  const handleCancel = () => {
    const resetFormFields = formData.map((field) => {
      if (field.inputType === "MultiMenus" && field.ApiKey === "Projects") {
        return { ...field, value: [], subscriptions: {} };
      }
      return { ...field, value: field.inputType === "MultiMenus" ? [] : "" };
    });
    setFormData(resetFormFields);

    const resetDynamicFields = {
      ...dynamicFields,
      Projects: [""],
    };
    setDynamicFields(resetDynamicFields);
    setShowValidation(false);
  };

  function transformDataToDesiredFormatV2(currentData) {
    const result = {};
    Object.entries(currentData).forEach(([projectName, cloudData]) => {
      const projectClouds = {};
      Object.entries(cloudData).forEach(([cloudName, subscriptions]) => {
        const cloudSubscriptions = subscriptions.reduce((acc, subscription) => {
          const subName = Object.keys(subscription)[0];
          const subId = subscription[subName];
          acc[subName] = subId;
          return acc;
        }, {});
        if (!projectClouds[cloudName]) {
          projectClouds[cloudName] = [cloudSubscriptions];
        } else {
          projectClouds[cloudName].push(cloudSubscriptions);
        }
      });
      result[projectName] = [projectClouds];
    });
    return [result];
  }

  const menuList = formData.find((item) => item.ApiKey === "Projects");
  const transformedData = transformDataToDesiredFormatV2(
    menuList.subscriptions
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.getDataByID(testapi.users, id);
        parseAndPopulateProjects(response.Projects);
        parseAndPopulateRoles(response.Roles);
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

  postBody["Projects"] = transformedData;

  Object.entries(dynamicFields).forEach(([key, values]) => {
    if (key !== "Projects") {
      postBody[key] = values.filter(
        (value) => typeof value === "string" && value.trim() !== ""
      );
    }
  });

  const projectsIndex = formData.findIndex(
    (element) => element.ApiKey === "Projects"
  );
  if (projectsIndex !== -1) {
    formData[projectsIndex].value = transformedData;
  }

  const rolesFieldIndex = formData.findIndex(
    (field) => field.ApiKey === "Roles"
  );
  if (rolesFieldIndex !== -1) {
    let transformedRoles = {};
    formData[rolesFieldIndex].rolesOptions.forEach((roleOption) => {
      const projectKey = Object.keys(roleOption)[0]; // Get the project identifier
      transformedRoles[projectKey] = roleOption[projectKey]; // Assign the roles array to the project key
    });
    postBody["Roles"] = [transformedRoles];
  }

  const handleOnHide = () => {
    setIsLoading(false)
    setShowModal(false)
  }

  const handleFormSave = async () => {
    setIsLoading(true)
    if (isFormValid()) {
      if (
        !validateAndHighlightField("ProjectName", formData, data["project"])
      ) {
        return;
      }
      try {
        const response = !id
          ? Api.postData(testapi.users, postBody)
          : Api.putData(testapi.users, postBody, id);
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
        setModalMessage("User Onboarded Successfully!!");
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

  console.log("formData : ", formData);

  useEffect(() => {
    if (showCloudPopup) {
      const filtered = data["mastersubscriptions"].filter((item) =>
        selectedCloud.includes(item.Cloud)
      );
      const formattedSubscriptions = filtered.map(
        (item) => `${item.SubscriptionName} - ${item.SubscriptionID}`
      );
      const uniqueSubscriptions = [...new Set(formattedSubscriptions)];
      setFilteredSubscriptions(uniqueSubscriptions);
    }
  }, [selectedCloud]);

  const handlePopUpSave = () => {
    if (showCloudPopup) {
      if (selectedCloud.length === 0 || selectedSubscription.length === 0) {
        setSnackbarMessage(
          "Please select at least one Cloud and Subscription from the dropdowns!!"
        );
        setSnackbarOpen(true);
        setShowCloudPopup(true);
      } else {
        const projectFieldIndex = formData.findIndex(
          (field) => field.ApiKey === "Projects"
        );
        if (projectFieldIndex !== -1 && activeFieldIndex !== null) {
          let updatedFormData = [...formData];
          const projectKey = dynamicFields.Projects[activeFieldIndex];

          // Initialize the project's subscriptions object if it doesn't exist
          updatedFormData[projectFieldIndex].subscriptions =
            updatedFormData[projectFieldIndex].subscriptions || {};
          updatedFormData[projectFieldIndex].subscriptions[projectKey] =
            updatedFormData[projectFieldIndex].subscriptions[projectKey] || {};

          // Update the subscriptions for the selected project
          selectedCloud.forEach((cloud) => {
            updatedFormData[projectFieldIndex].subscriptions[projectKey][
              cloud
            ] = selectedSubscription
              .filter((sub) => {
                const [subName, subId] = sub.split(" - ");
                return data["mastersubscriptions"].some(
                  (item) =>
                    item.SubscriptionID === subId && item.Cloud === cloud
                );
              })
              .map((sub) => {
                const [subName, subId] = sub.split(" - ");
                return { [subName]: subId };
              });
          });

          setFormData(updatedFormData);
        }

        setSelectedCloud([]);
        setSelectedSubscription([]);
        setShowCloudPopup(false);
        setSnackbarMessage("Project data updated successfully");
        setSnackbarOpen(true);
        setShowRolePopup(false);
      }
    } else {
      if (selectRoles.length === 0) {
        setSnackbarMessage(
          "Please select at least one role from the dropdown!!"
        );
        setSnackbarOpen(true);
        setShowRolePopup(true);
      } else {
        const rolesFieldIndex = formData.findIndex(
          (field) => field.ApiKey === "Roles"
        );
        if (rolesFieldIndex !== -1 && activeFieldIndex !== null) {
          // Get the last edited role key from dynamicFields
          const lastEditedRoleKey = dynamicFields.Roles[activeFieldIndex];
          // Get the current rolesOptions from formData
          let currentRolesOptions = formData[rolesFieldIndex].rolesOptions;
          // Check if the last edited role key already has an entry in rolesOptions
          const existingRoleIndex = currentRolesOptions.findIndex((option) =>
            option.hasOwnProperty(lastEditedRoleKey)
          );
          // If the role key already exists, update its roles, otherwise add a new entry
          if (existingRoleIndex > -1) {
            currentRolesOptions[existingRoleIndex][lastEditedRoleKey] = [
              ...selectRoles,
            ];
          } else {
            currentRolesOptions.push({ [lastEditedRoleKey]: [...selectRoles] });
          }
          let updatedFormData = [...formData];
          // Replace the rolesOptions with the updated array
          updatedFormData[rolesFieldIndex].rolesOptions = currentRolesOptions;
          // Update the state with the new formData
          setFormData(updatedFormData);
        }
        setSelectRoles([]);
        setShowRolePopup(false);
        setShowCloudPopup(false);
        setSnackbarMessage("Roles data updated successfully");
        setSnackbarOpen(true);
      }
    }
  };

  const handlePopUpCancel = () => {
    // if (showCloudPopup) {
    // Reset the project selection if the popup is for cloud and subscription
    // const updatedProjects = [...dynamicFields.Projects];
    // if (activeFieldIndex !== null) {
    //   updatedProjects[activeFieldIndex] = "";
    // }
    // setDynamicFields({
    //   ...dynamicFields,
    //   Projects: updatedProjects,
    // });
    // }
    // if (selectedCloud.length === 0 || selectedSubscription.length === 0) {
    //   setSnackbarMessage(
    //     "Please select at least one Cloud and Subscription from the dropdowns!!"
    //   );
    //   setSnackbarOpen(true);
    //   setShowCloudPopup(true);
    // }
    setShowCloudPopup(false);
    setShowRolePopup(false);
  };


  const handleEditDynamicField = (fieldKey, dynamicIndex, currentValue) => {
    if (fieldKey === "Projects") {
      // Find the project data from the formData
      const projectData = formData.find((field) => field.ApiKey === "Projects");
      const projectSubscriptions =
        projectData.subscriptions[currentValue] || {};

      // Extract the selected clouds and subscriptions for the project
      const selectedClouds = Object.keys(projectSubscriptions);
      const selectedSubscriptions = selectedClouds.flatMap((cloud) =>
        projectSubscriptions[cloud].map((subscriptionObject) => {
          // Extract the subscription name (key) and ID (value)
          const subscriptionName = Object.keys(subscriptionObject)[0];
          const subscriptionID = subscriptionObject[subscriptionName];
          return `${subscriptionName} - ${subscriptionID}`;
        })
      );

      // Set the selected clouds and subscriptions in the state
      setSelectedCloud(selectedClouds);
      setSelectedSubscription(selectedSubscriptions);
      setActiveFieldIndex(dynamicIndex);

      // Open the popup for editing projects
      setShowCloudPopup(true);
    } else if (fieldKey === "Roles") {
      const roleData = formData.find((field) => field.ApiKey === "Roles");
      const projectRoles = roleData.rolesOptions.find((roleOption) =>
        roleOption.hasOwnProperty(currentValue)
      );
      const selectedRoles = projectRoles ? projectRoles[currentValue] : [];
      setActiveFieldIndex(dynamicIndex);
      setSelectRoles(selectedRoles);
      setShowRolePopup(true);
    }
  };

  // Function to parse the Projects data and populate the dynamic fields
  const parseAndPopulateProjects = (projectsData) => {
    // Extract project names
    const projects = Object.keys(projectsData[0]);
    // Map project names to dynamicProjects
    const dynamicProjects = projects.map((projectName) => projectName);
    // Reduce projects to accumulate subscriptions for each project
    const subscriptions = projects.reduce((acc, projectName) => {
      // Extract subscriptions for each cloud within the project
      const clouds = projectsData[0][projectName][0];
      const cloudSubscriptions = Object.keys(clouds).reduce(
        (cloudAcc, cloudName) => {
          // Flatten all subscriptions within the cloud into a single array
          cloudAcc[cloudName] = clouds[cloudName].flatMap((subscription) => {
            return Object.entries(subscription).map(([subName, subId]) => {
              return { [subName]: subId };
            });
          });
          return cloudAcc;
        },
        {}
      );

      // Assign the cloudSubscriptions to the project in the accumulator
      acc[projectName] = cloudSubscriptions;
      return acc;
    }, {});

    setDynamicFields((prevState) => ({
      ...prevState,
      Projects: dynamicProjects,
    }));

    // Update the formData state for Projects with the parsed subscriptions
    const projectFieldIndex = formData.findIndex(
      (field) => field.ApiKey === "Projects"
    );
    if (projectFieldIndex !== -1) {
      let updatedFormData = [...formData];
      updatedFormData[projectFieldIndex].subscriptions = subscriptions;
      setFormData(updatedFormData);
    }
  };


  // Function to parse the Roles data and populate the dynamic fields
  const parseAndPopulateRoles = (rolesData) => {
    const roles = rolesData[0]; // Extract roles object
    const dynamicRoles = Object.keys(roles); // Extract project names for roles
    const rolesOptions = dynamicRoles.map((projectName) => ({
      [projectName]: roles[projectName], // Extract roles for each project
    }));

    setDynamicFields((prevState) => ({
      ...prevState,
      Roles: dynamicRoles,
    }));

    // Update the formData state for Roles with the parsed roles
    const rolesFieldIndex = formData.findIndex(
      (field) => field.ApiKey === "Roles"
    );
    if (rolesFieldIndex !== -1) {
      let updatedFormData = [...formData];
      updatedFormData[rolesFieldIndex].rolesOptions = rolesOptions;
      setFormData(updatedFormData);
    }
  };

  const storeData = useAppSelector(selectCommonConfig);
  const menuListCapabilities = storeData.loginDetails.capabilities.Onboarding[0]
  return (
    <div className="m-2">
      <div className="p-2 onboarding-page-h bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center ps-2">
            <h4 className="p-2 ps-3 fw-bold k8title"> User Management </h4>
            <span className="align-self-center">
              <Breadcrumbs
                className="d-flex justify-content-start align-items-center fw-bold px-2 card-title  "
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
                    {curr.inputType === "text" ? (
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
                          className={`form-control form-control-m mt-2 ${showValidation ? "border border-danger" : ""
                            }`}
                          type={curr.inputType}
                          value={curr.value}
                          onChange={(event) => handleFormChange(index, event)}
                        />
                        <small className="form-text">{curr.description}</small>
                      </label>
                    ) : curr.inputType === "email" ? (
                      <label
                        htmlFor={curr.inputType}
                        className="form-label label-width w-75"
                      >
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
                          className={`form-control form-control-m mt-2 ${showValidation ? "border border-danger" : ""
                            }`}
                          type={curr.inputType}
                          id={curr.inputType}
                          value={curr.value}
                          onChange={(event) => handleFormChange(index, event)}
                          multiple
                        />
                        <small className="form-text">{curr.description}</small>
                      </label>
                    ) : curr.inputType === "MultiMenus" ? (
                      <Form.Group
                        controlId={curr.ApiKey}
                        className="w-75 pb-2"
                        key={index}
                      >
                        <Form.Label className="w-100">
                          <div className="d-flex justify-content-between">
                            <span>
                              {curr.Title}{" "}
                              <span className="text-danger">*</span>{" "}
                            </span>
                            <span className="d-flex  align-items-end">
                              <span>
                                {
                                  // dynamicFields[curr.value].length <= 0 &&
                                  getValidationMessage(curr.Title)
                                }
                              </span>
                            </span>
                          </div>
                        </Form.Label>
                        {dynamicFields[curr.ApiKey].map(
                          (value, dynamicIndex) => (
                            <InputGroup key={dynamicIndex} className="">
                              <Form.Control
                                className={`rounded mt-2 ${curr.ApiKey === "Projects" &&
                                  invalidProjectInputs.includes(dynamicIndex)
                                  ? "border border-danger"
                                  : ""
                                  }`}
                                type="text"
                                value={value}
                                size="sm"
                                onChange={(event) =>
                                  handleDynamicFieldChange(
                                    curr.ApiKey,
                                    dynamicIndex,
                                    event
                                  )
                                }
                                isInvalid={!value && showValidation}
                                required
                                disabled={value && !searchInputProjects}
                              />
                              {dynamicIndex ===
                                dynamicFields[curr.ApiKey].length - 1 && (
                                  <div className="input-group-append ps-2 mt-2">
                                    <span className="input-group-text bg-white">
                                      <FontAwesomeIcon
                                        fontSize={"11px"}
                                        icon={faPlus}
                                        onClick={() =>
                                          handleAddDynamicField(curr.ApiKey)
                                        }
                                        className="py-1 cursor-pointer input_group_text"
                                      />
                                    </span>
                                  </div>
                                )}
                              {dynamicFields[curr.ApiKey].length > 1 &&
                                dynamicIndex !== 0 && (
                                  <div className="input-group-append ps-2 mt-2">
                                    <span className="input-group-text bg-white">
                                      <FontAwesomeIcon
                                        fontSize={"11px"}
                                        icon={faMinus}
                                        onClick={() =>
                                          handleRemoveDynamicField(
                                            curr.ApiKey,
                                            dynamicIndex
                                          )
                                        }
                                        className="py-1 cursor-pointer input_group_text"
                                      />
                                    </span>
                                  </div>
                                )}
                              {(dynamicFields[curr.ApiKey].length > 1 ||
                                dynamicIndex !== 0) && (
                                  <div className="input-group-append ps-2 mt-2">
                                    <span className="input-group-text bg-white">
                                      <FontAwesomeIcon
                                        // fontSize={"11px"}
                                        icon={faEdit}
                                        onClick={() => {
                                          handleEditDynamicField(
                                            curr.ApiKey,
                                            dynamicIndex,
                                            value
                                          );
                                          // setEditProject(true);
                                        }}
                                        className="py-1 cursor-pointer input_group_text"
                                      />
                                    </span>
                                  </div>
                                )}
                              {/* Display filtered results dynamically */}
                              {searchInputProjects.length > 0 &&
                                curr.ApiKey === "Projects" &&
                                dynamicIndex === activeFieldIndex && (
                                  <div className="dropdown rounded w-100 mt-2 overflow-auto">
                                    {filteredResultsProjects
                                      // .slice(0, 10)
                                      .map((currElem, innerIndex) => (
                                        <div
                                          onClick={() => {
                                            let ProjectTempStore = [
                                              ...dynamicFields.Projects,
                                            ];
                                            ProjectTempStore[dynamicIndex] =
                                              currElem.ProjectName;
                                            setDynamicFields({
                                              ...dynamicFields,
                                              Projects: ProjectTempStore,
                                            });
                                            setSearchInputProjects("");
                                            setShowCloudPopup(true);
                                          }}
                                          className="dropdown-row bg-light rounded my-1 ps-2 cursor-pointer"
                                        >
                                          {currElem.ProjectName}
                                        </div>
                                      ))}
                                  </div>
                                )}
                              {searchInputRoles.length > 0 &&
                                curr.ApiKey === "Roles" &&
                                dynamicIndex === activeFieldIndex && (
                                  <div className="dropdown rounded w-100 mt-2">
                                    {filteredResultsProjects
                                      .slice(0, 10)
                                      .map((currElem, innerIndex) => (
                                        <div
                                          onClick={() => {
                                            let RolesTempStore = [
                                              ...dynamicFields.Roles,
                                            ];
                                            RolesTempStore[dynamicIndex] =
                                              currElem.ProjectName;
                                            setDynamicFields({
                                              ...dynamicFields,
                                              Roles: RolesTempStore,
                                            });
                                            setSearchInputRoles(""); // Clear the search input to hide the dropdown
                                            setShowRolePopup(true);
                                          }}
                                          className="dropdown-row bg-light rounded my-1 ps-2 cursor-pointer"
                                        >
                                          {currElem.ProjectName}
                                        </div>
                                      ))}
                                  </div>
                                )}
                            </InputGroup>
                          )
                        )}
                        <div className="col-9">
                          <Form.Text className="text-muted form_text_des">
                            Please Select the project {curr.Title}
                          </Form.Text>
                        </div>
                        {showCloudPopup && (
                          <KubernetesPopupWrapper
                            title="Select Subscriptions Based on cloud"
                            handleSave={handlePopUpSave}
                            handleClose={handlePopUpCancel}
                          >
                            <div className="d-flex justify-content-evenly">
                              <span className="w-75 me-5 py-2">
                                <span className="tab">Select Cloud</span>
                                <span className="text-danger">*</span>
                                <CustomAutoComplete
                                  options={["AWS", "Azure", "GCP"]}
                                  value={selectedCloud}
                                  onChange={(event, newValue) => {
                                    setSelectedCloud(newValue);
                                  }}
                                  placeholder="Please select the cloud"
                                  error={false}
                                // PaperStyle={{ width: 460, overflow: "auto" }}
                                />
                              </span>
                              {selectedCloud && (
                                <span className="w-75 me-5">
                                  <span className="tab">Select Subscription</span>
                                  <span className="text-danger">*</span>
                                  <CustomAutoComplete
                                    options={filteredSubscriptions}
                                    value={selectedSubscription}
                                    onChange={(event, newValue) => {
                                      setSelectedSubscription(newValue);
                                    }}
                                    placeholder="Please select the subscriptions"
                                    error={false}
                                    PaperStyle={{ width: 590, overflow: "auto" }}
                                  />
                                </span>
                              )}
                            </div>
                          </KubernetesPopupWrapper>
                        )}
                        {showRolePopup && (
                          <KubernetesPopupWrapper
                            title="Select roles"
                            handleSave={handlePopUpSave}
                            handleClose={handlePopUpCancel}
                          >
                            <div className="d-flex justify-content-evenly">
                              <span className="w-75 me-5">
                                <span>Select the roles</span>
                                <span className="text-danger">*</span>
                                <CustomAutoComplete
                                  options={[
                                    "Super Admin",
                                    "Admin",
                                    "User Admin",
                                    "user",
                                    "Finops Admin user",
                                    "Dashboard user",
                                    "Advisory user",
                                  ]}
                                  value={selectRoles}
                                  onChange={(event, newValue) => {
                                    setSelectRoles(newValue);
                                  }}
                                  placeholder="Please select the roles"
                                  error={false}
                                />
                              </span>
                            </div>
                          </KubernetesPopupWrapper>
                        )}
                        <SnakeBarAlert
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "center",
                          }}
                          open={snackbarOpen}
                          autoHideDuration={2000}
                          message={snackbarMessage}
                          onClose={() => {
                            setSnackbarOpen(false);
                          }}
                          severity="error"
                        />

                      </Form.Group>
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

export default UserForm;
