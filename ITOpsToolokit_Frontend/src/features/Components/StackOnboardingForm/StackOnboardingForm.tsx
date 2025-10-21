import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { Api } from "../../Utilities/api";
import testapi from "../../../api/testapi.json";
import { KubernetesPopupWrapper } from "../KubernetesPopUp/KubernetesPopupWrapper";
import { Form } from "react-bootstrap";
import CustomAutoComplete from "../../Utilities/CustomAutoComplete";
import { PopUpModal } from "../../Utilities/PopUpModal";
import { validateUserInput } from "../../Utilities/validateUserInput";
import { isValidIpAddress } from "../../Utilities/validateIP";
import { validationSwitch } from "../../Utilities/ValidationSwitch";
import {
  faEye,
  faEyeSlash,
  faMinus,
  faPlus,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CircularProgress from "@mui/material/CircularProgress";
import {
  checkForDuplicateFieldName,
  checkForDuplicates,
} from "../../Utilities/DuplicateArrayValue";
import transformForm from "./StackFormLogic";

const StackOnboardingForm = () => {
  const [subDropdown, setDropdown] = useState<any>([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showArea, setShowArea] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [showValidation, setShowValidation] = useState<any>(false);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [userinputurl, setUserInputUrl] = useState("");
  const [existingurl, setExistingUrl] = useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [validationResult, setValidationResult] = React.useState(null);
  const [userapiResponse, setUserApiResponse] = useState<any>();
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [isLoading, setIsLoading] = useState(false);
  const [textBoxes, setTextBoxes] = useState([{ value: "" }]);
  const [formElements, setFormElements] = useState([
    {
      name: "Name Of Stack",
      type: "Text",
      mandatory: true,
      value: "",
      min: "",
      max: "",
    },

    {
      name: "Select Cloud",
      typedropdown: "Single Select",
      type: "",
      source: ["AWS", "AZURE", "GCP"],
      mandatory: true,
      value: "",
      validation: [],
      dropdownoptions: null,
    },
    { name: "SubscriptionID", type: "textarea", value: "", mandatory: false },
    {
      name: "ITSM_End_point",
      type: "Text",
      mandatory: true,
      value: "",
    },
    {
      name: "Orch_API",
      type: "Text",
      mandatory: true,
      value: "",
    },
  ]);

  const [nestedformElements, setnestedFormElements] = useState([
    {
      name: "Field Name",
      type: "Text",
      value: "",
    },

    {
      name: "Is mandatory",
      type: "Boolean",
      value: toggle,
    },
    {
      name: "Field Type",
      type: "dropdown",
      value: "",
      source: [
        "Text",
        "Boolean",
        "Password",
        "Number",
        "Text Area",
        "Dropdown",
        "Email",
        "IP Address",
      ],
    },

    {
      name: "Type of Dropdown",
      type: "dropdown",
      value: "",
      source: [""],
    },
    {
      name: "Dropdown Values",
      helper_text: `E.g. for static Values = "testing","Mydev","My prod" if you have api you paste it below `,
      type: "dropdownoptions",
      value: [""],
      source: [],
    },
    {
      name: "Add Min & Max Value",
      type: "Number",
      min: 0,
      max: 0,
    },
    {
      name: "Select Validation",
      type: "checkbox",
      source: [
        "Uppercase Letters",
        "Lowercase Letters",
        "Characters Allowed",
        "Alphabets",
        "Include Special Characters",
        "Alphanumeric",
      ],
      value: [],
    },
    {
      name: "Add Boolean Value",
      type: "Boolean",
      source: ["Yes", "No"],
    },
  ]);
  //adding nested form  data to main form data
  const updateFormElements = (nestedformElements: any) => {
    const updatedElements = [...formElements]; // Create a copy to avoid mutation

    nestedformElements.forEach((item: any) => {
      const { name, value, source, min, max } = item;

      switch (name) {
        case "Field Name":
          updatedElements.push({
            name: value,
            type: "",
            mandatory: false,
            value: "",
            source: null,
            validation: [""],
            min,
            max,
            dropdownoptions: null,
            typedropdown: "",
          });
          break;
        case "Is mandatory":
          updatedElements[updatedElements.length - 1].mandatory = toggle;
          break;
        case "Field Type":
          updatedElements[updatedElements.length - 1].type = value;
          break;
        case "Type of Dropdown":
          updatedElements[updatedElements.length - 1].typedropdown = value;
          break;

        case "Add Boolean Value":
          updatedElements[updatedElements.length - 1].source = source;

          break;
        case "Add Min & Max Value":
          updatedElements[updatedElements.length - 1].min = min;
          updatedElements[updatedElements.length - 1].max = max;

          break;
        case "Select Validation":
          updatedElements[updatedElements.length - 1].validation = value;

          break;

        case "Dropdown Values":
          if (value) {
            updatedElements[updatedElements.length - 1].dropdownoptions = value;
          }
          break;
        default:
          console.warn(`Unhandled JSON property: ${name}`); // Handle unrecognized properties
      }
    });
    setFormElements(updatedElements);
    setIsAddModalOpen(false);
  };
  console.log(formElements, "form");
  console.log(nestedformElements, "nested");
  const addField = () => {
    setSelectedItems([]);
    setSelectAll([]);
    setExistingUrl("");
    setShowSubmit(false);
    setUserInputUrl("");
    setUserApiResponse(null);
    setSelectedItems([]);
    setTextBoxes([{ value: "" }]);
    setShowValidation(false);
    setnestedFormElements([
      {
        name: "Field Name",
        type: "Text",
        value: "",
      },

      {
        name: "Is mandatory",
        type: "Boolean",
        value: toggle,
      },
      {
        name: "Field Type",
        type: "dropdown",
        value: "",
        source: [
          "Text",
          "Boolean",
          "Password",
          "Number",
          "Text Area",
          "Dropdown",
          "Email",
          "IP Address",
        ],
      },

      {
        name: "Type of Dropdown",
        type: "dropdown",
        value: "",
        source: [""],
      },
      {
        name: "Dropdown Values",
        type: "dropdownoptions",
        value: [""],
        source: [],
      },
      {
        name: "Add Min & Max Value",
        type: "Number",
        min: 0,
        max: 0,
      },
      {
        name: "Select Validation",
        type: "checkbox",
        source: [
          "Uppercase Letters",
          "Lowercase Letters",
          "Characters Allowed",
          "Alphabets",
          "Include Special Characters",
          "Alphanumeric",
        ],
        value: [],
      },

      {
        name: "Add Boolean Value",
        type: "Boolean",
        source: ["Yes", "No"],
      },
    ]);
    setIsAddModalOpen(true);
  };

  const handleRemoveElement = (name, type) => {
    const updatedFormElements = formElements.filter(
      (element) => element.name !== name
    );

    const finalFormElements = [...updatedFormElements];

    if (type === "IP Address" || type === "Text" || type === "Password") {
      setValidationResult(null);
    }

    setFormElements(finalFormElements);
  };

  const validateForm = () => {
    let isValid = true;
    let errorMessage = "";
    const requiredFields = [
      { name: "Name Of Stack", message: "Name Of Stack should not be empty" },
      {
        name: "Select Cloud",
        message: "Please select any value from Select Cloud",
      },
      { name: "ITSM_End_point", message: "Please provide ITSM EndPoint" },
      { name: "Orch_API", message: "Please provide Orch API" },
    ];

    for (const field of formElements) {
      const foundField = requiredFields.find((f) => f.name === field.name);
      if (!field.value && foundField) {
        isValid = false;
        errorMessage = foundField.message;
        break;
      }
    }

    if (!isValid) {
      setModalMessage(errorMessage);
      setShowModal(true);
      setShowValidation(true);
    }

    return isValid;
  };

  const handleSubmit = (event) => {
    // const apiPostBody = [...formData.stackDetails, ...formData.stackTags];
    event.preventDefault();
    if (validationResult?.isValid === false) {
      setModalMessage(validationResult.message);
      setShowModal(true);
      setShowValidation(true);
      return;
    }
    if (validateForm()) {
      // Submit form logic here
      const StackJson = {
        [formElements[0].value]: {
          Fields: transformForm(
            formElements.filter((_, index) => index !== 3 && index !== 4)
          ),

          ITSM_End_point: formElements[3].value,
          Orch_API: formElements[3].value,
        },
      };

      console.log(StackJson, "tempapi");
      setModalMessage("Stack Created Successfully");
      setShowModal(true);
      setShowValidation(true);
    }
  };

  const handlePopUpSave = () => {
    const testing = nestedformElements.find(
      (item) => item.name === "Field Type"
    ).value;
    const isEmptyElements = validationSwitch(testing, nestedformElements);
    const checkDuplicate = checkForDuplicates(textBoxes);
    const checkDuplicateField = checkForDuplicateFieldName(
      formElements,
      nestedformElements
    );

    if (!isEmptyElements) {
      setModalMessage("Please fill all the fields");
      setShowModal(true);
      setShowValidation(true);
      return;
    } else if (checkDuplicate) {
      setModalMessage("Please remove duplicate options");
      setShowModal(true);

      return;
    } else if (checkDuplicateField) {
      setModalMessage("Please enter unique Field Name");
      setShowModal(true);

      return;
    }

    updateFormElements(nestedformElements);
  };
  const handlePopUpCancel = () => {
    setIsAddModalOpen(false);
  };
  useEffect(() => {
    Api.getData(testapi.mastersubscriptions).then((response: any) => {
      setDropdown(response);
    });
  }, []);

  const handleNestedFormChange = (index, event, newvalue, name) => {
    let data = [...nestedformElements];
    if (name === "Add Boolean Value") {
      data[7].source[newvalue] = event.target.value;
    } else if (newvalue) {
      if (newvalue === "Free text") {
        setShowArea(false);
      }
      data[index].value = newvalue;
    } else if (name === "Dropdown Values") {
      data[index].source = [event.target.value];
      data[index].value = event.target.value;
    } else if (name === "Select Validation") {
      const currentValue = data[6]?.value as string[];
      const newValue = event.target.checked ? event.target.value : null;

      data[6].value =
        newValue === null
          ? currentValue.filter((val) => val !== event.target.value)
          : [...currentValue, newValue];
    } else if (name === "Min") {
      data[index].min = event.target.value;
    } else if (name === "Max") {
      data[index].max = event.target.value;
    } else if (name === "Dropdown Options") {
      data[4].value = event;
    } else {
      data[index].value = event.target.value;
    }

    if (newvalue === "Dropdown") {
      setShowArea(true);
      data.forEach((ele, index) => {
        if (ele.name === "Type of Dropdown") {
          data[index].source = ["Single Select", "Multi Select"];
        }
      });
    }
    // same field name check
    if (name === "Field Name") {
      const nameExists = formElements.some(
        (item) => item.name === event.target.value
      );
      if (nameExists) {
        setModalMessage(`This field name already exists!`);
        setShowModal(true);
        return;
      }
    }
    setnestedFormElements(data);
  };
  const handleData = (index, event, newValue, name, type) => {
    let data = [...formElements];
    if (newValue) {
      data[index].value = newValue;
    } else {
      data[index].value = event.target.value;
    }

    if (name === "Select Cloud") {
      const subdata = subDropdown?.filter(
        (item: any) => newValue?.toLowerCase() === item?.Cloud.toLowerCase()
      );
      const subscriptionIds = subdata?.map((ele: any) => {
        return `${ele?.SubscriptionName} | ${ele?.SubscriptionID}`;
      });
      formElements.forEach((ele, index) => {
        if (ele.name === "SubscriptionID") {
          data[index].value = subscriptionIds;
        }
      });
    }

    setFormElements(data);
    formElements.forEach((ele: any) => {
      if (
        ele?.validation?.length > 0 &&
        ele?.value !== "" &&
        !ele.validation.includes("Characters Allowed")
      ) {
        const validated = validateUserInput(ele?.value, ele.validation);
        setValidationResult(validated);
      } else if (ele?.type === "IP Address" && ele.value !== "") {
        const validated = isValidIpAddress(event.target.value);
        setValidationResult(validated);
      } else {
        setValidationResult(null);
      }
    });
  };

  const handleApicall = (event) => {
    event.preventDefault();

    if (userinputurl === "") {
      setModalMessage("Please enter url");
      setShowModal(true);
      setShowValidation(true);
    }
    if (userinputurl === existingurl) {
      setModalMessage("Response is already same");
      setShowModal(true);
      setShowValidation(true);
      return;
    } else {
      try {
        setIsLoading(true);
        fetch(userinputurl)
          .then((response) => response.json())
          .then((data) => {
            setUserApiResponse(data);
            setIsLoading(false);
          });
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
        setModalMessage("Error fetching data, please try again");
        setShowModal(true);
      }
    }

    setExistingUrl(userinputurl);
  };
  const toggleSharedResources = (index) => {
    setToggle(!toggle);
  };
  //dropdown add the options

  const handleInputChange = (index, value) => {
    const newTextBoxes = [...textBoxes];
    if (newTextBoxes.includes(value)) {
      //runtime check for add duplicate options
      setModalMessage(`Duplicate ${value} value detected`);
      setShowModal(true);
    }
    newTextBoxes[index] = value;
    setTextBoxes(newTextBoxes);
    handleNestedFormChange(index, textBoxes, "", "Dropdown Options");
  };

  const handleAddTextBox = (index) => {
    setTextBoxes([...textBoxes, { value: "" }]);
  };

  const handleRemoveTextBox = (index) => {
    if (index === 0) {
      return;
    } else if (textBoxes.length > 0) {
      setTextBoxes(textBoxes.filter((_, i) => i !== index));
    }
  };

  const [selectAll, setSelectAll] = useState([]);

  const handleSelectAllChange = (response, item, index, event) => {
    const isChecked = event.target.checked;
    const allItems = response.filter(
      (item) => typeof item === "string" || typeof item === "number"
    );

    if (isChecked) {
      setSelectAll((prevSelectAll) => ({
        ...prevSelectAll,
        [item]: isChecked,
      }));

      setSelectedItems((prevSelectedItems) => {
        let newSelectedItems = [...prevSelectedItems, ...allItems];
        handleNestedFormChange("0", newSelectedItems, "", "Dropdown Options");
        return newSelectedItems;
      });
    } else if (!isChecked) {
      setSelectAll((prevSelectAll) => ({
        ...prevSelectAll,
        [item]: isChecked,
      }));
      setSelectedItems((prevSelectedItems) => {
        let newSelectedItems = [...prevSelectedItems];

        if (prevSelectedItems.includes(item)) {
          // Remove all items associated with the unchecked item
          newSelectedItems = prevSelectedItems.filter(
            (key) => !allItems.includes(key)
          );
        }
        handleNestedFormChange("0", newSelectedItems, "", "Dropdown Options");
        return newSelectedItems;
      });
    }
  };

  const handleCheckboxChange = (item) => {
    setSelectedItems((prevSelectedItems) => {
      let newSelectedItems = [...prevSelectedItems, item];

      if (prevSelectedItems.includes(item)) {
        newSelectedItems = prevSelectedItems.filter((i) => i !== item);
      } else {
        newSelectedItems = [...prevSelectedItems, item];
      }
      handleNestedFormChange("0", newSelectedItems, "", "Dropdown Options");
      return newSelectedItems;
    });
  };

  const renderResponse = (response) => {
    if (Array.isArray(response)) {
      const hasPrimitiveItems = response.some(
        (item) => typeof item === "string" || typeof item === "number"
      );

      return (
        <>
          {response.map((item, index) => (
            <>
              {console.log(selectAll[item], "my test")}
              {index === 0 && hasPrimitiveItems && (
                <div className="d-flex align-items-start">
                  <input
                    className="form-check form-check-inline"
                    type="checkbox"
                    checked={selectAll[item]}
                    onChange={(event) =>
                      handleSelectAllChange(response, item, index, event)
                    }
                  />
                  <p className="m-0">Select All</p>
                </div>
              )}
              <div key={index} className="d-flex align-items-center">
                {typeof item === "string" || typeof item === "number" ? (
                  <>
                    <input
                      className="form-check form-check-inline"
                      type="checkbox"
                      checked={selectedItems.includes(item)}
                      onChange={() => handleCheckboxChange(item)}
                    />
                    <p className="m-0">{item}</p>
                  </>
                ) : (
                  renderResponse(item)
                )}
              </div>
            </>
          ))}
        </>
      );
    } else if (typeof response === "object" && response !== null) {
      return Object.entries(response).map(([key, value], index) => (
        <div key={index} className="mb-2">
          <p className="m-0">{key}:</p>
          <div className="ml-3">{renderResponse(value)}</div>
        </div>
      ));
    } else {
      return <p className="text-dark">{JSON.stringify(response, null, 2)}</p>;
    }
  };

  return (
    <>
      {/* Stack Onboarding Form */}
      <form
        onSubmit={handleSubmit}
        className="row gy-2 launchStackFormSpacing gx-4 align-items-center bg-white h-100"
      >
        {formElements?.map((curr: any, index: number) => {
          if (curr.typedropdown === "Single Select") {
            return (
              <div
                key={index} //curr.key
                className={`col-6 d-flex justify-content-center`}
              >
                <label className="form-label label-width ">
                  {curr.name}
                  {"  "}
                  <span className="text-danger">
                    {curr.mandatory ? "*" : ""}
                  </span>
                  <div className="position-relative d-inline d-block pt-1">
                    {curr.name !== "Select Cloud" && (
                      <FontAwesomeIcon
                        fontSize={"15px"}
                        icon={faCircleXmark}
                        className="cursor-pointer float-end align-self-end position-absolute top-0 start-100 translate-middle pt-2 pe-2"
                        onClick={() =>
                          handleRemoveElement(curr.name, curr.type)
                        }
                      />
                    )}

                    <Autocomplete
                      // freeSolo

                      disablePortal
                      autoHighlight
                      id="autocomplete"
                      options={
                        curr.dropdownoptions === null
                          ? curr.source
                          : curr.dropdownoptions
                      }
                      sx={{ height: "32px" }}
                      value={curr?.value}
                      onChange={(event: any, newValue: string | null) => {
                        handleData(
                          index,
                          event,
                          newValue,
                          curr.name,
                          curr.type
                        );
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div>
                </label>
              </div>
            );
          }
          if (curr.typedropdown === "Multi Select") {
            return (
              <div
                key={index} //curr.key
                className={`col-6 d-flex justify-content-center`}
              >
                <label className="form-label label-width">
                  {curr.name}
                  {"  "}
                  <span className="text-danger">
                    {curr.mandatory ? "*" : ""}
                  </span>
                  <div className="position-relative pt-1">
                    <FontAwesomeIcon
                      fontSize={"15px"}
                      icon={faCircleXmark}
                      className={`cursor-pointer float-end align-self-end ${
                        !isAddModalOpen ? "myRequest-dropdown" : ""
                      } position-absolute top-0 start-100 translate-middle pt-2 pe-2`}
                      onClick={() => handleRemoveElement(curr.name, curr.type)}
                    />

                    <CustomAutoComplete
                      id="multiple-limit-tags"
                      limitTags={2}
                      options={curr.dropdownoptions}
                      value={curr?.value === "" ? [] : curr?.value}
                      onChange={(event, newValue) => {
                        // Update the value of the current field when a new option is selected
                        const updatedFormData = [...formElements];
                        updatedFormData[index].value = newValue;
                        setFormElements(updatedFormData);
                      }}
                      placeholder={""}
                      error={false}
                    />
                  </div>
                </label>
              </div>
            );
          }
          if (curr.type === "Boolean") {
            return (
              <div className={`col-6 d-flex justify-content-center`}>
                <label className="form-label label-width">
                  {curr.name}
                  {"  "}
                  <span className="text-danger">
                    {curr.mandatory ? "*" : ""}
                  </span>

                  <div className="d-flex pt-1">
                    <div className="position-relative d-inline d-block  ">
                      <FontAwesomeIcon
                        fontSize={"15px"}
                        icon={faCircleXmark}
                        className="cursor-pointer float-end align-self-end position-absolute top-0 start-100 translate-middle pb-3 ps-2"
                        onClick={() =>
                          handleRemoveElement(curr.name, curr.type)
                        }
                      />
                      {curr.source.map((option: any, index: number) => (
                        <div className="  form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            value={option}
                            name="inlineRadioOptions"
                          />
                          <label className="form-check-label">{option}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                </label>
              </div>
            );
          }
          if (
            curr.type === "Text" ||
            curr.type === "Number" ||
            curr.type === "textarea" ||
            curr.type === "IP Address"
          ) {
            return (
              <div className={`col-6 d-flex justify-content-center `}>
                <label className="form-label label-width">
                  {curr.name}
                  {"  "}
                  <span className="text-danger">
                    {curr.mandatory ? "*" : ""}
                  </span>

                  <div className="position-relative d-inline d-block pt-1">
                    {curr.name !== "Name Of Stack" &&
                      curr.name !== "SubscriptionID" &&
                      curr.name !== "ITSM_End_point" &&
                      curr.name !== "Orch_API" && (
                        <FontAwesomeIcon
                          fontSize={"15px"}
                          icon={faCircleXmark}
                          className="cursor-pointer float-end align-self-end position-absolute top-0 start-100 translate-middle pt-2 pe-2"
                          onClick={() =>
                            handleRemoveElement(curr.name, curr.type)
                          }
                        />
                      )}

                    <div className="d-flex d-inline">
                      <input
                        className="form-control form-control-sm d-inline"
                        type={
                          curr.type === "IP Address"
                            ? "text"
                            : curr.type === "Text"
                            ? "text"
                            : curr.type === "Number"
                            ? "number"
                            : curr.type
                        }
                        value={curr.value}
                        {...(curr.type !== "IP Address" && {
                          minLength: curr.min,
                          maxLength: curr.max,
                          min: curr.min,
                          max: curr.max,
                        })}
                        onChange={(event) =>
                          curr.type === "textarea"
                            ? ""
                            : handleData(index, event, "", "", curr.type)
                        }
                      />
                    </div>
                  </div>
                </label>
              </div>
            );
          }

          if (curr.type === "Password") {
            return (
              <div className={`col-6 d-flex justify-content-center `}>
                <label className="form-label label-width">
                  {curr.name}
                  {"  "}
                  <span className="text-danger">
                    {curr.mandatory ? "*" : ""}
                  </span>
                  <div className="position-relative d-inline d-block pt-1">
                    <FontAwesomeIcon
                      fontSize={"15px"}
                      icon={faCircleXmark}
                      className="cursor-pointer float-end align-self-end position-absolute top-0 start-100 translate-middle pt-2 pe-2"
                      onClick={() => handleRemoveElement(curr.name, curr.type)}
                    />

                    <div className="d-flex d-inline">
                      <input
                        className="form-control form-control-sm d-inline"
                        type={showPassword ? "text" : "password"}
                        value={curr.value}
                        minLength={curr.min}
                        maxLength={curr.max}
                        min={curr.min}
                        max={curr.max}
                        onChange={(event) =>
                          handleData(index, event, "", "", curr.type)
                        }
                      />
                      {showPassword ? (
                        <FontAwesomeIcon
                          fontSize={"15px"}
                          icon={faEye}
                          className="  cursor-pointer eye-icon"
                          onClick={handleClickShowPassword}
                        />
                      ) : (
                        <FontAwesomeIcon
                          fontSize={"15px"}
                          icon={faEyeSlash}
                          className="  cursor-pointer eye-icon"
                          onClick={handleClickShowPassword}
                        />
                      )}
                    </div>
                  </div>
                </label>
              </div>
            );
          }

          if (curr.type === "Text Area") {
            return (
              <div className=" col-6 d-flex justify-content-center pb-3  ">
                <label className="form-label label-width ">
                  {curr.name}
                  {"  "}
                  <span className="text-danger">*</span>
                  <div className="position-relative d-inline d-block pt-1">
                    <FontAwesomeIcon
                      fontSize={"15px"}
                      icon={faCircleXmark}
                      className="cursor-pointer float-end align-self-end position-absolute top-0 start-100 translate-middle pt-2 pe-2"
                      onClick={() => handleRemoveElement(curr.name, curr.type)}
                    />
                    <textarea
                      className="form-control form-control-m "
                      value={curr.value}
                      maxLength={curr.max}
                      onChange={(event) =>
                        handleData(index, event, "", "", curr.type)
                      }
                    />
                  </div>
                </label>
              </div>
            );
          }
          if (curr.type === "Email") {
            return (
              <div className={`col-6 d-flex justify-content-center`}>
                <label className="form-label label-width">
                  {curr.name}
                  {"  "}
                  <span className="text-danger">
                    {curr.mandatory ? "*" : ""}
                  </span>
                  <div className="position-relative d-inline d-block pt-1">
                    <FontAwesomeIcon
                      fontSize={"15px"}
                      icon={faCircleXmark}
                      className="cursor-pointer float-end align-self-end position-absolute top-0 start-100 translate-middle pt-2 pe-2"
                      onClick={() => handleRemoveElement(curr.name, curr.type)}
                    />

                    <input
                      className="form-control form-control-sm"
                      type={"email"}
                      value={curr.value}
                      onChange={(event) =>
                        handleData(index, event, "", "", curr.type)
                      }
                    />
                  </div>
                </label>
              </div>
            );
          }
        })}

        {isAddModalOpen && (
          <KubernetesPopupWrapper
            height={"450px"}
            width={"1050px"}
            title="Add Field"
            handleSave={handlePopUpSave}
            handleClose={handlePopUpCancel}
          >
            <div className="row">
              {nestedformElements?.map((innercurr: any, index: number) => {
                if (innercurr.type === "Text") {
                  return (
                    <div
                      className={` col-6 d-flex justify-content-center pb-3`}
                    >
                      <label className="form-label label-width">
                        {innercurr.name}
                        {"  "}
                        <span className="text-danger">*</span>
                        <input
                          className={`form-control form-control-sm mt-1${
                            showValidation && innercurr.value.length < 1
                              ? "border border-danger"
                              : ""
                          }`}
                          type={"text"}
                          value={innercurr.value}
                          onChange={(event) =>
                            handleNestedFormChange(
                              index,
                              event,
                              "",
                              innercurr.name
                            )
                          }
                        />
                      </label>
                    </div>
                  );
                } else if (innercurr.name === "Is mandatory") {
                  return (
                    <div className={` col-6 d-flex align-items-center`}>
                      <label className="ps-4 pt-3 d-flex d-inline">
                        {innercurr.name}
                        {"?"}

                        <label className="d-flex ps-5">
                          Yes
                          <Form.Check
                            type="switch"
                            id="sharedResources-switch"
                            checked={toggle}
                            onChange={() => toggleSharedResources(index)}
                            className="mx-3 mb-3 toggle-rotate"
                          />
                          No
                        </label>
                      </label>
                    </div>
                  );
                } else if (
                  innercurr.name === "Add Boolean Value" &&
                  nestedformElements[2].value === "Boolean"
                ) {
                  return (
                    <div className={`col-6 d-flex justify-content-center`}>
                      <label className="form-label label-width">
                        {innercurr.name}
                        <span className="text-danger">*</span>{" "}
                        {/* Required indicator */}
                        <div className="row">
                          {innercurr.source.map(
                            (option: any, booleanindex: number) => (
                              <div className="col">
                                <input
                                  className="form-control form-control-sm mt-1"
                                  type="text"
                                  value={option}
                                  onChange={(event) =>
                                    handleNestedFormChange(
                                      index,
                                      event,
                                      booleanindex,
                                      innercurr.name
                                    )
                                  }
                                  required
                                />
                              </div>
                            )
                          )}
                        </div>
                      </label>
                    </div>
                  );
                } else if (
                  innercurr.name === "Field Type" ||
                  (nestedformElements[2].value === "Dropdown" &&
                    innercurr.name === "Type of Dropdown")
                ) {
                  return (
                    <div className={`col-6 d-flex justify-content-center pb-3`}>
                      <label className="form-label label-width">
                        {innercurr.name}
                        {"  "}
                        <span className="text-danger">*</span>
                        <Autocomplete
                          // freeSolo
                          disablePortal
                          autoHighlight
                          id="autocomplete"
                          options={innercurr?.source}
                          sx={{ height: "32px" }}
                          value={innercurr?.value}
                          onChange={(event: any, newValue: string | null) =>
                            handleNestedFormChange(
                              index,
                              event,
                              newValue,
                              innercurr.name
                            )
                          }
                          renderInput={(params) => (
                            <TextField
                              className="mt-1"
                              {...params}
                              error={
                                showValidation && innercurr.value.length < 1
                              }
                            />
                          )}
                        />
                      </label>
                    </div>
                  );
                } else if (
                  //for dropdown
                  innercurr.type === "dropdownoptions" &&
                  nestedformElements[2].value === "Dropdown"
                ) {
                  return (
                    <>
                      <div className={`col-6 d-flex justify-content-center`}>
                        <label className="form-label label-width">
                          {innercurr.name}
                          {"  "}
                          <div className="ps-5">
                            {" "}
                            <div className="  form-check form-check-inline pt-1">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="inlineRadioOptions"
                                onChange={() => setShowSubmit(false)}
                                defaultChecked
                              />
                              <label className="form-check-label">
                                Static Values
                              </label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="inlineRadioOptions"
                                onChange={() => setShowSubmit(true)}
                              />
                              <label className="form-check-label">API</label>
                            </div>
                          </div>
                          {showSubmit && (
                            <>
                              <input
                                className={`form-control ${
                                  showValidation && userinputurl.length < 1
                                    ? "border border-danger"
                                    : ""
                                }`}
                                type="text"
                                placeholder="Enter url"
                                value={userinputurl}
                                onChange={(event) =>
                                  setUserInputUrl(event.target.value)
                                }
                              />
                              <button
                                type="button"
                                className="btn btn-primary mt-3"
                                onClick={handleApicall}
                              >
                                Submit
                              </button>
                            </>
                          )}
                        </label>
                      </div>

                      {!showSubmit && (
                        <div className="col-6 d-flex justify-content-start">
                          <div className="">
                            <label className="form-label label-width ps-4">
                              Add Your Options
                            </label>
                            <div className="d-flex stk-height flex-wrap">
                              {textBoxes.map((value, index) => (
                                <div
                                  key={index}
                                  className="d-flex d-inline pt-2 align-items-center col-4"
                                >
                                  <p className="m-0 p-0 pe-2 ps-2">
                                    {index + 1}.{" "}
                                  </p>
                                  <input
                                    type="text"
                                    className={`form-control form-control-sm ${
                                      index === textBoxes.length - 1
                                        ? "col-3"
                                        : ""
                                    }`}
                                    onChange={(e) =>
                                      handleInputChange(index, e.target.value)
                                    }
                                  />
                                  {index === textBoxes.length - 1 && (
                                    <div
                                      className="input-group-text bg-white cursor-pointer me-1 ms-3"
                                      onClick={() => handleAddTextBox(index)}
                                    >
                                      <FontAwesomeIcon
                                        icon={faPlus}
                                        fontSize={"11px"}
                                        className="py-1  text-success "
                                      />
                                    </div>
                                  )}

                                  {index >= 0 && (
                                    <div
                                      className={` input-group-text bg-white cursor-pointer
                                ${index === textBoxes.length - 1 ? "" : "ms-2"}
                                    `}
                                      onClick={() => handleRemoveTextBox(index)}
                                    >
                                      <FontAwesomeIcon
                                        className={`py-1  text-danger  ${
                                          index === 0 ? "opacity-25" : ""
                                        }`}
                                        icon={faMinus}
                                        fontSize={"11px"}
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {showSubmit && (
                        <div className="col-6 d-flex justify-content-center response-height">
                          {isLoading ? (
                            <CircularProgress />
                          ) : (
                            userapiResponse && (
                              <div className="text-dark">
                                {renderResponse(userapiResponse)}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </>
                  );
                } else if (
                  innercurr.type === "checkbox" &&
                  (nestedformElements[2].value === "Text" ||
                    nestedformElements[2].value === "Password")
                ) {
                  return (
                    <>
                      {" "}
                      <div className=" row col-6 d-flex ps-5">
                        <label className="form-label label-width">
                          {innercurr.name}{" "}
                          <span className="text-danger">*</span>
                        </label>

                        {innercurr.source.map((option: any, index: number) => (
                          <>
                            {/* <span className="text-danger">
                        {innercurr.mandatory ? "*" : ""}
                      </span> */}
                            <label className="col-6 m-0  form-label label-width d-flex align-items-center pt-1">
                              <div
                                key={option}
                                className="form-check form-check-inline"
                              >
                                <input
                                  className="form-check-input"
                                  type={innercurr.type}
                                  value={option}
                                  checked={(
                                    (nestedformElements[6]
                                      ?.value as string[]) || []
                                  ).includes(option)}
                                  onChange={(event) =>
                                    handleNestedFormChange(
                                      index,
                                      event,
                                      "",
                                      innercurr.name
                                    )
                                  }
                                />
                              </div>
                              {option}
                            </label>
                          </>
                        ))}
                      </div>
                    </>
                  );
                } else if (
                  (innercurr.type === "Number" ||
                    innercurr.type === "Text" ||
                    innercurr.type === "Text Area" ||
                    innercurr.type === "Password") &&
                  (nestedformElements[2].value === "Number" ||
                    nestedformElements[2].value === "Text" ||
                    nestedformElements[2].value === "Text Area" ||
                    nestedformElements[2].value === "Password")
                ) {
                  return (
                    <div className={`col-6 d-flex justify-content-center`}>
                      <label className="form-label label-width pt-1">
                        {innercurr.type !== "Text Area" &&
                        nestedformElements[2].value !== "Text Area"
                          ? innercurr.name
                          : "Add Max Length"}
                        <span className="text-danger">*</span>{" "}
                        <div className="d-flex justify-content-around pt-1">
                          {innercurr.type !== "Text Area" &&
                            nestedformElements[2].value !== "Text Area" && (
                              <div className="input-group pe-4  align-items-center">
                                {" "}
                                <label className="pe-2">
                                  {nestedformElements[2].value === "Number"
                                    ? "Min Value :"
                                    : "Min Length :"}
                                </label>
                                <input
                                  className="form-control form-control-sm "
                                  type={innercurr.type}
                                  value={innercurr.min}
                                  onChange={(event) =>
                                    handleNestedFormChange(
                                      index,
                                      event,
                                      "",
                                      "Min"
                                    )
                                  }
                                  required
                                />
                              </div>
                            )}
                          <div className="input-group  align-items-center">
                            <label className="pe-2">
                              {nestedformElements[2].value === "Number"
                                ? "Max Value:"
                                : "Max Length:"}{" "}
                            </label>
                            <input
                              className="form-control form-control-sm"
                              type={innercurr.type}
                              value={innercurr.max}
                              onChange={(event) =>
                                handleNestedFormChange(index, event, "", "Max")
                              }
                              required
                            />
                          </div>
                        </div>
                      </label>
                    </div>
                  );
                }
              })}
            </div>
          </KubernetesPopupWrapper>
        )}

        <div className={`col-2 d-flex justify-content-center`}>
          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={addField}
          >
            Add Field
          </button>
        </div>
        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-outline-success col-4">
            Submit
          </button>
        </div>
      </form>

      <PopUpModal
        show={showModal}
        modalMessage={modalMessage}
        onHide={() => setShowModal(false)}
      />
    </>
  );
};
export default StackOnboardingForm;
