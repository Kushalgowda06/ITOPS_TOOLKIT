import { TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { TbHazeMoon } from "react-icons/tb";
import testapi from "../../../api/testapi.json";
import { Loader } from "../../Utilities/Loader";
import { wrapIcon } from "../../Utilities/WrapIcons";

export const ParametersPage = ({ handleParameterBackFn, handleParameterNextFn, orderID, handleGitHubLink, handleTfVars }) => {

  const [formData, setformData] = useState<any>([])
  const [isLoading, setIsLoading] = useState(false);
  const [testReports, setTestReports] = useState([])
    const FaArrowLeftIcon = wrapIcon(FaArrowLeft);
    const FaArrowRightIcon = wrapIcon(FaArrowRight);

  // const

  console.log(formData , "formDatauuu")

  useEffect(() => {
    setIsLoading(true);

    try {
      let requestBody = {
        "OrderID": `${orderID}`
      }
      axios.post(
        `${testapi.genAI_base_url}/gen_ai_chat_parameters/`,
        requestBody, {
        headers: {
          'Content-Type': "application/json"
        }
      }
      ).then((response) => {
        // console.log(response)
        setformData(response.data.data[0])

        if (Object.keys(response.data.data[0]).includes("TestReports")) {
          // console.log("3 columns")
          setTestReports(response.data.data[0]?.TestReports)
        } else {
          handleTfVars(response.data.data[0].Content)
        }

        handleGitHubLink(response.data.data[0]['GitHubLink'])


        setIsLoading(false);
        //   setFieldsData(response.data.data[0].ConfigurationDetails[0]);
      });
      // await retryThreeTimes();

    } catch (error) {
      console.error("Error:", error);
      alert(`Error fetching data : ${error.message}`);
    }
  }, [])

  const handleNext = () => {
    handleParameterNextFn()
    // setIsLoading(true);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log( " { [name]: value } uuu" , { [name]: value } )
    var temp = {...formData}
    temp[name] = value
    setformData(temp);
  };

  console.log(formData, "setformData");

  const chatResponse = () => {
    return <>
      <div className="col-md-6"> {/* Chat Area */}
        <div className="card shadow" style={{ height: "50vh", borderRadius: "initial" }}>
          <div className="card-body d-flex flex-column h-100">
            <textarea
              name="Content"
              className="form-control f-size"
              value={formData?.Content || ""}
              rows={9}
              onChange={handleChange}
              style={{ resize: "vertical" }}
            />
          </div>
        </div>
      </div>
      <div className="col-md-6"> {/* Chat Area */}
        <div className="card shadow" style={{ height: "50vh", borderRadius: "initial" }}>
          <div className="card-body d-flex flex-column h-100">
            <TextField
              type="text"
              className="form-control f-size mt-3"
              value={formData?.GitHubLink || ""}
              disabled
              label="RepoLink"
            />
          </div>
        </div>
      </div>
    </>
  }

  const ImageResponse = () => {
    return <>

      {
        testReports.map((curr, index) => {
          return <>
            <div className="col-md-4"> {/* Chat Area */}
              <div className="card shadow" style={{ height: "50vh", borderRadius: "initial" }}>
                <div className="card-body d-flex flex-column h-100">
                  <label>{Object.keys(curr)[0]}</label>
                  <textarea
                    name="InitialReports"
                    className="form-control f-size"
                    value={curr[Object.keys(curr)[0]] || ""}
                    rows={9}
                    // onChange={handleChange}
                    style={{ resize: "vertical" }}
                  />
                </div>
              </div>
            </div>
          </>
        })
      }
    </>
  }
  return (
    <>
      <Loader isLoading={isLoading} load={null} />
      <div className="mt-2">
        <div className="row">
          <div className=""> {/* Parameter Area */}
            <div className=" d-flex justify-content-between align-items-center" style={{ backgroundColor: "#2d2d8f", padding: "10px", color: "white" }}>
              <label>{formData?.TestReports && formData?.TestReports.length ? "Execution Results" : "Parameters"}</label>
              <label>Order ID : {orderID}</label>
            
            </div>
            <div className="container">
              <div className="row p-2">
                <div className=" d-flex justify-content-center p-3">
                  <TextField
                    type="text"
                    className="form-control f-size mt-1"
                    value={formData?.GitHubLink || ""}
                    disabled
                    label="RepoLink"
                  />
                </div>
                {
                  formData?.TestReports && formData?.TestReports.length ? ImageResponse() : chatResponse()
                }
              </div>
              <div>
                <div className="d-flex justify-content-end">
                  <div className="d-flex justify-content-end p-3">
                    <button onClick={() => {
                      handleParameterBackFn("showChatBot")
                    }} className="btn btn-outline-primary rounded btn-lg mx-1 stack_btn_width">
                      <FaArrowLeftIcon className="nav-link active pe-auto rounded-pill fw-bold" />
                    </button>
                    <button onClick={handleNext} disabled={orderID === null} className="btn btn-outline-primary rounded btn-lg mx-1 stack_btn_width">
                      <FaArrowRightIcon className="nav-link active pe-auto rounded-pill fw-bold" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </>
  )

}
