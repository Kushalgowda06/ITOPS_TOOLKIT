import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
  DialogActions,
  Button,
  DialogContent,
  Switch,
  FormControl,
  TextField,
  Autocomplete,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PopUpModal } from "../../Utilities/PopUpModal";
import {useNavigate } from "react-router-dom";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import Tile from "../Tiles/Tile";
import { Toast, Modal } from "react-bootstrap";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import { Api } from "../../Utilities/api";
import testapi from "../../../api/testapi.json";
import { KubernetesPopupWrapper } from "../KubernetesPopUp/KubernetesPopupWrapper";

function ManageTaggingPolicy() {
  const [tags, setTags] = useState<any[]>([]); // holds the api data
  const [openDialog, setOpenDialog] = useState(false); // new tag modal popUp
  const [newTagName, setNewTagName] = useState(""); // new tag name
  const [isMandatory, setIsMandatory] = useState(false); // new tag Mandatory status
  const [description, setDescription] = useState(""); // new Description
  const [unsavedChanges, setUnsavedChanges] = useState(false); // data change status
  const [showToast, setShowToast] = useState(false); // alert popUp
  const [showToastMessage, setShowToastMessage] = useState(""); // alert popUp Message
  const [toastColor, setToastColor] = useState(""); // alert popUp Color
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // alert message for new tag name fields
  const [showDeleteModal, setShowDeleteModal] = useState(false); // modal for tag delete conformation
  const [tagToDelete, setTagToDelete] = useState<any>(null); // targe for delete tag
  const [emptyFields, setEmptyFields] = useState<string[]>([]);
  const currentUsers: any = useAppSelector(selectCommonConfig);
  const defaultSubscription = currentUsers.activeUserDetails.subscriptionsID[0];
  const [subscriptionKeys, setSubscriptionKeys] = useState(defaultSubscription);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const cloud = useMemo(() => {
    if (subscriptionKeys === "361568250748") return "AWS";
    if (subscriptionKeys === "aab65732-30e7-48a6-93c9-1acc5c8e4413") return "Azure";
    return "GCP";
  }, [subscriptionKeys]);

  const fetchTags = useCallback(async () => {
    setError(null);
    try {
      const response: any = await Api.getData(testapi.getmanagetags);
      setTags(response);
    } catch (error) {
      console.error("Error fetching tags:", error);
      setError("Failed to load tagging details.");
      setShowModal(true);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);
  // dialog open for add new tag
  const handleOpenDialog = useCallback(() => {
    setOpenDialog(true);
  }, []);

  // dialog close for add new tag
  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setNewTagName("");
    setIsMandatory(false);
    setDescription("");
    setAlertMessage(null);
    setEmptyFields([]);
  }, []);

  // save button function for Home Screen
  const handleSaveButtonClick = useCallback(async () => {
    setError(null);
    try {
      const promises = tags?.map((tag) =>
        axios.put(`${testapi.baseURL}/tags/${tag.id}`, {
          Mandatory: tag.Mandatory,
        })
      );
      await Promise.all(promises);
      setUnsavedChanges(false);// unsave changes condition
      setShowToast(true);
      setShowToastMessage("Updation Successful");
      setToastColor("bg-success bg-gradient");
    } catch (error) {
      console.error("Error updating tags:", error);
      setShowToast(true);
      setShowToastMessage("Updation Failed");
      setToastColor("bg-danger bg-gradient");
    }
  }, [tags]);

  // Mandatory Tag Toggle switch
  const handleSwitchChange = useCallback((tagId: any, isChecked: boolean) => {
    const updatedTags = tags?.map((tag) =>
      tag.id === tagId ? { ...tag, Mandatory: isChecked ? "True" : "False" } : tag
    );
    setTags(updatedTags);
    setUnsavedChanges(true);
    setShowToast(true);
    setShowToastMessage(isChecked ? "Mandatory Tag ON " : "Mandatory Tag OFF");
    setToastColor(isChecked ? "bg-success bg-gradient" : "bg-danger bg-gradient");
    setTimeout(() => setShowToast(false), 2000);
  }, [tags]);

  // cancel button function for Home Screen
  const handleCancelButtonClick = useCallback(() => {
    setUnsavedChanges(false);
    setShowToast(true);
    setShowToastMessage("Updation Canceled");
    setToastColor("bg-danger bg-gradient");
    setTimeout(() => setShowToast(false), 2000);
  }, []);

  const handleSaveNewTag = useCallback(async () => {
    setError(null);
    // Check if all required fields are filled
    const empty: string[] = [];
    if (!newTagName) empty.push("newTagName");
    if (!description) empty.push("description");

    if (empty.length > 0) {
      setEmptyFields(empty);
      setAlertMessage("Please fill all the empty fields.");
      setTimeout(() => {
        setAlertMessage(null);
        setEmptyFields([]);
      }, 2000);
      return;
    }

    try {
      const response: any = await Api.postData(testapi.getmanagetags, {
        CustomerName: "CTS",
        SubscriptionID: subscriptionKeys,
        Cloud: cloud,
        TagName: newTagName,
        Mandatory: isMandatory,
        Description: description,
      });
      setTags([...tags, response.data.data]);
      setNewTagName("");
      setDescription("");
      setUnsavedChanges(false);
      setShowToast(true);
      setToastColor("bg-success bg-gradient");
      setShowToastMessage("New Mandatory Tag Added Successfully");
      handleCloseDialog();
    } catch (error) {
      console.error("Error adding new tag:", error);
      setShowToast(true);
      setToastColor("bg-danger bg-gradient");
      setShowToastMessage("Failed to Add New Tag");
    }
  }, [newTagName, isMandatory, description, subscriptionKeys, cloud, tags, handleCloseDialog]);

  // confirmation modal tag should delete or not
  const handleTagDelete = useCallback((tagId: any) => {
    const tagToDelete = tags.find((tag) => tag.id === tagId);
    setShowDeleteModal(true);
    setTagToDelete(tagToDelete);
  }, [tags]);

  const confirmDeleteTag = useCallback(async () => {
    setError(null);
    if (!tagToDelete) return;
    try {
      await axios.delete(`${testapi.baseURL}/tags/${tagToDelete.id}`);
      const updatedTags = tags.filter((tag) => tag.id !== tagToDelete.id);
      setTags(updatedTags);
      setShowToast(true);
      setShowToastMessage(`Tag ${tagToDelete.TagName} deleted successfully!`);
      setToastColor("bg-danger bg-gradient");
    } catch (error) {
      console.error("Error deleting tag:", error);
      setShowToast(true);
      setShowToastMessage("Failed to Delete Tag");
      setToastColor("bg-danger bg-gradient");
    } finally {
      setShowDeleteModal(false);
      setTagToDelete(null);
    }
  }, [tags, tagToDelete]);

  const handleSubscriptionChange = useCallback((event: any, newValue: string | null) => {
    if (newValue) {
      setSubscriptionKeys(newValue);
    }
  }, []);

  const filteredTags = useMemo(() => {
    return tags.filter(
      (tag) =>
        tag.CustomerName === "CTS" && tag.SubscriptionID === subscriptionKeys
    );
  }, [tags, subscriptionKeys]);

  const handleOkClick = useCallback(() => {
    setShowModal(false);
    navigate(-1); // Go back to the previous page in history
  }, [navigate]);

  if (error) {
    return  (
    <PopUpModal
    show={showModal}
    modalMessage={error}
    onHide={handleOkClick}
  />
    )
  }

  return (
    <div className="m-2 d-flex bg_color onboarding-page-h">
      <Tile>
        <div className=" row d-flex pt-4">
          <div className=" col-9 ps-4">
            <h4 className="fw-semibold k8title">Manage Tagging Policy</h4>
          </div>
          <div className=" col-3 pe-5">
            <FormControl variant="outlined" className="form-control">
              <Autocomplete
                // id="combo-box-demo"
                // freeSolo
                id="disable-clearable"
                disableClearable
                defaultValue={defaultSubscription}
                options={currentUsers.activeUserDetails.subscriptionsID}
                autoHighlight
                value={subscriptionKeys}
                onChange={handleSubscriptionChange}
                getOptionLabel={(option) =>
                  typeof option === "string" ? option : option.label
                }
                renderInput={(params) => (
                  <TextField
                    color="success"
                    autoFocus
                    label={openDialog ? "" : "Subscriptions"}
                    {...params}
                    placeholder="Subscriptions"
                    InputProps={{
                      ...params.InputProps,
                      type: "search",
                    }}
                  />
                )}
              />
            </FormControl>
          </div>
          <div className="row row-col-1 g-3 flex-row justify-content-start px-5">
            {filteredTags.map((tag, index) => (
              <div className="col-lg-4 col-xxl-4 col-md-6 py-2 px-3 " key={index}>
                <div className="card shadow card_pad">
                  <div className="card-header border-0 bg-white d-flex justify-content-between align-items-center">
                    <span className="fw-bold nav-font">{tag.TagName}</span>
                    <div className="d-flex align-items-center">
                      <div className="form-check form-switch me-3">
                        <Switch
                          color="success"
                          checked={tag.Mandatory === "True"}
                          onChange={(event) =>
                            handleSwitchChange(tag.id, event.target.checked)
                          }
                          size="small"
                        />
                      </div>

                      <FontAwesomeIcon
                        icon={faTimes}
                        onClick={() => handleTagDelete(tag.id)}
                        className="p-0 cursor-pointe footer_size"
                      />
                    </div>
                  </div>
                  <div className="card-body py-1 ">
                    <p className="card-text text-dark fw-lighter">
                      <small className="description_font">
                        {tag.Description}
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="row ">
              <div className="d-flex justify-content-center">
                <div className="col-4 mt-4">
                  <DialogActions>
                    <div className="d-grid gap-2 col-9 mx-auto py-4">
                      <button
                        type="button"
                        className="btn btn-outline-primary footer_size"
                        onClick={handleOpenDialog}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Add Tag
                      </button>
                    </div>
                  </DialogActions>
                </div>
              </div>

              <div className="row">
                {unsavedChanges && (
                  <DialogActions sx={{ marginLeft: "-264px" }}>
                    <div className="d-grid col-3 mx-3 ">
                      <button
                        type="button"
                        className="btn btn-outline-success"
                        onClick={handleSaveButtonClick}
                      >
                        Save
                      </button>
                    </div>
                    <div className="d-grid gap-2 col-3 mx-3">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={handleCancelButtonClick}
                      >
                        Cancel
                      </button>
                    </div>
                  </DialogActions>
                )}
              </div>
            </div>
          </div>

          {/* New Tag Dialog Form */}
          {openDialog && (
            <KubernetesPopupWrapper
              height={"500px"}
              width={"500px"}
              title="Add New Tag"
              savepadding={"pt-3"}
              cancelpadding={"pt-3"}
              handleSave={handleSaveNewTag}
              handleClose={handleCloseDialog}
            >
              <div className="container">
                <DialogContent>
                  <h6 className="text-primary fw-bold pt-3 footer_size">
                    Name<span className="text-danger">*</span>
                  </h6>

                  <input
                    className={`form-control form-control-sm ${emptyFields.includes("newTagName") &&
                      "border border-danger"
                      }`}
                    type="text"
                    placeholder="Tag Name"
                    aria-label=".form-control-sm example"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    required
                  />
                  <h6 className="pt-4 text-primary fw-bold  footer_size">
                    Is Mandatory Tag ?<span className="text-danger">*</span>
                  </h6>
                  <div className="d-flex align-items-center py-3 ">
                    <div
                      className="btn-group btn-group-sm"
                      role="group"
                      aria-label="Basic radio toggle button group"
                    >
                      <input
                        type="radio"
                        className="btn-check"
                        name="btnradio"
                        id="btnradio1"
                        checked={isMandatory === true}
                        onChange={() => setIsMandatory(true)}
                        required
                      />
                      <label
                        className="btn btn-outline-primary footer_size fw-bold"
                        htmlFor="btnradio1"
                      >
                        YES
                      </label>
                      <input
                        type="radio"
                        className="btn-check"
                        name="btnradio"
                        id="btnradio2"
                        checked={isMandatory === false}
                        onChange={() => setIsMandatory(false)}
                        required
                      />
                      <label
                        className="btn btn-outline-primary footer_size fw-bold"
                        htmlFor="btnradio2"
                      >
                        NO
                      </label>
                    </div>
                  </div>
                  <div className="pt-3">
                    <label
                      htmlFor="exampleFormControlTextarea1"
                      className="form-label h6 text-primary fw-bold footer_size"
                    >
                      Description<span className="text-danger">*</span>
                    </label>
                    <textarea
                      className={`form-control mb-4  footer_size${emptyFields.includes("newTagName") &&
                        "border border-danger"
                        }`}
                      placeholder="Please enter description of Tag "
                      id="exampleFormControlTextarea1"
                      rows={4}
                      cols={50}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  {/* Display the alert message */}
                  {alertMessage && (
                    <div className="alert alert-danger" role="alert">
                      {alertMessage}
                    </div>
                  )}
                </DialogContent>
              </div>
            </KubernetesPopupWrapper>
          )}

          {/* <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle className="text-primary fw-bold">
              Add New Tag
            </DialogTitle>
            <div className="container">
              <DialogContent>
                <h6 className="text-primary fw-bold pt-3">
                  Name<span className="text-danger">*</span>
                </h6>
               <input
                  className={`form-control form-control-sm ${
                    emptyFields.includes("newTagName") && "border border-danger"
                  }`}
                  type="text"
                  placeholder="Tag Name"
                  aria-label=".form-control-sm example"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  required
                />
                <h6 className="pt-4 text-primary fw-bold ">
                  Is Mandatory Tag ?<span className="text-danger">*</span>
                </h6>
                <div className="d-flex align-items-center py-3">
                  <div
                    className="btn-group btn-group-sm"
                    role="group"
                    aria-label="Basic radio toggle button group"
                  >
                    <input
                      type="radio"
                      className="btn-check"
                      name="btnradio"
                      id="btnradio1"
                      checked={isMandatory === true}
                      onChange={(e) => setIsMandatory(true)}
                      required
                    />
                    <label
                      className="btn btn-outline-primary fw-bold"
                      htmlFor="btnradio1"
                    >
                      YES
                    </label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="btnradio"
                      id="btnradio2"
                      checked={isMandatory === false}
                      onChange={(e) => setIsMandatory(false)}
                      required
                    />
                    <label
                      className="btn btn-outline-primary fw-bold"
                      htmlFor="btnradio2"
                    >
                      NO
                    </label>
                  </div>
                </div>
                <div className="pt-3">
                  <label
                    htmlFor="exampleFormControlTextarea1"
                    className="form-label h6 text-primary fw-bold"
                  >
                    Description<span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control mb-4 ${
                      emptyFields.includes("newTagName") &&
                      "border border-danger"
                    }`}
                    placeholder="Please enter description of Tag "
                    id="exampleFormControlTextarea1"
                    rows={4}
                    cols={50}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                {alertMessage && (
                  <div className="alert alert-danger" role="alert">
                    {alertMessage}
                  </div>
                )}
              </DialogContent>
            </div>

            <DialogActions>
              <div className="d-grid col-6 mx-auto px-2 py-3">
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={handleSaveNewTag}
                >
                  Save
                </button>
              </div>
              <div className="d-grid col-6 mx-auto px-2 ">
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </button>
              </div>
            </DialogActions>
          </Dialog> */}
        </div>

        {/* PopUp messeges */}
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          className={`position-absolute top-10 end-0 me-3 ${toastColor}`}
        >
          <Toast.Body className="text-white">{showToastMessage}</Toast.Body>
        </Toast>

        {/* Tag Delete Confirmation */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title className="fs-6">Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to delete this tag?</p>
            {tagToDelete && (
              <p>
                <strong>Tag Name :</strong> {tagToDelete.TagName}
              </p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button onClick={confirmDeleteTag}>Delete</Button>
          </Modal.Footer>
        </Modal>
      </Tile>
    </div>
  );
}

export default ManageTaggingPolicy;

/******************************** Before Optimization *************************/

// function ManageTaggingPolicy() {
//   const [tags, setTags] = useState([]); // holds the api data
//   const [openDialog, setOpenDialog] = useState(false); // new tag modal popUp
//   const [newTagName, setNewTagName] = useState(""); // new tag name
//   const [isMandatory, setIsMandatory] = useState(false); // new tag Mandatory status
//   const [description, setDescription] = useState(""); // new Description
//   const [unsavedChanges, setUnsavedChanges] = useState(false); // data change status
//   const [showToast, setShowToast] = useState(false); // alert popUp
//   const [showToastMessage, setShowToastMessage] = useState(""); // alert popUp Message
//   const [toastColor, setToastColor] = useState(""); // alert popUp Color
//   const [alertMessage, setAlertMessage] = useState(null); // alert message for new tag name fields
//   const [showDeleteModal, setShowDeleteModal] = useState(false); // modal for tag delete conformation
//   const [tagToDelete, setTagToDelete] = useState(null); // targe for delete tag
//   const [emptyFields, setEmptyFields] = useState([]);
//   const currentUsers: any = useAppSelector(selectCommonConfig);
//   const defaultSubscription = currentUsers.activeUserDetails.subscriptionsID[0];
//   const [subscriptionKeys, setSubscriptionKeys] = useState(defaultSubscription);
//   const cloud =
//     subscriptionKeys === "361568250748"
//       ? "AWS"
//       : subscriptionKeys === "aab65732-30e7-48a6-93c9-1acc5c8e4413"
//       ? "Azure"
//       : "GCP";

//   // Fetching the api data
//   useEffect(() => {
//     const fetchTags = () => {
//       try {
//         Api.getData(testapi.getmanagetags).then((response: any) => {
//           setTags(response);
//         });
//       } catch (error) {}
//     };
//     fetchTags();
//   }, []);
//   // dialog open for add new tag
//   const handleOpenDialog = () => {
//     setOpenDialog(true);
//   };

//   // dialog close for add new tag
//   const handleCloseDialog = () => {
//     setOpenDialog(false);
//     setNewTagName("");
//     setIsMandatory(false);
//     setDescription("");
//   };

//   // save button function for Home Screen
//   const handleSaveButtonClick = async () => {
//     try {
//       const promises = tags?.map((tag) =>
//         axios.put(
//           `${testapi.baseURL}/tags/${tag.id}`,
//           { Mandatory: tag.Mandatory }
//         )
//       );
//       const responses = await Promise.all(promises);
//     } catch (error) {}
//     setUnsavedChanges(false); // unsave changes condition
//     setShowToast(true); // show the toast
//     setShowToastMessage("Updation Successfull"); // set the toast message
//     setToastColor("bg-success bg-gradient"); // set the background color class
//   };

//   // Mandatory Tag Toggle switch
//   const handleSwitchChange = (tagId, isMandatory) => {
//     const updatedTags = tags?.map((tag) => {
//       if (tag.id === tagId) {
//         return { ...tag, Mandatory: isMandatory ? "True" : "False" };
//       }
//       return tag;
//     });
//     setTags(updatedTags); // update Mandatory tag change
//     setUnsavedChanges(true); // indicate that changes have been made
//     setShowToast(true); // show the toast
//     setTimeout(() => setShowToast(false), 2000); // hide the toast after 2 seconds
//     setShowToastMessage(
//       isMandatory ? "Mandatory Tag ON " : "Mandatory Tag OFF"
//     ); // set Toast Message
//     setToastColor(
//       isMandatory ? "bg-success bg-gradient" : "bg-danger bg-gradient"
//     ); // set the background color class
//   };

//   // cancel button function for Home Screen
//   const handleCancelButtonClick = () => {
//     setUnsavedChanges(false); // reset unsaved changes flag
//     setShowToast(true); // show the toast
//     setShowToastMessage("Updation Canceled"); // set Toast Message
//     setToastColor("bg-danger bg-gradient"); // set the background color class
//   };

//   // save button function for New Tag
//   const handleSaveNewTag = async () => {
//     // Check if all required fields are filled
//     const empty = [];
//     if (!newTagName) {
//       empty.push("newTagName");
//     }
//     if (!description) {
//       empty.push("description");
//     }

//     if (empty.length > 0) {
//       setEmptyFields(empty);
//       setAlertMessage("Please fill all the empty fields.");
//       setTimeout(() => {
//         setAlertMessage(null);
//         setEmptyFields([]);
//       }, 2000);
//       return;
//     }

//     try {
//       Api.postData(testapi.getmanagetags, {
//         CustomerName: "CTS",
//         SubscriptionID: subscriptionKeys,
//         Cloud: cloud,
//         TagName: newTagName,
//         Mandatory: isMandatory,
//         Description: description,
//       }).then((response: any) => {
//         setTags([...tags, response.data.data]);
//       });
//       setNewTagName(""); // clear newTagName field
//       setDescription(""); // clear description field
//       setUnsavedChanges(false); // reset unsaved changes flag
//       setShowToast(true); // show the toast
//       setToastColor("bg-success bg-gradient"); // set the background color class
//       setShowToastMessage("New Mandatory Tag Added Successfully"); // set Toast Message
//       handleCloseDialog();
//     } catch (error) {}
//   };

//   // Tag Delete Function X
//   const handleTagDelete = async (tagId) => {
//     try {
//       const tagToDelete = tags.find((tag) => tag.id === tagId);
//       setShowDeleteModal(true); // show the confirmation modal
//       setTagToDelete(tagToDelete); // set delete target ID
//     } catch (error) {
//       alert("Error deleting tag.");
//     }
//   };

//   // confirmation modal tag should delete or not
//   const confirmDeleteTag = async () => {
//     try {
//       await axios.delete(
//         `${testapi.baseURL}/tags/${tagToDelete.id}`
//       );
//       const updatedTags = tags.filter((tag) => tag.id !== tagToDelete.id);
//       setTags(updatedTags);
//       setShowToast(true); // show the toast
//       setShowToastMessage(`Tag ${tagToDelete.TagName} deleted successfully!`); // set Toast Message
//       setToastColor("bg-danger bg-gradient"); // set the background color class
//     } catch (error) {
//       alert("Error deleting tag.");
//     } finally {
//       setShowDeleteModal(false); // hide the confirmation modal
//     }
//   };
