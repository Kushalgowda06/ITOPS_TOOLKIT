import React, { useState, useEffect } from "react";
import { faArrowLeftLong, faCaretUp, faCaretDown, faCircleXmark, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DialogActions, Menu, MenuItem, Checkbox, TextField, Chip, ListItemText, Collapse, List, ListItem, Breadcrumbs } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import CustomAutoComplete from "../../Utilities/CustomAutoComplete";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { Api } from "../../Utilities/api";
import { PopUpModal } from "../../Utilities/PopUpModal"
import { Loader } from "../../Utilities/Loader";
import testapi from "../../../api/testapi.json";
import { filterData } from "../../Utilities/filterData";
import { useAppDispatch,useAppSelector } from "../../../app/hooks";
import { selectCommonConfig, setCloudData, setFilteredTaggingData } from "../CommonConfig/commonConfigSlice";

interface SelectedItems {
  [label: string]: string[];
}

const RoleForm = () => {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showValidation, setShowValidation] = useState<any>(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const [formData, setFormData] = useState<any>([
    {
      inputType: "text",
      ApiKey: "RoleName",
      Title: "Role Name",
      value: "",
      description: "Please enter Role Name"
    },
    {
      inputType: "MultiMenuList",
      ApiKey: "MenuList",
      Title: "Menu List",
      value: [],
      description: "Please select the Menu List"
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
  const [anchorEl, setAnchorEl] = useState(null);
  const [openedSubmenu, setOpenedSubmenu] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});
  const [data, setData] = useState([]);
  const options = {
    LaunchStack: [
      { label: "AWS", "permissions": ["Read", "Update", "Add"] },
      { label: "GCP", "permissions": ["Read", "Update", "Add"] },
      { label: "Azure", "permissions": ["Read", "Update", "Add"] },
    ],
    FinOps: [
      { label: "PowerBI", "permissions": ["Read", "Update", "Add"] },
      { label: "Grafana", "permissions": ["Read", "Update", "Add"] }
    ],
    CloudOps: [
      { label: "Start VM", "permissions": ["Read", "Update", "Add"] },
      { label: "Restart VM", "permissions": ["Read", "Update", "Add"] },
      { label: "Resize VM", "permissions": ["Read", "Update", "Add"] },
      { label: "Stop VM", "permissions": ["Read", "Update", "Add"] },
      { label: "k8s Launch Cluster", "permissions": ["Read", "Update", "Add"] },
      { label: "k8s Version Upgrade", "permissions": ["Read", "Update", "Add"] },
      { label: "k8s Node Manager", "permissions": ["Read", "Update", "Add"] },
      { label: "k8s Ingress & Egress", "permissions": ["Read", "Update", "Add"] },
      { label: "Configuration Manager", "permissions": ["Read", "Update", "Add"] },
      { label: "Ports Manager", "permissions": ["Read", "Update", "Add"] },
      { label: "Idle Session", "permissions": ["Read", "Update", "Add"] },
      { label: "Kubernetes Manager", "permissions": ["Read", "Update", "Add"] },
      { label: "VM Status Manager", "permissions": ["Read", "Update", "Add"] },
      { label: "Role Based Automation", "permissions": ["Read", "Update", "Add"] },
    ],
    Dashboard: [
      { label: "Tagging", "permissions": ["Read", "Update", "Add"] },
      { label: "Orphan Objects", "permissions": ["Read", "Update", "Add"] },
      { label: "Advisory", "permissions": ["Read", "Update", "Add"] },
      { label: "Patching", "permissions": ["Read", "Update", "Add"] },
      { label: "Tag Policy Manager", "permissions": ["Read", "Update", "Add"] }
    ],
    Reports: [
      { label: "ITSM", "permissions": ["Read", "Update", "Add"] },
      { label: "Observability", "permissions": ["Read", "Update", "Add"] },
      { label: "Power BI", "permissions": ["Read", "Update", "Add"] },
    ],
    Onboarding: [
      { label: "BU", "permissions": ["Read", "Update", "Add"] },
      { label: "Project", "permissions": ["Read", "Update", "Add"] },
      { label: "Subscription", "permissions": ["Read", "Update", "Add"] },
      { label: "User", "permissions": ["Read", "Update", "Add"] },
      { label: "Role", "permissions": ["Read", "Update", "Add"] },
      { label: "CostCode", "permissions": ["Read", "Update", "Add"] },
      { label: "Application", "permissions": ["Read", "Update", "Add"] },
      { label: "Patch", "permissions": ["Read", "Update", "Add"] },
    ],
    StackOnboarding: [
      { label: "StackOnboarding", "permissions": ["Read", "Update", "Add"] },
    ],
  };

  const pathname = location.pathname;
  const crumbs = !id
    ? { to: "/role-onboarding", title: "Role Management" }
    : { to: pathname, title: "Role update" };

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
      to="/onboarding/role-onboarding-details"
      title="BU"
    >
      role
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
      const apiEndPoints = ['users'];
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

  const dropdownsObject = { "Members": Object.keys(filterData("FullName", data["users"])) }

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
      // else if (field.inputType === "MultiMenuList") {
      //   return field.value.length > 0;
      // }
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
    const resetFormFields = formData.map((field) => {
      if (field.inputType === "MultiMenuList") {
        return { ...field, value: [] };
      } else {
        return { ...field, value: field.inputType === "MultiMenus" ? [] : "" };
      }
    });
    setFormData(resetFormFields);
    handleReset();
    setShowValidation(false);
  };

  const handleClickTextField = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseDropdown = () => {
    setAnchorEl(null);
  };

  const handleToggleLabel = (submenu: string, label: string) => {
    setSelectedItems((prev) => {
      if (prev[label]) {
        const updated = { ...prev };
        delete updated[label];
        return updated;
      } else {
        return { ...prev, [label]: [] };
      }
    });
  };

  const handleTogglePermission = (event: React.MouseEvent, label: string, permission: string) => {
    event.stopPropagation();
    setSelectedItems((prev) => {
      const currentPermissions = prev[label] || [];
      if (currentPermissions.includes(permission)) {
        return { ...prev, [label]: currentPermissions.filter((p) => p !== permission) };
      } else {
        return { ...prev, [label]: [...currentPermissions, permission] };
      }
    });
  };

  const handleToggleSubmenu = (submenu) => {
    if (openedSubmenu === submenu) {
      setOpenedSubmenu(null);
    } else {
      setOpenedSubmenu(submenu);
    }
  };

  const handleDeleteChip = (chipToDelete) => {
    const keyToDelete = Object.keys(selectedItems).find(key => key === chipToDelete);
    if (keyToDelete) {
      setSelectedItems(prevState => {
        const newState = { ...prevState };
        delete newState[keyToDelete];
        return newState;
      });
    } else {
      console.error("No matching key found for chipToDelete:", chipToDelete);
    }
  };

  const handleReset = () => {
    setSelectedItems({});
    handleCloseDropdown();
  };

  // Function to extract the top-level labels and their permissions from the MenuList data
  const extractMenuListData = (data) => {
    const result = {};
    const traverse = (obj) => {
      for (let key in obj) {
        if (Array.isArray(obj[key])) {
          obj[key].forEach(permissionGroup => {
            for (let groupKey in permissionGroup) {
              if (permissionGroup[groupKey]) {
                // Store the permissions array under the group key
                result[groupKey] = permissionGroup[groupKey];
              }
            }
          });
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          traverse(obj[key]);
        }
      }
    };
    traverse(data);
    return result;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.getDataByID(testapi.roles, id);
        const updatedFormData = formData.map(field => {
          if (response.hasOwnProperty(field.ApiKey)) {
            if (field.ApiKey === "MenuList") {
              const afterExtract = extractMenuListData(response.MenuList);
              setSelectedItems(afterExtract)
            } else {
              return { ...field, value: response[field.ApiKey] };
            }
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

  const menuListStructure = Object.keys(options).reduce((acc, menu) => {
    const labels = options[menu].map(option => option.label);
    const menuItems = labels.reduce((menuAcc, label) => {
      if (selectedItems[label]) {
        menuAcc[label] = selectedItems[label];
      }
      return menuAcc;
    }, {});

    if (Object.keys(menuItems).length > 0) {
      acc[menu] = [menuItems];
    }
    return acc;
  }, {});

  var postBody = {};
  postBody = formData.reduce((acc, field) => {
    acc[field.ApiKey] = field.value;
    return acc;
  }, {});

  postBody["Pages"] = [""]
  postBody["Permissions"] = [""]
  postBody["MenuList"] = [menuListStructure]

  const handleOnHide = () => {
    setIsLoading(false)
    setShowModal(false)
    }

  const handleFormSave = async () => {
    setIsLoading(true)
    if (isFormValid()) {
      try {
        const response = !id ? Api.postData(testapi.roles, postBody) : Api.putData(testapi.roles, postBody, id)
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
        setModalMessage("Role Onboarded Successfully!!");
      } catch (error) {
        setShowModal(true);
        setModalMessage(` ${error} An error occurred while submitting the form.`);
      }
    } else {
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
            <h4 className="p-2 ps-3 fw-bold k8title"> Role Management </h4>
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
        <div className="">
          <div className="launchStack p-5 ms-5">
            <form className="row gy-2 d-flex justify-content-between align-items-center">
              {formData.map((curr: any, index: number) => {
                return (
                  <div className={`col-md-6 d-flex justify-content-start`}>
                    {curr.inputType === "text" ?
                      (
                        <label className="form-label label-width w-75">
                          <div className="d-flex justify-content-between">
                            <span >
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
                            className={`form-control form-control-m mt-2 ${showValidation ? "border border-danger" : ""}`}
                            type={curr.inputType}
                            value={curr.value}
                            onChange={(event) => handleFormChange(index, event)}
                          />
                          <small className="form-text form_text_des">{curr.description}</small>
                        </label>
                      ) : curr.inputType === "MultiMenuList" ?
                        (<div className="w-75">
                          <div className="d-flex justify-content-between pb-2">
                            <span className="tab">
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
                          <Autocomplete
                            multiple
                            limitTags={2}
                            className={`${showValidation ? "border border-danger" : ""}`}
                            id="multiple-limit-tags"
                            options={[]} // Only include keys with selected permissions
                            value={Object.keys(selectedItems).filter(key => selectedItems[key].length > 0)} // Display only keys with selected permissions
                            onChange={(event, newValue) => {
                              setSelectedItems(prevState => ({
                                ...prevState,
                                ...newValue.reduce((acc, curr) => ({ ...acc, [curr]: prevState[curr] }), {}),
                              }));
                            }}
                            onInputChange={(event, value, reason) => {
                              if (reason === 'clear') {
                                handleReset();
                              }
                            }}
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip label={option} {...getTagProps({ index })} size="small" className="text-white mx-1 mb-1 bg-primary" deleteIcon={<FontAwesomeIcon icon={faCircleXmark} className="text-white treeview-p" />} onDelete={() => handleDeleteChip(option)} />
                              ))
                            }
                            renderInput={(params) => (
                              <TextField {...params} variant="outlined" placeholder="Select Menu Items" onClick={handleClickTextField} />
                            )}
                          />
                          <Menu
                            id="dropdown-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleCloseDropdown}
                            PaperProps={{
                              style: {
                                width: '30%', // This should match the width of the Autocomplete component
                              },
                            }}
                          >
                            {Object.keys(options).map((submenu) => (
                              <React.Fragment key={submenu}>
                                <MenuItem onClick={() => handleToggleSubmenu(submenu)}>
                                  <ListItemText primary={submenu} />
                                  {openedSubmenu === submenu ? <FontAwesomeIcon icon={faCaretUp} /> : <FontAwesomeIcon icon={faCaretDown} />}
                                </MenuItem>
                                <Collapse in={openedSubmenu === submenu} timeout="auto" unmountOnExit>
                                  <List component="div" disablePadding>
                                    {options[submenu].map((option) => (
                                      <React.Fragment key={option.label}>
                                        <ListItem divider role={undefined} dense button onClick={() => handleToggleLabel(submenu, option.label)}>
                                          <Checkbox
                                            edge="start"
                                            className="text-primary"
                                            checked={Object.keys(selectedItems).includes(option.label)}
                                            tabIndex={-1}
                                            disableRipple
                                            size="small"
                                          />
                                          <ListItemText primary={option.label} />
                                          {openedSubmenu === submenu && (
                                            <FontAwesomeIcon icon={selectedItems[option.label]?.length > 0 ? faCaretUp : faCaretDown} />
                                          )}
                                        </ListItem>
                                        {selectedItems[option.label] && (
                                          <List component="div" disablePadding className="ps-5">
                                            {option.permissions.map((permission) => (
                                              <ListItem key={permission} role={undefined} dense button onClick={(e) => handleTogglePermission(e, option.label, permission)}>
                                                <Checkbox
                                                  required
                                                  edge="start"
                                                  className="text-primary"
                                                  checked={selectedItems[option.label]?.includes(permission)}
                                                  tabIndex={-1}
                                                  disableRipple
                                                  size="small"
                                                />
                                                <ListItemText primary={permission} />
                                              </ListItem>
                                            ))}
                                          </List>
                                        )}
                                      </React.Fragment>
                                    ))}

                                  </List>
                                </Collapse>
                              </React.Fragment>
                            ))}
                          </Menu>
                          <small className="form-text form_text_des">{curr.description}</small>
                        </div>

                        ) : curr.inputType === "MultiMenus" ?
                          (
                            <label className="form-label label-width w-75 mt-5">
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
                              // TextFieldSx={{ height: 200 }}
                              />
                              <small className="form-text form_text_des">{curr.description}</small>
                            </label>) : null}
                  </div>
                );
              })}
            </form>
            <div className="d-flex justify-content-center mt-5 pt-5">
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
      {isLoading ? <Loader load={load} isLoading={isLoading} /> : null } 
      <PopUpModal show={showModal} modalMessage={modalMessage} onHide={handleOnHide} />
    </div>
  );
};

export default RoleForm;
