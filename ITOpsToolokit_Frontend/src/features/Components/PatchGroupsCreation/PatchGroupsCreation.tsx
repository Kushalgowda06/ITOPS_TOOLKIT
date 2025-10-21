import React, { useState } from "react";
import TitleCard from "../TitleCard/TitleCard";
import { AiOutlineKubernetes } from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";
import { FaLinux, FaWindows, FaUbuntu } from 'react-icons/fa';

import { useAxiosFetch } from "../../../hooks/useAxiosFetch";
import { ApiResponse } from "../../../Typess/Typess";
import PatchGroupsData from "./PatchGroupsData"; // Adjust the import path as needed
import { Modal, Button } from "react-bootstrap";
import { wrapIcon } from "../../Utilities/WrapIcons";

const PatchGroupsCreation = () => {
  const { data: apiResponse, loading, error } = useAxiosFetch<ApiResponse>(
    'http://ec2-3-97-232-96.ca-central-1.compute.amazonaws.com:8000/group/'
  );

  const RxDashboardIcon = wrapIcon(RxDashboard);
  const FaLinuxIcon = wrapIcon(FaLinux);
  const AiOutlineKubernetesIcon = wrapIcon(AiOutlineKubernetes);
  const FaWindowsIcon = wrapIcon(FaWindows);
  const FaUbuntuIcon = wrapIcon(FaUbuntu);


  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!apiResponse || !apiResponse.data) {
    return <div>No data available</div>;
  }

  const getIconByOS = (os) => {
    switch (os) {
      case 'Linux':
        return <FaLinuxIcon className="card-icon" />;
      case 'Windows':
        return <FaWindowsIcon className="card-icon" />;
      case 'Ubuntu':
        return <FaUbuntuIcon className="card-icon" />;
      default:
        return <RxDashboardIcon className="card-icon" />;
    }
  };

  const openModal = (group) => {
    console.log("Opening modal for group:", group);
    setSelectedGroup(group);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    console.log("Closing modal");
    setModalIsOpen(false);
    setSelectedGroup(null);
  };

  return (
    <div className="m-2 onboarding-page-h bg_color">
      <div className="p-2 k8-background">
        <div className="d-flex">
          <AiOutlineKubernetesIcon className="k8-title-logo-size k8-logo-size py-1 mx-2 mt-1" />
          <span className="k8_title fw-bolder pe-2">
            Patching Implementation Groups
          </span>
        </div>
        <div className="px-4">
          <div className="container text-center mb-4 container_width">
            <div className="row gx-5 py-5 card-title">
              <div className="row">
                {apiResponse.data.map((item, index) => (
                  <div className="col-md-6 col-lg-4" key={index}>
                    <TitleCard
                      title={item.GroupName}
                      description={item.Description}
                      icon={getIconByOS(item.OS)}
                      cardBgIcon={"card-background"}
                      onClick={() => openModal(item)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal show={modalIsOpen} onHide={closeModal} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Patch Group Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedGroup ? (
            <PatchGroupsData group={selectedGroup} />
          ) : (
            <div>No data available</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default PatchGroupsCreation;
