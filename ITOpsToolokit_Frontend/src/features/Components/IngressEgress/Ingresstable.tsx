import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  ListItemText,
  MenuItem,
  Modal,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Collapse, Toast } from "react-bootstrap";
const ITEM_HEIGHT = 35;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
};
const removedialog = {
  position: "absolute",
  top: "20%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 3,
};
const Ingresstable = (props) => {
  const regex1 = /\/subscriptions\/(.*?)\/resourcegroups/;
  const match1 = props?.selectedData.map((curr) => curr.Id?.match(regex1));
  const clustername = props?.selectedData?.map((curr) => curr.Name);
  const gateway = props.selectedData.map(
    (curr) => curr.IngressApplicationGateway[0].name
  );
  const ports = props.selectedData.map(
    (curr) => curr.IngressApplicationGateway[0].ports
  );
  const formFields = [
    { label: "Cluster Name" },
    { label: "Resource Group" },
    { label: "Port" },
    {
      label: "Gateway Name",
    },
  ];
  const [row, setrow] = useState(false);
  const portnumber = props.getport;
  const [gatewaylist, setGatewaylist] = useState([
    "My gateway",
    "testgateway",
    "internalgateway",
  ]);
  const [showToastMessage, setShowToastMessage] = useState(""); // alert popUp Message
  const [toastColor, setToastColor] = useState("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showToast, setShowToast] = useState(false);
  const [open, setOpen] = useState(false); // State for modal visibility
  const [newGatewayName, setNewGatewayName] = useState(""); // State for new gateway name
  const [gateWayError, setGateWayError] = useState(false);
  const [portError, setportError] = useState(false);

  const handleAddField = () => {
    setrow(!row);
  };

  const handlePortChange = (event) => {
    if (newGatewayName.length >= 0) {
      setGateWayError(false);
    }
    if (props.port.length >= 0) {
      setportError(false);
    }
    props.setPort(event.target.value);
  };
  const handleGatewayChange = (event) => {
    props.setGatewayValue(event.target.value);
    if (event.target.value === "Create new gateway") {
      setOpen(true); // Open modal on "Create new gateway" selection
    }
  };

  const handleClose = () => setOpen(false); // Close modal function

  const handleCreateGateway = (e) => {
    setGatewaylist([...gatewaylist, newGatewayName]);
    props.setGatewayValue(newGatewayName);
    if (newGatewayName.length === 0) {
      setGateWayError(true);
    } else {
      setGateWayError(false);
    }
    if (props.port.length === 0) {
      setportError(true);
    } else {
      setportError(false);
    }

    if (!newGatewayName || !props.port) {
      return;
    }

    handleClose();
    // Close modal after creation
  };
  const handleOnChange = (e) => {
    if (newGatewayName.length >= 0) {
      setGateWayError(false);
    }
    if (props.port.length >= 0) {
      setportError(false);
    }

    setNewGatewayName(e.target.value);
  };
  // const handleRemoveRule =()=>{
  //   setShowModal(true);
  // }
  // const confirmDelete = async () => {
  //   // try {
  //   //   const response = axios.post(
  //   //     "http://ec2-3-97-232-96.ca-central-1.compute.amazonaws.com:8006/kcm_remove_node/",
  //   //     {
  //   //       data: [
  //   //         {
  //   //           ClusterName: selectedData[0].Name,
  //   //           ResourceGroup: match[1],
  //   //           NodeToBeRemoved: removeNode,
  //   //           NodePoolName: Node,
  //   //           Cloud: "Azure",
  //   //           SubscriptionID: "123",
  //   //         },
  //   //       ],
  //   //     }
  //   //   );
  //   // } catch (error) {
  //   // }
  //   setShowModal(false); // hide the confirmation modal
  //   setTimeout(() => {
  //   props?.handleClose();
  //   }, 800);
  //   setShowToast(true); // show the toast
  //   setShowToastMessage("Rule removed successfully!"); // set Toast Message
  //   setToastColor("gradient-background-toast"); // set the background color class
  // };
  // console.log("gateway", newGatewayName,);

  return (
    <div className="container tab ">
      <div className="row pb-2  pt-3 justify-content-center d-flex">
        {formFields.map((field, index) => (
          <strong
            key={index}
            className={` d-flex  justify-content-center  ${
              field.label === "Port"
                ? "col-md-2 "
                : field.label === "Gateway Name"
                ? "col-md-4 pe-5"
                : "col-md-3 "
            }`}
          >
            <label>{field.label}</label>
          </strong>
        ))}
      </div>
      <div className="row pb-2 d-flex d-inline">
        <span className="col-md-3 justify-content-center d-flex ">
          {clustername}
        </span>
        <span className="col-md-3 justify-content-center d-flex">
          <Tooltip
            className="d-inline d-flex"
            title={match1[0][1]}
            placement="top"
            arrow={true}
            followCursor={true}
          >
            <span className="d-inline-block cursor-pointer py-1">
              {match1[0][1].substring(0, 25)}
              {match1[0][1].length > 8 ? "..." : ""}
            </span>
          </Tooltip>
        </span>
        <span className="col-md-2 justify-content-center d-flex ">
          {ports[0] === undefined ? "NULL" : ports[0]?.join(", ")}
        </span>
        <span className="col-md-4 justify-content-center d-flex">
          {gateway[0] === null ? "NULL" : gateway}
          <div
            className="input-group-text bg-white cursor-pointer ms-3 me-1 "
            onClick={handleAddField}
          >
            <FontAwesomeIcon
              icon={faPlus}
              // fontSize={"11px"}
              className="py-1  text-success minus_plus_size "
            />
          </div>
          <div
            className="input-group-text  bg-white opacity-50"
            // onClick={handleRemoveRule}
          >
            <FontAwesomeIcon
              className="py-1  text-danger minus_plus_size opacity-50"
              icon={faMinus}
              // fontSize={"11px"}
            />
          </div>
        </span>
      </div>

      <Collapse in={row} className="ingress_margin">
        <div id=" collapseID" className="shadow px-2 py-1">
          <div className="d-flex align-items-center portmargin">
            Gateway Name :{" "}
            <FormControl
              variant="standard"
              sx={{ m: 1, minWidth: 200 }}
              required
              className="ps-2"
            >
              <Select
                size="small"
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={
                  props.gatewayvalue === "Create new gateway"
                    ? ""
                    : props.gatewayvalue
                }
                displayEmpty
                defaultValue={props.gatewayvalue}
                onChange={handleGatewayChange}
                inputProps={{ "aria-label": "Select value" }}
                renderValue={(selected: any) => {
                  if (!selected) {
                    return (
                      <span className="dropdown-placeholder tab">
                        Choose the gateway
                      </span>
                    );
                  }
                  return <span className="dropdown-list">{selected}</span>;
                }}
                MenuProps={MenuProps}
                multiple={false}
              >
                {" "}
                <MenuItem
                  key="create-new-gateway"
                  value="Create new gateway"
                  style={{ fontWeight: "bold", color: "#007bff" }}
                >
                  <Typography
                    variant="body2"
                    style={{
                      fontWeight: "bold",
                      color: "#007bff",
                      fontSize: "0.75rem",
                      textDecorationLine: "underline",
                    }}
                  >
                    Create new gateway
                  </Typography>
                </MenuItem>
                {gatewaylist.map((name) => (
                  <MenuItem key={name} value={name}>
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <div className="d-flex align-items-center ps-4">
              Port :{" "}
              <FormControl
                variant="standard"
                sx={{ m: 1, minWidth: 200 }}
                required
                className="ps-2"
              >
                <Select
                  size="small"
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  value={props.port}
                  displayEmpty
                  onChange={handlePortChange}
                  inputProps={{ "aria-label": "Select value" }}
                  renderValue={(selected: any) => {
                    if (!selected) {
                      return (
                        <span className="dropdown-placeholder tab">
                          Choose the port
                        </span>
                      );
                    }

                    return <span className="dropdown-list">{selected}</span>;
                  }}
                  MenuProps={MenuProps}
                  multiple={false}
                >
                  {portnumber.map((name) => (
                    <MenuItem key={name} value={name}>
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    gutterBottom
                    component="div"
                  >
                    Create New Gateway
                  </Typography>
                  <div className="px-2 d-flex  ">
                    <p>
                    Gateway :{" "}</p>
                    <TextField
                      className="w-75  ps-2"
                      error={gateWayError}
                      helperText={gateWayError && "Please enter gateway name"}
                      placeholder="Enter Gateway Name"
                      id="gateway-name-field"
                      value={newGatewayName} // Use newGatewayName state
                      onChange={(e) => handleOnChange(e)}
                    />
                  </div>
                  <div className="px-2 d-flex  ">
                  <p className="mt-2 pt-1">
                    Port :{" "}
                    </p>
                    <FormControl
                      sx={{ m: 1, width: 250 }}
                      required
                      className="ps-4 ms-4"
                    >
                      <Select
                        size="small"
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        value={props.port}
                        displayEmpty
                        onChange={handlePortChange}
                        error={portError}
                        inputProps={{ "aria-label": "Select value" }}
                        renderValue={(selected: any) => {
                          if (!selected) {
                            return (
                              <span className="dropdown-placeholder">
                                Choose the port
                              </span>
                            );
                          }

                          return (
                            <span className="dropdown-list">{selected}</span>
                          );
                        }}
                        MenuProps={MenuProps}
                        multiple={false}
                      >
                        {portnumber.map((name) => (
                          <MenuItem key={name} value={name}>
                            <ListItemText primary={name} />
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText sx={{ color: "#d32f2f" }}>
                        {portError && "Please enter port name"}
                      </FormHelperText>
                    </FormControl>
                  </div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCreateGateway}
                    sx={{ mt: 2, textTransform: "none" }}
                  >
                    Create
                  </Button>
                </Box>
              </Modal>
            </div>
          </div>
        </div>
      </Collapse>
      {
        //         <>
        //           <Toast
        //             show={showToast}
        //             onClose={() => setShowToast(false)}
        //             delay={3000}
        //             autohide
        //             className={`position-absolute top-0 start-50 translate-middle custom-margin  ${toastColor}`}
        //           >
        //             <Toast.Body className="text-white">{showToastMessage}</Toast.Body>
        //           </Toast>
        //      <Modal
        //   open={showModal}
        //   onClose={() => setShowModal(false)}
        //   aria-labelledby="modal-modal-title"
        //   aria-describedby="modal-modal-description"
        // >
        //   <Box sx={removedialog}>
        //     <Typography id="modal-modal-title" variant="h6" component="h2">
        //     Confirm Remove Rule
        //     </Typography>
        //     <Typography id="modal-modal-description" sx={{ mt: 2 }}>
        //     Are you sure you want to remove this <strong>{ports[0]?.join(", ")}</strong>{" "}
        //                 rule ?
        //     </Typography>
        //     <Button onClick={confirmDelete}>YES</Button>
        //     <Button onClick={() => setShowModal(false)}>NO</Button>
        //   </Box>
        // </Modal>
        //         </>
      }
    </div>
  );
};
export default Ingresstable;
