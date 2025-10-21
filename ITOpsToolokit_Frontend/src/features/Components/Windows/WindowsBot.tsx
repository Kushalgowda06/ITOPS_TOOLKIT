import React, { useState } from "react";
import { Tooltip } from "@mui/material";
import { capitalizeFirstLetter } from "../../Utilities/capitalise";
import { FaWindows } from "react-icons/fa";
import { Modal } from 'react-bootstrap';
import { IconType } from "react-icons";
import { wrapIcon } from "../../Utilities/WrapIcons";

const WindowsBot = ({ show, onHide, title, sysData }) => {

    const [selectedTicket, setSelectedTicket] = useState(null)
    const [showTicketDetails, setShowTicketDetails] = useState(false)

    const handleCardClick = (item, index) => {
        setSelectedTicket(item)
        setShowTicketDetails(true)
    };
    // const WindowsIcon: IconType = FaWindows;

    // const IconFaWindows = FaWindows as React.FC<React.HTMLAttributes<HTMLElement>>;

    const IconWindows = wrapIcon(FaWindows);
    return (
        <>
            <Modal show={show} onHide={onHide} className="no-border modal-xxl" size="lg">
                <Modal.Header closeButton >
                </Modal.Header>
                <Modal.Body className="no-border">
                    <div>
                        <div className="d-flex win_colr  justify-content-between align-items-center">
                            <div>
                                <IconWindows className=" mx-1 bot_icon" />
                                <span className="fw-bolder">{title}</span>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center">
                            <div className="px-3">
                                <p className=" text-muted fw-bold mb-0 nav-font">Windows Bots</p>
                                <p className="ps-4 text-muted role_fnt">
                                    You can upgrade your cluster to a newer version of Kubernetes or configure automatic upgrade settings.
                                    If you upgrade your cluster, you can choose whether to upgrade only the control plane or to also upgrade all node
                                    pools. To upgrade individual node pools, go to the 'Node pools' menu item instead.
                                </p>
                            </div>
                        </div>
                        {
                            showTicketDetails ? <>
                                <div className="container popup_content-width ps-md-5  role_cls">
                                    <div className="row text-muted ps-md-5 tab">
                                        <div className="col-md-6 pb-2 ">
                                            Ticket Number :{" "}
                                            <Tooltip
                                                title={capitalizeFirstLetter(selectedTicket?.number)}
                                                placement="top"
                                                arrow={true}
                                                followCursor={true}
                                                PopperProps={{
                                                    style: { zIndex: 9999 },
                                                }}
                                            >
                                                <span className=" text-color fw-bold cursor-pointer ps-1">
                                                    {selectedTicket?.number?.substring(0, 45)}
                                                    {selectedTicket?.number?.length > 40 ? "..." : ""}
                                                </span>
                                            </Tooltip>
                                        </div>
                                        <div className="col-md-6 pb-2">
                                            Status  :{" "}
                                            <span className="text-color fw-bold">
                                                {selectedTicket?.state}
                                            </span>
                                        </div>

                                        <div className="w-100"></div>
                                        <div className="w-100"></div>
                                        <div className="col-md-6 pt-1">
                                            Configuration Item :{" "}
                                            <Tooltip
                                                title={capitalizeFirstLetter(selectedTicket?.admin)}
                                                placement="top"
                                                arrow={true}
                                                followCursor={true}
                                                PopperProps={{
                                                    style: { zIndex: 9999 },
                                                }}
                                            >
                                                <span className=" text-color fw-bold cursor-pointer ps-1">
                                                    {selectedTicket?.admin?.substring(0, 23)}
                                                    {selectedTicket?.admin?.length > 10 ? "..." : ""}
                                                </span>
                                            </Tooltip>
                                        </div>
                                        <div className="col-md-6 pt-2">
                                            Assignment Group  : <span className="text-color fw-bold">{selectedTicket?.serviceDesk}</span>
                                        </div>
                                        <div className="col-md-6 pt-2">
                                            Short Description  :
                                            <Tooltip
                                                title={capitalizeFirstLetter(selectedTicket?.short_description)}
                                                placement="top"
                                                arrow={true}
                                                followCursor={true}
                                                PopperProps={{
                                                    style: { zIndex: 9999 },
                                                }}
                                            >
                                                <span className=" text-color fw-bold cursor-pointer ps-1">
                                                    {selectedTicket?.short_description?.substring(0, 60)}
                                                    {selectedTicket?.short_description?.length > 60 ? "..." : ""}
                                                </span>
                                            </Tooltip>
                                        </div>
                                        <div className="col-md-6 pt-2">
                                            Description  :
                                            <Tooltip
                                                title={capitalizeFirstLetter(selectedTicket?.description)}
                                                placement="top"
                                                arrow={true}
                                                followCursor={true}
                                                PopperProps={{
                                                    style: { zIndex: 9999 },
                                                }}
                                            >
                                                <span className=" text-color fw-bold cursor-pointer ps-1">
                                                    {selectedTicket?.description?.substring(0, 60)}
                                                    {selectedTicket?.description?.length > 60 ? "..." : ""}
                                                </span>
                                            </Tooltip>
                                        </div>
                                    </div>
                                    <div className="row pt-4">

                                        <div className="col d-flex  justify-content-end">
                                            <button onClick={onHide} className="btn btn-outline-success btn-width font-weight-bold">Trigger Bot</button>
                                        </div>
                                        <div className="col d-flex  justify-content-start">
                                            <button onClick={() => setShowTicketDetails(false)} className="btn btn-outline-danger btn-width font-weight-bold">Back</button>
                                        </div>
                                    </div>
                                </div>
                            </> : <>
                                <div style={{ height: "18rem", overflow: "scroll" }}>
                                    <div className="row d-flex ps-3 ">
                                        {sysData.map((item, index) => (
                                            <div
                                                key={index}
                                                className=" col-md-6 col-lg-3  col-xxl-4 py-1 "
                                            >
                                                <div
                                                    className="card title-bot-card-background  botcardwidth cursor-pointer border-0 card-background  rounded-4  text-primary text-start"
                                                    onClick={() => handleCardClick(item, index)}
                                                >
                                                    <div className="card-body card-height card-pad">
                                                        <span className="f-size card_f_size">
                                                            <span className="fw-bold">Number : </span>{" "}
                                                            {item.number}
                                                        </span>
                                                        <br />

                                                        <span className=" card_f_size f-size">
                                                            <span className="fw-bold">Short Description : </span>
                                                            <Tooltip
                                                                title={capitalizeFirstLetter(item?.short_description)}
                                                                placement="top"
                                                                arrow={true}
                                                                followCursor={true}
                                                                PopperProps={{
                                                                    style: { zIndex: 9999 },
                                                                }}
                                                            >
                                                                <span className="cursor-pointer ps-1">
                                                                    {item?.short_description?.substring(0, 70)}
                                                                    {item?.short_description?.length > 70 ? "..." : ""}
                                                                </span>
                                                            </Tooltip>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};
export default WindowsBot;
