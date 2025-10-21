import React, { useState, useEffect } from "react";
import { Form, InputGroup } from "react-bootstrap";
import {
  Checkbox,
  DialogActions,
} from "@mui/material";
import { KubernetesPopupWrapper } from "../KubernetesPopUp/KubernetesPopupWrapper";
import SnakeBarAlert from "../../Utilities/SnakeBarAlert";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { faPlus, faMinus, faEdit } from "@fortawesome/free-solid-svg-icons";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Api } from "../../Utilities/api";
import testapi from "../../../api/testapi.json";
import { Loader } from "../../Utilities/Loader";
import { PopUpModal } from "../../Utilities/PopUpModal"
import CustomAutoComplete from "../../Utilities/CustomAutoComplete";
import { filterData } from "../../Utilities/filterData";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ScheduleProfileLayout } from "../../Utilities/ScheduleProfileLayout";
import { selectCommonConfig, setCloudData, setFilteredAdvisoryData, setFilteredOrphanData, setFilteredTaggingData, setTagsFilterData, } from '../CommonConfig/commonConfigSlice';

interface Errors {
  groupName?: string;
  discription?: string;
  application?: string;
  environment?: string;
  changeRequest?: string;
  service?: string;
  changeOwner?: string;
  assignGroup?: string;
  Projects?:string;
}

const PatchForm = () => {
  const cloudData = useAppSelector(selectCommonConfig);
  const [showProfile, setShowProfile] = useState(false);
  const [data, setData] = useState([]);
  const [isapproval, setIsApproval] = useState(false);
  const [isapproval1, setIsApproval1] = useState(false);
  const [aplPatch, setAplPatch] = useState("No")
  const [aplReboot, setAplReboot] = useState("No")
  const [mnlPatch, setMnlPatch] = useState("No")
  const [mnlReboot, setMnlReboot] = useState("No")
  const [changeRequestM, setChangeRequestM] = useState("No")
  const [isManual, setIsManual] = useState(false);
  const [isManual1, setIsManual1] = useState(false);
  const [isChangeRequest, setIsChangeRequest] = useState(false);
  const [startDate, setStartDate] = React.useState<Dayjs | null>(dayjs(new Date()));
  const [endDate, setEndDate] = React.useState<Dayjs | null>(dayjs(new Date()));
  const [subDropdownsObject, setSubDropDownsObject] = useState<any>([]);
  // const dispatch = useAppDispatch();
  const dropdownsObject = { "Members": Object.keys(filterData("FullName", data["users"])), "Subscriptions": Object.keys(filterData("SubscriptionID", data["mastersubscriptions"])), "BusinessUnit": Object.keys(filterData("BUName", data["BU"])), "CostCode": Object.keys(filterData("CostCode", data["costCode"])), "Projects": Object.keys(filterData("ProjectName", data["project"])) }
  const [groupName, setGroupName] = useState("")
  const [discription, setDiscription] = useState("")
  const [application, setApplication] = useState([]);
  const [environment, setEnvironment] = useState([]);
  const [changeRequest, setChangeRequest] = useState([]);
  const [service, setService] = useState([]);
  const [changeOwner, setChangeOwner] = useState("");
  const [assignGroup, setAssignGroup] = useState([]);
  const [filteredResultsProjects, setFilteredResultsProjects] = useState([]);

  const fomatedstartDate = dateFormatter(startDate)
  const fomatedendDate = dateFormatter(endDate)
  const [showValidation, setShowValidation] = useState<any>(false);
  const [errors, setErrors] = useState<Errors>({});


  const [fromChildData, setFromChildData] = useState('');
  const [strDate, setStrDate] = useState();
  const [edDate, setEdDate] = useState();
  const finalStrDate = strDate ? strDate : startDate
  const finalEdDate = edDate ? edDate : endDate
  const [dynamicFields, setDynamicFields] = useState({
    Projects: [""],
    Roles: [""],
  });

  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [searchInputProjects, setSearchInputProjects] = useState("");
  const [searchInputRoles, setSearchInputRoles] = useState("");
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
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeFieldIndex, setActiveFieldIndex] = useState(null);
  const [selectRoles, setSelectRoles] = useState([]);
  const userPermission = cloudData.loginDetails.capabilities.Onboarding[0]

  const handlePopUpCancel1 = () => {
    setShowProfile(false);
  };


  var allData = [...cloudData.filteredTaggingData, ...cloudData.filteredOrphanData, ...cloudData?.filteredAdvisoryData];

  useEffect(() => {

    const filteredData = allData.filter((item) => {
      const isApplication = !application.length || application.includes(item.Application);
      const isSelectedEnv = !environment.length || environment.includes(item.Environment);
      const isCRT = !changeRequest.length || changeRequest.includes(item.BU);
      const isService = !service.length || service.includes(item.Owner);
      const isAG = !assignGroup.length || assignGroup.includes(item.CostCenter);
      return isApplication && isSelectedEnv && isCRT && isService && isAG;

    });

    const checkCon = [application, environment, changeRequest, service, assignGroup]

    const check = checkCon.map((item) => {
      return item.length !== 0 ? true : false;
    })
    if (check.every(item => item === false)) {
      dispatch(setFilteredTaggingData(cloudData?.cloudData));
      dispatch(setFilteredOrphanData(cloudData?.orphanData));
      dispatch(setFilteredAdvisoryData(cloudData?.advisoryData));
    }
    else {
      let filteredCloudData = filterData("Cloud", filteredData);
      let availableClouds = Object.keys(filteredCloudData);
      if (availableClouds.length > 0) {
        var orphanData = filteredData.filter((item) => {
          return Object.keys(item).includes("ResourceStatus");
        });
        orphanData.length > 0 && dispatch(setFilteredOrphanData(orphanData))
        var advisoryData = filteredData.filter((item) => {
          return Object.keys(item).includes("AdvisoryStatus");
        });
        advisoryData.length > 0 && dispatch(setFilteredAdvisoryData(advisoryData))
        var tagsData = filteredData.filter((item) => {
          return Object.keys(item).includes("CustomerName");
        });
        tagsData.length > 0 && dispatch(setFilteredTaggingData(tagsData))

      }
    }
  }, [application, environment, changeRequest, service, assignGroup]);

  function dateFormatter(value) {
    const date = value?.toDate(); // Convert Day.js to Date object
    date?.setDate(date.getDate()); // Add one day
    const formattedDate = date?.toISOString().slice(0, 10);
    return formattedDate;
  }

  
  const validateForm = () => {
    const newErrors: Errors = {};
    if (!groupName) newErrors.groupName = 'Name is required.';
    if (!discription) newErrors.discription = 'Discription is required.';
    if (application.length === 0) newErrors.application = 'Application is required.';
    if (environment.length === 0) newErrors.environment = 'Environment is required.';
    if (changeRequest.length === 0) newErrors.changeRequest = 'Changh request is required.';
    if (service.length === 0) newErrors.service = 'Service is required.';
    if (!changeOwner) newErrors.changeOwner = 'ChangeOwner is required.';
    if (assignGroup.length === 0) newErrors.assignGroup = 'Environment is required.';
    if (dynamicFields.Projects[0] === '') newErrors.Projects = 'Servers is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'groupName') {
      setGroupName(value);
      if (errors.groupName) {
        setErrors((prevErrors) => ({ ...prevErrors, groupName: '' }));
      }
    } else if (id === 'discription') {
      setDiscription(value);
      if (errors.discription) {
        setErrors((prevErrors) => ({ ...prevErrors, discription: '' }));
      }
    } else if (id === 'changeOwner') {
      setChangeOwner(value);
      if (errors.changeOwner) {
        setErrors((prevErrors) => ({ ...prevErrors, changeOwner: '' }));
      }
    }
  };

  console.log("groupName", groupName, discription, application, environment, aplPatch, aplReboot, mnlPatch, mnlReboot,dynamicFields.Projects, changeRequest, service, changeOwner, assignGroup)

  var postBody = {
    // GroupName:groupName,
    // discription:discription,
    // application:application,
    // projects:dynamicFields.Projects,
    // environment:environment,
    // changeRequest:changeRequest,
    // service:service,
    // changeOwner:changeOwner,
    // assignGroup:assignGroup,
    // aplPatch:aplPatch,
    // aplReboot:aplReboot,
    // mnlPatch:mnlPatch,
    // mnlReboot:mnlReboot,
    // changeRequestM:changeRequestM,
    Cloud: "aws",
    OS: "windows",
    GitHubLink: "GitHubLink",
    GroupName: groupName,
    Application: application,
    Environment: environment,
    Servers: service,
    CRPlanner: ["aplPatch"],
    CRImplementationPlanner: "CRImplementationPlanner",
    RebootRequired: "RebootRequired",
    CRType: changeRequest,
    PostPatchingSteps: "PostPatchingSteps",
    PostPatchingScripts: "PostPatchingScripts",
    DistributionList: "DistributionList",



    // Cloud: "aws",
    // OS: "windows",
    // GitHubLink: "GitHubLink",
    // GroupName: groupName,
    // Application: "aplPatch",
    // Environment: "environment",
    // Servers: "service",
    // CRPlanner: ["aplPatch"],
    // CRImplementationPlanner: "CRImplementationPlanner",
    // RebootRequired: "RebootRequired",
    // CRType: "changeRequest",
    // PostPatchingSteps: "PostPatchingSteps",
    // PostPatchingScripts: "PostPatchingScripts",
    // DistributionList: "DistributionList",

    


  }
  const handleSubmit = async () => {
    console.log("postDataresponse", postBody);
    if (validateForm()) {
      try {
        const response = Api.postData(testapi.patch, postBody)
        response.then((response: any) => {
        })
          .catch(error => {
            console.error("Error : ", error)
          });
        // handleCancel();
        // setShowValidation(false);
        // setShowModal(true);
        // setModalMessage("Application Onboarded Successfully!!");
      } catch (error) {
        // setShowModal(true);
        // setModalMessage(` ${error} An error occurred while submitting the form.`);
      }
    } else {
      // setIsLoading(false)
      // setShowModal(true);
      // setShowValidation(true);
      // setModalMessage("Please fill all the fields!!");
    }
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (validateForm()) {
  //     // http://ec2-3-97-232-96.ca-central-1.compute.amazonaws.com:8006/group/
  //     console.log('Form submitted:', { groupName });
  //   }
  // };

  const [formData, setFormData] = useState<any>([
    {
      inputType: "MultiMenus",
      ApiKey: "Projects",
      Title: "Servers",
      value: [],
      subscriptions: {},
    },
  ]);
 
  const handleDataFromChild = (childData) => {
    setFromChildData(childData);
    console.log("childData", childData)
  };
  const handleStrDateFromChild = (strDate) => {
    setStrDate(strDate);
  };
  const handleEndDateFromChild = (endDate) => {
    setEdDate(endDate);
  };
  
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
      console.log("handleDynamicFieldChange", updatedFields)

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

  // var postBody = {};
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

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: "250px",
        width: 250,
      },
    },
  };

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
  console.log("transformedData",dynamicFields.Projects)
  


  return (
    <div className="m-2">
      <div className="p-2 onboarding-page-h bg_color">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center ps-2">
            <h4 className="p-2 ps-3 fw-bold k8title"> Implementation Group </h4>
          </div>
        </div>
        <form>
          <div className="row patch d-flex" style={{ padding: "38px 101px 0 104px" }}>

            <div className="col-md-6 d-flex justify-content-end">
              <label className="form-label label-width">
                <div className="d-flex justify-content-between w-75">
                  <span>
                    GroupName <span className="text-danger">*</span>{" "}
                  </span>
                  <span className="d-flex align-items-end">
                    <span>

                    </span>
                  </span>
                </div>
                {"  "}
                <input
                  className={`form-control form-control-m w-75 mt-1`}
                  type="input"
                  id="groupName"
                  value={groupName}
                  // onChange={(e) => setGroupName(e.target.value)}
                  onChange={handleInputChange}

                />
                {errors?.groupName && <div className="text-danger">{errors?.groupName}</div>}

              </label>

            </div>
            <div className="col-md-6 d-flex justify-content-start">

              <label className="form-label label-width">
                <div className="d-flex justify-content-between w-75">
                  <span>
                    Discription <span className="text-danger">*</span>{" "}
                  </span>
                  <span className="d-flex align-items-end">
                    <span>

                    </span>
                  </span>
                </div>
                {"  "}
                <input
                  className={`form-control form-control-m w-75 mt-1`}
                  type="input"
                  id="discription"
                  value={discription}
                  onChange={handleInputChange}
                />
                {errors?.discription && <div className="text-danger">{errors?.discription}</div>}
              </label>
            </div>
            <div className="col-md-6 d-flex justify-content-end">

              <label className="form-label label-width">
                <div className="d-flex justify-content-between w-75">
                  <span>
                    Application <span className="text-danger">*</span>{" "}
                  </span>
                  <span className="d-flex align-items-end">
                    <span>

                    </span>
                  </span>
                </div>
                {"  "}
                <CustomAutoComplete
                  id="application"
                  limitTags={1}
                  options={Object.keys(filterData("Application", allData))}
                  value={application}
                  onChange={(event, newValue) => {
                    setApplication(newValue);
                    if (errors.application) {
                      setErrors((prevErrors) => ({ ...prevErrors, application: '' }));
                    }
                  }}
                  placeholder={""}
                  error={false}
                // TextFieldSx={{ width: 200 }}
                />
                {errors?.application && <div className="text-danger">{errors?.application}</div>}
              </label>
            </div>
            <div className="col-md-6 d-flex justify-content-start">

              <label className="form-label label-width">
                <div className="d-flex justify-content-between w-75">
                  <span>
                    Environment <span className="text-danger">*</span>{" "}
                  </span>
                  <span className="d-flex align-items-end">
                    <span>

                    </span>
                  </span>
                </div>
                {"  "}
                <CustomAutoComplete
                  id="multiple-limit-tags"
                  limitTags={1}
                  options={Object.keys(filterData("Environment", allData))}
                  value={environment}
                  onChange={(event, newValue) => {
                    setEnvironment(newValue);
                    if (errors.environment) {
                      setErrors((prevErrors) => ({ ...prevErrors, environment: '' }));
                    }
                  }}
                  placeholder={""}
                  error={false}
                // TextFieldSx={{ width: 200 }}
                />
                {errors?.environment && <div className="text-danger">{errors?.environment}</div>}
              </label>
            </div>


            <div className="col-md-6 d-flex justify-content-end">
              <label className="form-label label-width">
                <div className="d-flex justify-content-between align-items-start">
                  <span>
                    Time <span className="text-danger">*</span>{" "}
                  </span>

                </div>
                {"  "}
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePickker']}>
                    <small className="patch"> Start Time </small>
                    <DatePicker
                      value={finalStrDate}
                      onChange={(newValue) => {
                        setStartDate(newValue);
                      }}

                    />

                    <FormGroup>
                      <FormControlLabel onClick={(e) => setShowProfile(true)} control={<Checkbox />} label="Recurring" />
                    </FormGroup>
                    {/* <p onClick={(e) => setShowProfile(true)} style={{cursor:"pointer"}}><Checkbox style={{marginTop:"-8px"}} label="Weekly" />Recurring</p> */}

                  </DemoContainer>
                  <DemoContainer components={['DatePickker']}>
                    <small className="patchtime"> End Time</small>
                    <DatePicker
                      value={finalEdDate}
                      onChange={(newValue) => {
                        setEndDate(newValue);
                      }}

                    />
                  </DemoContainer>
                </LocalizationProvider>
                <small>{fromChildData}</small>
              </label>
            </div>

            <div className="col-md-6 d-flex justify-content-end"></div>



            <div className="col-md-6 d-flex justify-content-center">

              <label className="form-label label-width w-75">
                <div className="d-flex justify-content-between">
                  <span>
                    Approval <span className="text-danger">*</span>{" "}
                  </span>
                </div>
                {"  "}

                <>
                  <div className="d-flex align-items-center pad_top">
                    <small className="patch"> Patching</small>
                    <div
                      className="btn-group btn-group-sm"
                      role="group"
                      aria-label="Basic radio toggle button group"
                    >
                      <input
                        type="radio"
                        className="btn-check"
                        name="btnradio11"
                        id="btnradio11"
                        checked={isapproval === true}
                        onChange={(e) => (setIsApproval(true), setAplPatch("Yes"))}
                        // onChange={(e) => handleApproval("YES")}
                        required
                      />
                      <label
                        className="btn btn-outline-primary footer_size yesno fw-bold"
                        htmlFor="btnradio11"
                      >
                        YES
                      </label>
                      <input
                        type="radio"
                        className="btn-check"
                        name="btnradio12"
                        id="btnradio12"
                        checked={isapproval === false}
                        onChange={(e) => (setIsApproval(false), setAplPatch("NO"))}
                        required
                      />
                      <label
                        className="btn btn-outline-primary footer_size yesno fw-bold"
                        htmlFor="btnradio12"
                      >
                        NO
                      </label>
                    </div>
                  </div>
                  <div className="d-flex align-items-center pad_top ">
                    <small className="Reboot"> Reboot</small>
                    <div
                      className="btn-group btn-group-sm"
                      role="group"
                      aria-label="Basic radio toggle button group"
                    >
                      <input
                        type="radio"
                        className="btn-check"
                        name="btnradio13"
                        id="btnradio13"
                        checked={isapproval1 === true}
                        onChange={(e) => (setIsApproval1(true), setAplReboot("YES"))}
                        required
                      />
                      <label
                        className="btn btn-outline-primary footer_size yesno fw-bold"
                        htmlFor="btnradio13"
                      >
                        YES
                      </label>
                      <input
                        type="radio"
                        className="btn-check"
                        name="btnradio14"
                        id="btnradio14"
                        checked={isapproval1 === false}
                        onChange={(e) => (setIsApproval1(false), setAplReboot("NO"))}
                        required
                      />
                      <label
                        className="btn btn-outline-primary footer_size yesno fw-bold"
                        htmlFor="btnradio14"
                      >
                        NO
                      </label>
                    </div>
                  </div>
                </>
              </label>
            </div>
            <div className="col-md-6 d-flex justify-content-start">

            {formData.map((curr: any, index: number) => {
                return (
                  <div className={``}>
                    {curr.inputType == "MultiMenus" ? (
                      <Form.Group
                        controlId={curr.ApiKey}
                        className="pb-2"
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
                                  // getValidationMessage(curr.Title)
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
                                style={{ width: "250px"}}
                                type="text"
                                value={value}
                                size="sm"
                                onChange={(event) =>{
                                  handleDynamicFieldChange(
                                    curr.ApiKey,
                                    dynamicIndex,
                                    event
                                  )
                                  if (errors.Projects[0] !== '') {
                                    setErrors((prevErrors) => ({ ...prevErrors, Projects: '' }));
                                  }}
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
                              {/* {searchInputRoles.length > 0 &&
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
                                )} */}
                            </InputGroup>
                          )
                        )}
                         {errors?.Projects && <div className="text-danger">{errors?.Projects}</div>}
                        {/* <div className="col-9">
                          <Form.Text className="text-muted form_text_des">
                            Please Select the project {curr.Title}
                          </Form.Text>
                        </div> */}
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
            </div>
            <div className="col-md-6 d-flex justify-content-center">
              <label className="form-label label-width w-75">
                <div className="d-flex justify-content-between">
                  <span>
                    Manual <span className="text-danger">*</span>{" "}
                  </span>
                </div>
                {"  "}

                <div className="d-flex align-items-center pad_top">
                  <small className="patch"> Patching</small>
                  <div
                    className="btn-group btn-group-sm"
                    role="group"
                    aria-label="Basic radio toggle button group"
                  >
                    <input
                      type="radio"
                      className="btn-check"
                      name="btnradio1"
                      id="btnradio1"
                      checked={isManual === true}
                      onChange={(e) => (setIsManual(true), setMnlPatch("YES"))}
                      required
                    />
                    <label
                      className="btn btn-outline-primary footer_size yesno fw-bold"
                      htmlFor="btnradio1"
                    >
                      YES
                    </label>
                    <input
                      type="radio"
                      className="btn-check"
                      name="btnradio2"
                      id="btnradio2"
                      checked={isManual === false}
                      onChange={(e) => (setIsManual(false), setMnlPatch("NO"))}
                      required
                    />
                    <label
                      className="btn btn-outline-primary footer_size yesno fw-bold"
                      htmlFor="btnradio2"
                    >
                      NO
                    </label>
                  </div>
                </div>
                <div className="d-flex align-items-center pad_top ">
                  <small className="Reboot"> Reboot</small>
                  <div
                    className="btn-group btn-group-sm"
                    role="group"
                    aria-label="Basic radio toggle button group"
                  >
                    <input
                      type="radio"
                      className="btn-check"
                      name="btnradio3"
                      id="btnradio3"
                      checked={isManual1 === true}
                      onChange={(e) => (setIsManual1(true), setMnlReboot("YES"))}
                      required
                    />
                    <label
                      className="btn btn-outline-primary footer_size  yesno fw-bold"
                      htmlFor="btnradio3"
                    >
                      YES
                    </label>
                    <input
                      type="radio"
                      className="btn-check"
                      name="btnradio4"
                      id="btnradio4"
                      checked={isManual1 === false}
                      onChange={(e) => (setIsManual1(false), setMnlReboot("NO"))}
                      required
                    />
                    <label
                      className="btn btn-outline-primary footer_size yesno fw-bold"
                      htmlFor="btnradio4"
                    >
                      NO
                    </label>
                  </div>
                </div>
              </label>
            </div>
            <div className="col-md-6 d-flex justify-content-start">
              <label className="form-label label-width w-75">
                <div className="d-flex justify-content-start">
                  Change Request Method <span className="text-danger">*</span>{" "}
                </div>
                {"  "}
                <div className="d-flex align-items-center pad_top">
                  <div
                    className="btn-group btn-group-sm"
                    role="group"
                    aria-label="Basic radio toggle button group"
                  >
                    <input
                      type="radio"
                      className="btn-check"
                      name="btnradio9"
                      id="btnradio9"
                      checked={isChangeRequest === true}
                      onChange={(e) => (setIsChangeRequest(true), setChangeRequestM("YES"))}
                      required
                    />
                    <label
                      className="btn btn-outline-primary footer_size  yesno fw-bold"
                      htmlFor="btnradio9"
                    >
                      YES
                    </label>
                    <input
                      type="radio"
                      className="btn-check"
                      name="btnradio10"
                      id="btnradio10"
                      checked={isChangeRequest === false}
                      onChange={(e) => (setIsChangeRequest(false), setChangeRequestM("NO"))}
                      required
                    />
                    <label
                      className="btn btn-outline-primary footer_size yesno fw-bold"
                      htmlFor="btnradio10"
                    >
                      NO
                    </label>
                  </div>
                </div>
              </label>
            </div>
            <div className="col-md-6 d-flex justify-content-end">

              <label className="form-label label-width">
                <div className="d-flex justify-content-between w-75">
                  <span>
                    Change Request Type <span className="text-danger">*</span>{" "}
                  </span>
                  <span className="d-flex align-items-end">
                    <span>

                    </span>
                  </span>
                </div>
                {"  "}
                <CustomAutoComplete
                  id="multiple-limit-tags"
                  limitTags={1}
                  options={Object.keys(filterData("Environment", allData))}
                  value={changeRequest}
                  onChange={(event, newValue) => {
                    setChangeRequest(newValue);
                    if (errors.changeRequest) {
                      setErrors((prevErrors) => ({ ...prevErrors, changeRequest: '' }));
                    }
                  }}
                  placeholder={""}
                  error={false}
                // TextFieldSx={{ width: 200 }}
                />
                {errors?.changeRequest && <div className="text-danger">{errors?.changeRequest}</div>}
              </label>
            </div>
            <div className="col-md-6 d-flex justify-content-start">

              <label className="form-label label-width">
                <div className="d-flex justify-content-between w-75">
                  <span>
                    Service <span className="text-danger">*</span>{" "}
                  </span>
                  <span className="d-flex align-items-end">
                    <span>

                    </span>
                  </span>
                </div>
                {"  "}
                <CustomAutoComplete
                  id="multiple-limit-tags"
                  limitTags={1}
                  options={Object.keys(filterData("Owner", allData))}
                  value={service}
                  onChange={(event, newValue) => {
                    setService(newValue);
                    if (errors.service) {
                      setErrors((prevErrors) => ({ ...prevErrors, service: '' }));
                    }
                  }}
                  placeholder={""}
                  error={false}
                // TextFieldSx={{ width: 200 }}
                />
                {errors?.service && <div className="text-danger">{errors?.service}</div>}
              </label>
            </div>
            <div className="col-md-6 d-flex justify-content-end">
              <label className="form-label label-width">
                <div className="d-flex justify-content-between w-75">
                  <span>
                    Change Owner <span className="text-danger">*</span>{" "}
                  </span>
                  <span className="d-flex align-items-end">
                    <span>

                    </span>
                  </span>
                </div>
                {"  "}
                <input
                  id="changeOwner"
                  className={`form-control form-control-m w-75 mt-1`}
                  type="input"
                  value={changeOwner}
                  onChange={handleInputChange}
                />
                {errors?.changeOwner && <div className="text-danger">{errors?.changeOwner}</div>}
              </label>

            </div>
            <div className="col-md-6 d-flex justify-content-start">

              <label className="form-label label-width">
                <div className="d-flex justify-content-between w-75">
                  <span>
                    Assignment Group <span className="text-danger">*</span>{" "}
                  </span>
                  <span className="d-flex align-items-end">
                    <span>

                    </span>
                  </span>
                </div>
                {"  "}
                <CustomAutoComplete
                  id="multiple-limit-tags"
                  limitTags={1}
                  options={Object.keys(filterData("Owner", allData))}
                  value={assignGroup}
                  onChange={(event, newValue) => {
                    setAssignGroup(newValue);
                    if (errors.assignGroup) {
                      setErrors((prevErrors) => ({ ...prevErrors, assignGroup: '' }));
                    }
                  }}
                  placeholder={""}
                  error={false}
                // TextFieldSx={{ width: 200 }}
                />
                {errors?.assignGroup && <div className="text-danger">{errors?.assignGroup}</div>}
              </label>
            </div>
          </div>

          <div className="row pt-4" style={{ padding: "38px 101px 0 104px" }}>

            <div className="col d-flex  justify-content-center">
              <button className="btn btn-outline-success btn-width font-weight-bold">Cancel</button>
            </div>
            <div className="col d-flex  justify-content-start">
              <button type="submit" onClick={handleSubmit} className="btn btn-outline-danger btn-width font-weight-bold">Submit</button>
            </div>
          </div>
        </form >
  { showProfile && <ScheduleProfileLayout handleStrDateFromChild={handleStrDateFromChild} handleEndDateFromChild={handleEndDateFromChild} fromChildData={fromChildData} onData={handleDataFromChild} 
    handleClose={handlePopUpCancel1} />}

      </div >
    </div >
    // {isLoading ? <Loader load={load} isLoading={isLoading} /> : null}
    // <PopUpModal show={showModal} modalMessage={modalMessage} onHide={handleOnHide} />

    // {showProfile && <ScheduleProfileLayout handleSave={handlePopUpSave}
    //   handleClose={handlePopUpCancel} />}


    // </div>
  );
};

export default PatchForm;

