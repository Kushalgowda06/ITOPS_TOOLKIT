import React from "react";
import { Button, Modal } from "react-bootstrap";
import KanbanTable from "../KanbanTable/KanbanTable";

export const KanbanPopup = ({ show, onHide, advisoryName }) => {
  return (
    <>
      <Modal show={show} onHide={onHide} className="modal-xl modal-dialog-centered mt-0">
        <KanbanTable advisoryName={advisoryName} />
      </Modal>
    </>
  );
};
