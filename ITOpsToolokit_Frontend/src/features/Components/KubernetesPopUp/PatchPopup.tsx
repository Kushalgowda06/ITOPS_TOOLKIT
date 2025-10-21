import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { capitalizeFirstLetter } from "../../Utilities/capitalise";
import { PopUpModal } from "../../Utilities/PopUpModal";
import { Loader } from "../../Utilities/Loader";


interface Props {
  title: string;
  handleSave: () => void;
  handleClose: () => void;
  children: React.ReactNode;
  imageTag?: React.ReactElement;
  handleSubmit?:any;
  fromChildData?:any;
  onData?:any;
  cloudIcon?: React.ReactElement;
  setvisible?:any
  errorMsg?:any;
  errMsg?:boolean;
  setErrMsg?:any;
  showAlert?: boolean;
  showStateAlert?: boolean;
  showStatusData?: string;
  showMod?: boolean;
  setShowMod?: any;
  ticketId?:any;
  height?:any;
  width?:any;
  cancelpadding?:any;
  savepadding?:any;
}

export const PatchPopup: React.FC<Props> = (props) => {
  const location = useLocation();
  const pathname = location.pathname;
  const modalRef = useRef(null);
  const handleClickOutside = (event: any) => {
    if (modalRef.current && event.target.className === "modal-overlay") {
      props.handleClose();
    }
  };
  window.addEventListener("click", handleClickOutside)
  const onCloseModal = () => {
    props.setErrMsg(false)
    props.setvisible(false)
  }
  console.log("onDatalength",props.fromChildData)

  const handleOccurrence =()=>{
    props.onData()
    props.handleClose()
  }


  return (
    <>
      <div className="modal-overlay">
        <div ref={modalRef}>
          <div className="justify-content-center d-flex pt-2">
            {props.showStateAlert && props.ticketId && (
              <PopUpModal
                show={props.showMod}
                modalMessage= {`Request has been submitted successfully <br> Request Number : <span class="text-primary"> ${props.ticketId}</span> `}
                onHide={() => props.setShowMod(false)}
              />
            )}
            {props.showAlert && (
              <PopUpModal
                show={props.showMod}
                modalMessage={"Please enter correct value"}
                onHide={() => props.setShowMod(false)}
                  />
            )}
             {props.errMsg && (
              <PopUpModal
                show={props.errMsg}
                modalMessage={props.errorMsg}
                onHide={onCloseModal}
                  />
            )}
          </div>
          <div className=" container patchpopup_width_height position-absolute top-50 start-50 translate-middle bg-white rounded borderpopover px-0"
          //  style={{
          //   height: props.height, // Adjust as needed
          //   width: props.width, // Adjust as needed
          // }}
          >
            
            <div className="ps-3 shadow d-flex align-items-center py-1 ">
              <div className="d-flex align-items-center flex-grow-1">
                {props.cloudIcon} {/** added cloud icon as a prop */} 
                <div className={`${props.title==="Add New Tag" ?  "text-primary" : "me-5 text-color" } fw-bold  popup_title d-flex pe-5 justify-content-center flex-grow-1`}>
                  {capitalizeFirstLetter(props.title)}
                </div>
              </div>
              {props.imageTag} {/** added image tag as a prop */}
              <button
                type="button"
                className="btn-close position-absolute end-0 align-items-center pe-4 me-1"
                aria-label="Close"
                onClick={props.handleClose}
              ></button>
            </div>

            <div className="popUpPad">
              <div className={pathname.includes("add-advisory") ? "cluster" : "cluster-h"}>{props.children}</div>
              <div className="row" style={{paddingTop: "2.5rem"}}>
                {!pathname.includes("Vm-status-manager") && (
                  <div className ={`col d-flex justify-content-end ${props.savepadding}`}>
                    {props.fromChildData?.length>0 ? <button
                      type="button"
                      className="btn btn-outline-success btn-width font-weight-bold "
                      onClick={handleOccurrence}
                    >
                      Remove Occurrence
                    </button> : <button
                      type="button"
                      className="btn btn-outline-success btn-width font-weight-bold "
                      onClick={props.handleSubmit}
                    >
                      Ok
                    </button>}
                    
                  </div>
                )}
                <div
                  className={`col d-flex ${props.cancelpadding} ${
                    pathname.includes("Vm-status-manager")
                      ? "justify-content-center"
                      : "justify-content-start"
                  }`}
                >
                  <button
                    className="btn btn-outline-danger btn-width font-weight-bold"
                    onClick={props.handleClose}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
