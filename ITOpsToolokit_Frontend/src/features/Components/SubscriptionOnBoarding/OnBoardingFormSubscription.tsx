import React, { useState } from "react";
import Tile from "../Tiles/Tile";
import {
  faPlus,
  faCaretDown,
  faCaretUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DialogActions } from "@mui/material";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";

const OnBoardingFormSubscription = (props) => {
  const [members, setMembers] = useState([""]); // initialize state with an empty input field
  const [subscriptions, setSubscriptions] = useState([""]);

  const cloudData = useAppSelector(selectCommonConfig);
  const userPermission = cloudData.loginDetails.capabilities.Onboarding[0]

  const handleAddMember = () => {
    setMembers([...members, ""]); // add another empty input field to the state
  };

  const handleMemberChange = (index, event) => {
    const newMembers = [...members]; // copy the current state array
    newMembers[index] = event.target.value; // update the value at the specified index
    setMembers(newMembers); // update the state with the new array
  };

  const handleAddSubscription = () => {
    setSubscriptions([...subscriptions, ""]);
  };

  const handleSubscriptionChange = (index, event) => {
    const newSubscriptions = [...subscriptions];
    newSubscriptions[index] = event.target.value;
    setSubscriptions(newSubscriptions);
  };

  const handleSave = (event) => {
    event.preventDefault();
    props.onSave(props.formData);
  };

  return (
    <div className="p-2">
      <Tile>
        <div className="row container p-3">
          <h3 className="pb-5">{props.title}</h3>
          <div className="col-md-6  px-5">
            <form className="px-5">
              <div className="pb-3">
                <label htmlFor={props.SubscriptionID} className="form-label">
                  {props.SubscriptionIDLabel}{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id={props.SubscriptionID}
                  name={props.SubscriptionID}
                  required
                />
                <small className="form-text">
                  {props.SubscriptionIDSmallText}
                </small>
              </div>

              <div className="pb-3">
                <label htmlFor={props.SubscriptionName} className="form-label">
                  {props.SubscriptionNameLabel}{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id={props.SubscriptionName}
                  name={props.SubscriptionName}
                  required
                />
                <small className="form-text">
                  {props.SubscriptionNameSmallText}
                </small>
              </div>

              <div className="pb-3">
                <label htmlFor={props.SubscriptionOwner} className="form-label">
                  {props.SubscriptionOwnerLabel}{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id={props.SubscriptionOwner}
                  name={props.SubscriptionOwner}
                  required
                />
                <small className="form-text">
                  {props.SubscriptionOwnerSmallText}
                </small>
              </div>

              <div className="pb-3">
                <Form.Group controlId="members">
                  <Form.Label>
                    {props.MembersLabel} <span className="text-danger">*</span>
                  </Form.Label>

                  {members.map((member, index) => (
                    <InputGroup key={index} className="mb-2 ">
                      <Form.Control
                        className="rounded-0"
                        type="text"
                        name="members"
                        value={member}
                        onChange={(e) => handleMemberChange(index, e)}
                        required
                      />
                      {index === members.length - 1 && ( // only show the plus icon for the last input field
                        <div className="input-group-append px-2">
                          <span className="input-group-text bg-white rounded-0">
                            <FontAwesomeIcon
                              icon={faPlus}
                              className="py-1 cursor-pointer"
                              onClick={handleAddMember}
                            />
                          </span>
                        </div>
                      )}
                    </InputGroup>
                  ))}

                  <Form.Text className="text-muted">
                    {props.MembersSmallText}
                  </Form.Text>
                </Form.Group>

                <div className="pb-3">
                  <label htmlFor={props.Description} className="form-label">
                    {props.DescriptionLabel}{" "}
                    <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control rounded-0"
                    id={props.field2Id}
                    name={props.Description}
                    rows={3}
                    required
                  ></textarea>
                  <small className="form-text">
                    {props.DescriptionSmallText}
                  </small>
                </div>
              </div>
            </form>
          </div>

          <div className="col-md-6 px-5">
            <form className="px-5">
              <div className="pb-3">
                <label htmlFor={props.Projects} className="form-label">
                  {props.ProjectsLabel} <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id={props.Projects}
                  name={props.Projects}
                  required
                />
                <small className="form-text">{props.ProjectsSmallText}</small>
              </div>

              <div className="pb-3">
                <Form.Group controlId="subscriptions">
                  <Form.Label>
                    {props.SubscriptionsLabel}{" "}
                    <span className="text-danger">*</span>
                  </Form.Label>
                  {subscriptions.map((subscription, index) => (
                    <InputGroup key={index} className="mb-2">
                      <Form.Control
                        className="rounded-0"
                        type="text"
                        name="subscriptions"
                        value={subscription}
                        onChange={(e) => handleSubscriptionChange(index, e)}
                        required
                      />
                      {index === subscriptions.length - 1 && ( // only show the plus icon for the last input field
                        <div className="input-group-append px-2">
                          <span className="input-group-text bg-white rounded-0">
                            <FontAwesomeIcon
                              icon={faPlus}
                              className="py-1 cursor-pointer"
                              onClick={handleAddSubscription}
                            />
                          </span>
                        </div>
                      )}
                    </InputGroup>
                  ))}
                  <Form.Text className="text-muted">
                    {props.SubscriptionsSmallText}
                  </Form.Text>
                </Form.Group>
              </div>

              <div className="pb-3 form-group">
                <label htmlFor={props.Cloud} className="form-label">
                  {props.CloudLabel} <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <select
                    className="form-control rounded-0"
                    id={props.Cloud}
                    name={props.Cloud}
                    data-style="btn-primary"
                    required
                  >
                    <option value="">Choose the Cloud</option>
                    <option value="AWS">AWS</option>
                    <option value="Azure">Azure</option>
                    <option value="GCP">GCP</option>
                  </select>
                </div>
                <small className="form-text">{props.CloudSmallText}</small>
              </div>

              <div className="pb-3">
                <label htmlFor={props.CustomerID} className="form-label">
                  {props.CustomerIDLabel} <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id={props.CustomerID}
                  name={props.CustomerID}
                  required
                />
                <small className="form-text">{props.CustomerIDSmallText}</small>
              </div>

              <div className="pb-3">
                <label htmlFor={props.CustomerName} className="form-label">
                  {props.CustomerNameLabel}{" "}
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control rounded-0"
                  id={props.CustomerName}
                  name={props.CustomerName}
                  required
                />
                <small className="form-text">
                  {props.CustomerNameSmallText}
                </small>
              </div>
            </form>
          </div>
          {/* {menuListCapabilities.Subscription.includes('Update') ? */}
          <div className="d-flex justify-content-center">
            <div className="col-8 m-4">
              <DialogActions>
                <div className="d-grid col-3 mx-auto px-2 ">
                  <button type="button" className="btn btn-outline-danger">
                    Cancel
                  </button>
                </div>
                <div className="d-grid col-3 mx-auto px-2 py-3">
                  <button
                    type="button"
                    className="btn btn-outline-success"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </DialogActions>
            </div>
          </div>
          {/* : <></>} */}
        </div>
      </Tile>
    </div>
  );
};

export default OnBoardingFormSubscription;
