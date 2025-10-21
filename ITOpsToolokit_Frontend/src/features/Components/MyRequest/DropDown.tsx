import React, { useState, useEffect } from "react";
import {
  FormControl,
  TextField,
  Autocomplete,
  Chip,
  Checkbox, Tooltip 
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectCommonConfig,
  updateTaggingFilterData,
  updateTaggingDropdownFilterArray,
  updateOrphanFilterData,
  updateAdvisoryFilterData,
  updateComplainceFilterData
} from "../CommonConfig/commonConfigSlice";
import SnakeBarAlert from "../../Utilities/SnakeBarAlert";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown, DropdownButton } from "react-bootstrap";

const DropDown = (props) => {
  const currentUsers = useAppSelector(selectCommonConfig);
  const referenceProjects = currentUsers.activeUserDetails.tempDemo;
  const [selectedProjects, setSelectedProjects] = useState(
    currentUsers.activeUserDetails.projects
  );
  const [subscriptionKeys, setSubscriptionKeys] = useState(
    currentUsers.activeUserDetails.subscriptionsID
  );
  const [currentProjects, setCurrentProjects] = useState(
    currentUsers.activeUserDetails.tempDemo
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const dispatch = useAppDispatch();

  const getSubscriptionOptions = (selectedProjects) => {
    const subscriptions = selectedProjects.flatMap(
      (project) => referenceProjects[project] || []
    );
    return [...new Set(subscriptions)];
  };

  const handleChange = (change, data) => {
    if (change === "projects") {
      function handleClick() {
        props.sendDataToParent(data);
      }
      handleClick();
      setSelectedProjects(data);
      const newUserDemo = {};
      data.forEach((project) => {
        if (referenceProjects[project]) {
          newUserDemo[project] = referenceProjects[project];
        }
      });
      setCurrentProjects(newUserDemo);
      setSubscriptionKeys(getSubscriptionOptions(data));
    } else if (change === "subscriptions") {
      const newSubscriptionKeys = data;
      const newSelectedProjects = selectedProjects.filter((project) =>
        newSubscriptionKeys.some((subscriptionKey) =>
          referenceProjects[project]?.includes(subscriptionKey)
        )
      );

      setSelectedProjects(newSelectedProjects);
      setSubscriptionKeys(newSubscriptionKeys);
    }
  };


  useEffect(() => {
    dispatch(updateTaggingDropdownFilterArray({ key: "SubscriptionID", values: [...subscriptionKeys] }))
    dispatch(updateTaggingFilterData())
    dispatch(updateOrphanFilterData())
    dispatch(updateAdvisoryFilterData())
    dispatch(updateComplainceFilterData())
   
  }, [subscriptionKeys])

  return (
  
      <div
        className="tab-content position-absolute top-99 end-10 myRequest-dropdown sub_dropdown pe-5 me-5"
        id="myTabContent"
      >
        <div className="d-flex h-100 bg-white p-2 border border-primary shadow-lg rounded-2">
          <div
            className="tab-pane fade show active"
            id="home-tab-pane"
            role="tabpanel"
            aria-labelledby="home-tab"
          >
            <div className="p-2">
              <FormControl variant="outlined" className="form-control">
                <Autocomplete
                  id="multiple-limit-tags"
                  multiple
                  open={true}
                  limitTags={1}
                  options={Object.keys(referenceProjects)}
                  value={selectedProjects}
                  onChange={(event, newValue) => {
                    if (newValue.length === 0) {
                      setSnackbarMessage(
                        "At least one project must be selected"
                      );
                      setSnackbarOpen(true);
                    } else {
                      handleChange("projects", newValue);
                    }
                  }}
                  disableCloseOnSelect
                  getOptionLabel={(option) => option}
                  renderOption={(props, option, { selected }) => (
                    <span className="d-flex align-items-center">
                      <li
                        {...props}
                        className="ps-2 pt-0 d-flex align-items-center"
                      >
                        <span className="cursor-pointer">
                          <Checkbox
                            icon={<Checkbox size="small" />}
                            checked={selected}
                            size={"small"}
                            className="me-2 pt-2 text-primary"
                            sx={{ width: 0 }}
                          />
                          {option}
                        </span>
                      </li>
                      {selectedProjects.includes(option) && (
                        <DropdownButton
                          size="sm"
                          key={"end"}
                          id={`dropdown-button-drop-end`}
                          drop={"end"}
                          title={``}
                          variant="outline treeview-p"
                          className="ms-auto"
                        >
                          {referenceProjects[option].map((subscription) => (
                            <Dropdown.Item
                              key={subscription}
                              eventKey={subscription}
                              className="py-0"
                              onClick={() => {
                                const newSubscriptionKeys =
                                  subscriptionKeys.includes(subscription)
                                    ? subscriptionKeys.filter(
                                        (key) => key !== subscription
                                      )
                                    : [...subscriptionKeys, subscription];
                                handleChange(
                                  "subscriptions",
                                  newSubscriptionKeys
                                );
                              }}
                            >
                              <Checkbox
                                icon={<Checkbox size="small" />}
                                checked={subscriptionKeys.includes(
                                  subscription
                                )}
                                size={"small"}
                                className="me-2 pt-2 text-primary"
                                sx={{ width: 0 }}
                              />
                              <Tooltip
                                title={subscription}
                                placement="top"
                                arrow={true}
                                followCursor={true}
                              >
                                <span className="d-inline-block cursor-pointer py-1">
                                  {subscription.substring(0, 25)}
                                  {subscription.length > 25 ? "..." : ""}
                                </span>
                              </Tooltip>
                            </Dropdown.Item>
                          ))}
                        </DropdownButton>
                      )}
                    </span>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Projects"
                      InputProps={{
                        ...params.InputProps,
                        type: "search",
                      }}
                      sx={{ width: 363 }}
                    />
                  )}
                  renderTags={(value, getTagProps) => (
                    <span className="d-flex flex-wrap">
                      {value.map((option, index) => (
                        <Chip
                          label={option}
                          {...getTagProps({ index })}
                          size="small"
                          deleteIcon={
                            <FontAwesomeIcon
                              icon={faCircleXmark}
                              className="text-white treeview-p"
                            />
                          }
                          className="text-white mx-1 bg-primary"
                        />
                      ))}
                    </span>
                  )}
                />
              </FormControl>
            </div>
            <SnakeBarAlert
              autoHideDuration
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={snackbarOpen}
              message={snackbarMessage}
              onClose={() => {
                setSnackbarOpen(false);
              }}
              severity="error"
            />
          </div>
        </div>
      </div>
    
  );
};

export default DropDown;