
import { DialogActions } from '@mui/material'
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { PopUpModal } from '../../Utilities/PopUpModal';
import { selectCommonConfig, setLocalStorageUsers } from '../CommonConfig/commonConfigSlice';

const PasswordPage = () => {

  const cloudData = useAppSelector(selectCommonConfig);
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("Updated Sucessfully");

  var formFeilds = [
    {
      inputType: "password",
      ApiKey: "currentPassword",
      Title: "Current Password",
      value: "",
      validationMessage: "Please check the current password again",
      validation: true
    },
    {
      inputType: "password",
      ApiKey: "password",
      Title: "New Password",
      value: "",
      validationMessage: "Please make sure that the passwords match",
      validation: true
    },
    {
      inputType: "password",
      ApiKey: "confirm Pass",
      Title: "Confirm New Password",
      value: "",
      validationMessage: "Please make sure that the passwords match",
      validation: true
    },
  ];

  const [formData, setFormData] = useState<any>(formFeilds);
  const [showValidation, setSHowValidation] = useState<any>(false)

  const handleFormChange = (index, event) => {
    let data = [...formData];
    data[index].value = event.target.value;
    setFormData(data);
  };

  const handleCancel = () => {
    setFormData(formFeilds);
  };

  const handleFormSave = () => {



    var currentUser = cloudData.usersLocalStorage.filter((curr) => curr.userName === cloudData.loginDetails.currentUser)
    var temp = [...cloudData.usersLocalStorage];

    if (currentUser[0].password !== formData[0].value) {
      let data = [...formData];
      data[0].validation = false;
      setFormData(data);
      setSHowValidation(true)
      return
    } else {
      let data = [...formData];
      data[0].validation = true;
      setFormData(data);
      setSHowValidation(false)
    }

    if ((formData[1].value !== formData[2].value) && formData[1].value !== "") {
      setSHowValidation(true)
      return
    }


    temp.forEach((curr, index) => {
      var currTemp = { ...curr }
      if (currTemp.userName === cloudData.loginDetails.currentUser) {
        currTemp.password = formData[1].value
      }
      temp[index] = currTemp
    })

    localStorage.setItem('users', JSON.stringify(temp));
    dispatch(setLocalStorageUsers(temp))
    setSHowValidation(false)
    setShowModal(true)
  }
  return (
    <div className="m-2">
      <div className="p-2 onboarding-page-h bg_color">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center ps-2">
            <h4 className="p-2 ps-3 fw-bold"> Password Reset </h4>
          </div>
        </div>
        <div className="d-flex justify-content-center pt-5 ms-5 p-2">
          <div className="w-75">
            <form className="gy-2 align-items-center" autoComplete="off">
              <div className="py-3">
                {formData.map((curr: any, index: number) => {
                  return (
                    <div className={`d-flex justify-content-center`}>
                      <label className="form-label label-width">
                        <div className="d-flex justify-content-between w-75">
                          <span>
                            {curr.Title} <span className="text-danger">*</span>{" "}
                          </span>
                        </div>
                        {"  "}
                        <input
                          className={`form-control form-control-m w-100 mt-1`}
                          type={curr.inputType}
                          value={curr.value}
                          onChange={(event) => handleFormChange(index, event)}
                        />
                        {(showValidation && !curr.validation) ? <div className="d-flex justify-content-between w-75">
                          <span className="text-danger">
                            {curr.validationMessage}
                          </span>
                        </div> : <></>}
                        <small className="form-text">{curr.description}</small>
                      </label>
                    </div>
                  )
                })}
              </div>
            </form>
            <div className="d-flex justify-content-center">
              <div className="col-8 m-4">
                <DialogActions>
                  <div className="d-grid col-3 mx-auto px-2 ">
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={handleCancel}
                    >
                      <strong>Cancel</strong>
                    </button>
                  </div>
                  <div className="d-grid col-3 mx-auto px-2 py-3">
                    <button
                      type="button"
                      className="btn btn-outline-success "
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
      <PopUpModal show={showModal} modalMessage={modalMessage} onHide={() => { setShowModal(false) }} />

    </div>
  )
}

export default PasswordPage
