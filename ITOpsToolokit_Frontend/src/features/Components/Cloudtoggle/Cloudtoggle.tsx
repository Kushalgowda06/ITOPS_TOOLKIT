import React, { useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { CloudState, selectCloud, setCloud } from "./CloudToggleSlice";

const Cloudtoggle: React.FC<any> = (props) => {
  const currentCloud: CloudState = useAppSelector(selectCloud);
  const [activeCloud, setActiveCloud] = useState<string[]>(
    currentCloud.currentCloud
  );
  const [reRender, setRerender] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  const handlActiveCloudChange = (cloud: string) => {
    let tempActiveCLoud = [...activeCloud];
    if (activeCloud.includes(cloud) && activeCloud.length) {
      tempActiveCLoud.splice(activeCloud.indexOf(cloud), 1);
    } else {
      tempActiveCLoud = [...activeCloud, cloud];
    }
    tempActiveCLoud.length < 1
      ? setActiveCloud([...activeCloud])
      : setActiveCloud(tempActiveCLoud);
  };

  useEffect(() => {
    setActiveCloud(currentCloud.currentCloud);
  }, [currentCloud]);

  useEffect(() => {
    dispatch(setCloud(activeCloud));
    setRerender(!reRender);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCloud]);

  return (
    <Dropdown autoClose="outside">
      <Dropdown.Toggle
        className="bg-transparent text-primary border-0 header_cloud_icons"
        id="dropdown-basic"
      >
        <span className="text-primary fw-bold">
          {activeCloud.map((cloud: any, index: any) => {
            if (cloud !== "All") {
              return (
                <span className="px-1">
                  <img
                    className="cloud-icon"
                    alt="cloud-icon"
                    src={`${cloud.toLowerCase()}Icon.png`}
                  />
                </span>
              );
            } else {
              return <></>;
            }
          })}
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu style={{marginLeft: "-50px"}}>
        {/* <Form> */}
        <Dropdown.Item className="px-1">
          <div className="d-flex justify-content-around cursor-pointer" onClick={() => handlActiveCloudChange("AWS")}>
            <div className="form-check">
              <input
                checked={activeCloud.includes("AWS")}
                className="form-check-input cursor-pointer"
                type="checkbox"
                id="awsCheck"
                value="AWS"
              />
              <label className="form-check-label cursor-pointer" htmlFor="awsCheck">
                <img alt="AWS" className="cloud-icon" src="awsIcon.png" />
              </label>
            </div>
          </div>
        </Dropdown.Item>
        <Dropdown.Item>
          <div className="d-flex justify-content-around cursor-pointer" onClick={() => handlActiveCloudChange("Azure")}>
            <div className="form-check">
              <input
                checked={activeCloud.includes("Azure")}
                className="form-check-input cursor-pointer"
                type="checkbox"
                id="azurecheck"
                value="Azure"
              />
              <label className="form-check-label cursor-pointer" htmlFor="azurecheck">
                <img alt="Azure" className="cloud-icon" src="azureIcon.png" />
              </label>
            </div>
          </div>
        </Dropdown.Item>
        <Dropdown.Item>
          <div className="d-flex justify-content-around cursor-pointer" onClick={() => handlActiveCloudChange("GCP")}>
            <div className="form-check">
              <input
                checked={activeCloud.includes("GCP")}
                className="form-check-input cursor-pointer"
                type="checkbox"
                id="gcpCheck"
                value="GCP"
              />
              <label className="form-check-label cursor-pointer" htmlFor="gcpCheck">
                <img alt="GCP" className="cloud-icon" src="gcpIcon.png" />
              </label>
            </div>
          </div>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default Cloudtoggle;
