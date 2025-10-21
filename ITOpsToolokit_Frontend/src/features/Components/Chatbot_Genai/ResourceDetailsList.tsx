import { Tooltip } from "@mui/material";
import { TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import testapi from "../../../api/testapi.json";
import { Loader } from "../../Utilities/Loader";
import { wrapIcon } from "../../Utilities/WrapIcons";


const ResourceDetailsList = ({ orderID, GitHubLink, handlefinalSubmit, handlFinalPopUp, handleOnHide, fieldsData, handleChange, handleNavigation, formData, tfVars }) => {
  const [costApiRes, setCostApiRes] = useState<any>({ "ResourceDetails": [{}] })
  const resources = costApiRes?.['ResourceDetails'][0];
  const [isLoading, setIsLoading] = useState(false);
      const FaArrowLeftIcon = wrapIcon(FaArrowLeft);
      // const FaArrowRightIcon = wrapIcon(FaArrowRight);

  const keys = Object.keys(resources || {});

  useEffect(() => {
    setIsLoading(true)
    try {
      let requestBody = {
        "OrderID": `${orderID}`
      }
      axios.post(
        `${testapi.genAI_base_url}/gen_ai_chat_resource_cost/`,
        requestBody, {
        headers: {
          'Content-Type': "application/json"
        }
      }
      ).then((response) => {
        console.log(response)
        setIsLoading(false)
        setCostApiRes(response.data.data[0])
      });
      // await retryThreeTimes();
    } catch (error) {
      console.error("Error:", error);
      alert(`Error fetching data : ${error.message}`);
    }

  }, [])

  console.log(costApiRes, "costApiRes")

  const handlesubmit = () => {
    setIsLoading(true)
    try {
      let requestBody = {
        "OrderID": `${orderID}`,
        "GitHubLink": "GitHubLink",
        "ResourceDetails": costApiRes?.['ResourceDetails'],
        "TFVars": tfVars ? tfVars : ""
      }
      axios.post(
        `${testapi.genAI_base_url}/gen_ai_chat_create_ticket/`,
        requestBody, {
        headers: {
          'Content-Type': "application/json"
        }
      }
      ).then((response) => {
        console.log(response)
        handlFinalPopUp(response.data.data)
        setIsLoading(false)

      });

    } catch (error) {
      console.error("Error:", error);
      alert(`Error fetching data : ${error.message}`);
    }
  }

  console.log(resources, "resources lll")

  var total = Object.keys(resources).map((curr, item) => {
    return resources[curr].reduce((partialSum, a) => partialSum + a.totalMonthlyCost ? a.totalMonthlyCost : a.Monthly_cost ? a.Monthly_cost : 0, 0)
  })

  const totalSum = total.reduce((acc, curr) => acc + parseFloat(curr), 0);

  console.log(total, "total")
  return (<>
    {/* <Loader isLoading={isLoading} load={null} /> */}

    <div className="container">
      <div className="row mt-2">
        <div className=" d-flex justify-content-between align-items-center" style={{ backgroundColor: "#2d2d8f", padding: "10px", color: "white" }}>
          <label>Resource & Cost</label>
          <div style={{ paddingRight: "1rem" }}>
            <span className="f-size">OrderID : {orderID}</span>
          </div>
        </div>
        <div className="card shadow" style={{ height: "66vh", borderRadius: "initial" }}>
          <div className=" mt-2 d-flex justify-content-between">
            <div>
              <label className="d-flex text-start">Github Link</label>
              <TextField
                type="text"
                style={{ width: "34rem" }}
                className="form-control "
                value={GitHubLink || ""}
                onChange={handleChange}
                disabled
              // label="RepoLink"
              />
            </div>

          </div>

          {costApiRes?.ResourceDetails && (
            <div className="row">
              <div className="col-12 d-flex justify-content-center overflow-auto">
                <table className="table  table-borderless ">
                  <thead style={{ borderBottom: "2px solid #f2f2f2" }}>
                    <tr>
                      <th className=""></th>
                      <th className="f-size text-primary">Resource Name</th>
                      <th className="f-size text-primary">Cost (Monthly)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keys.map((key, idx) =>
                      resources[key]?.map((item, index) => (
                        <tr key={`${key}-${index}`} style={{ borderBottom: "2px solid #f2f2f2" }} >
                          {index === 0 && (
                            <td
                              className="pt-2 fw-bold alncenter"
                              rowSpan={resources[key].length}
                            >
                              <p className=" f-size">  {key} </p>
                            </td>
                          )}
                          <td className="">
                            <span className="f-size text-muted">
                              {item.ResourceName ||
                                item.Cost_component ||
                                item.Sub_resource}
                            </span>
                          </td>
                          <td className="">
                            <span className="text-muted f-size">
                              ${item.totalMonthlyCost || item.Monthly_cost || ""}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                    {/* <tr>
                      <td></td>
                      <td>
                        <p className="fw-bold f-size">
                          Total Cost 
                        </p></td>
                      <td>
                        <p className="fw-bold f-size">
                          {totalSum}
                        </p>
                      </td>
                    </tr> */}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    <div className="row pt-2">
      <div className="col gap-2  d-flex justify-content-end">
        <button onClick={handleOnHide} className="btn btn-outline-primary rounded btn-lg mx-1">Cancel</button>
        <button onClick={(e) => handleNavigation("showVulnerabilitiesPage")} className="btn btn-outline-primary rounded btn-lg mx-1">
          <FaArrowLeftIcon className="nav-link active pe-auto rounded-pill fw-bold" />

        </button>
        <button type="button" onClick={handlesubmit} className="btn btn-outline-primary btn-width font-weight-bold">Submit</button>
      </div>
    </div>
  </>
  );
};
export default ResourceDetailsList;
