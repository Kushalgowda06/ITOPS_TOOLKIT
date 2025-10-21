import axios from "axios";
import { useState, useRef, useEffect } from "react";
import ChatBotForm from "./ChatBotForm";
import { Loader } from "../../Utilities/Loader";
import { Api } from "../../Utilities/api";
import testapi from "../../../api/testapi.json";
import {
  faUndoAlt,
  faCircleChevronRight,
  faLaptop, faDatabase, faHdd, faNetworkWired, faSleigh
} from "@fortawesome/free-solid-svg-icons";
import { LuUndo, LuUndo2, LuUndoDot } from "react-icons/lu";
import ResourceDetailsList from "./ResourceDetailsList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PopUpModal } from "../../Utilities/PopUpModal";
import ModularizationForm from "./ModularizationForm";
import { TbFlagSearch } from "react-icons/tb";
import { Button, Container, TextField } from "@mui/material";
import Grid from '@mui/material/Grid';
import { Vulnerability } from "./Vulnerability";
import ChatInput from "./ChatInput";
import { FaArrowLeft, FaArrowRight, FaUser } from "react-icons/fa6";
import { BsRobot } from "react-icons/bs";
import Typewriter from "./Typewriter";
import { wrapIcon } from "../../Utilities/WrapIcons";


const ImageChatbot = () => {
  const FaArrowLeftIcon = wrapIcon(FaArrowLeft);
  const FaArrowRightIcon = wrapIcon(FaArrowRight);
  const FaUserIcon = wrapIcon(FaUser);
  const BsRobotIcon = wrapIcon(BsRobot);

  const [prompt, setPrompt] = useState("");
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [messages, setMessages] = useState([]);
  const usedOrderIds = useRef(new Set());
  const orderId = useRef(null);
  const [hitApi, setHitApi] = useState(false);
  const [fieldsData, setFieldsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(fieldsData);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [initialFormData, setInitialFormData] = useState(null);
  const [data, setData] = useState([]);
  const [showCardDetails, setShowCardDetails] = useState(false)
  const [cardData, setCardData] = useState<any>("")
  const [modularizationFormData, setModularizationFormData] = useState<any>([])
  const [showPrompt, setShowPrompt] = useState(false);
  const [resource, setResource] = useState(false);
  const [sec, setSec] = useState(false);
  const [existFormData, setExistFormData] = useState<any>({})
  const [activeCloud, setActiveCloud] = useState("Azure");
  const [vueData, setVueData] = useState(null);
  const [scanResultTexts, setScanResultTexts] = useState([]);
  const filterdData = modularizationFormData?.filter(item => item.OrderID === cardData.OrderID)
  const clouds = ["AWS", "Azure", "GCP"];
  const [intervalId, setIntervalId] = useState(null);
  const [scanSummary, setScanSummary] = useState({})
  const [showFixModal, setShowFixModal] = useState(false)
  const [modalFixMessage, setFixModalMessage] = useState("")
  const [imageURL, setImageURL] = useState("")

  const handleCardClick = async (item) => {
    setIsLoading(true);
    setPrompt("Existing Card");
    setShowCardDetails(true);
    setCardData(item);

    try {
      const response = await fetch(`${testapi.baseURL}/cloud_gen_ai_forms`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // Throw an error
      }
      const data = await response.json();
      setModularizationFormData(data.data);

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleSubmit = async (message: string, file?: any) => {

    setUserInput(message);
    setIsLoading(true);

    const previewUrl = URL.createObjectURL(file);
    setImageURL(previewUrl);
    // setImageURL(file)
    // e.preventDefault();
    let uniqueOrderId;
    do {
      uniqueOrderId = Math.random().toString(36).substring(2, 18);
    } while (usedOrderIds.current.has(uniqueOrderId));

    usedOrderIds.current.add(uniqueOrderId);
    orderId.current = uniqueOrderId;

    const requestBody = {
      OrderID: orderId.current,
      Prompt: message,
    };

    const newFOrmData = new FormData();

    newFOrmData.append("file", file)
    newFOrmData.append("unit", `{ "OrderID":"${orderId.current}","Prompt":"${message}"}`)
    // newFOrmData.append("Prompt", message)

    try {
      Api.postImage(
        `${testapi.baseURL}/gen_ai_upload_file/`,
        newFOrmData
      ).then((response) => {
        setHitApi(true);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: response?.data?.data?.message, sender: "bot" }, // Modified: Added sender property
        ]);
        // setIsLoading(false);

      });
      await retryThreeTimes();

    } catch (error) {
      console.error("Error:", error);
      alert(`Error fetching data : ${error.message}`);
      setResponse("Error sending prompt. Please try again");
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error sending prompt. Please try again", sender: "bot" }, // Modified: Added sender property
      ]);
    }
    setPrompt("");
  };

  const handlefinalSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();

    const postData = { ...formData, From: "frontend" }; // Common data
    let apiUrl = `${testapi.baseURL}/cloud_gen_ai_git/`; // Default API URL
    let finalPostData = postData; // Initialize with default

    try {
      if (existFormData.OrderID) {
        delete postData.Prompt;
        delete postData.TFVars;

        const TFVars = `\nregion = \"${existFormData.region}\"\nresource_group_name = \"${existFormData.resource_group_name}\"\nnetwork_interface_name = \"${existFormData.network_interface_name}\"\nnetwork_security_group_name = \"${existFormData.network_security_group_name}\"\nvirtual_network_name = \"${existFormData.virtual_network_name}\"\nsubnet_name = \"${existFormData.subnet_name}\"\nvm_name = \"${existFormData.vm_name}\"\n`;

        finalPostData = { ...postData, TFVars, prompt: "Existing Card" };
        apiUrl = `${testapi.baseURL}/gen_ai_existing_card_prompt/`;
      }

      const response = await Api.postCall(apiUrl, finalPostData);
      setIsLoading(false);
      setShowModal(true);
      setModalMessage(`Submit successfully. Ticket Details :${response?.data?.data}`);

    } catch (error) {
      setIsLoading(false);
      setShowModal(true);
      setModalMessage(`An error occurred while submitting the data: ${error}`);
      console.error("Error:", error);
    }
  };


  const fetchData = async () => {
    try {
      setMessages([""]);
      const getResponse = await axios.get(
        `${testapi.baseURL}/cloud_gen_ai_autogen/for_image_record/?OrderID=${orderId.current}`
      );
      // setHideData(false);

      console.log(getResponse, "getResponse0---------------", getResponse.data.data[0].ConfigurationDetails[0])
      setFieldsData(getResponse.data.data[0].ConfigurationDetails[0]);
    } catch (error) {
      console.error("Error in GET request:", error);
      setMessages(["Error fetching data"]);
    }
  };
  console.log("Loading", loading)

  const retryThreeTimes = async () => {
    console.log("beforsetLoading", loading)
    for (let i = 0; i < 3; i++) {
      try {
        await new Promise(resolve => setTimeout(resolve, 40000)); // 40 seconds delay
        const getResponse = await axios.get(
          `${testapi.baseURL}/cloud_gen_ai_autogen/for_image_record/?OrderID=${orderId.current || filterdData[0]?.OrderID}`
        );

        console.log(`Retry attempt ${i + 1}, response code: ${getResponse.data.code}, ${loading}`);
        console.log("AftersetLoading", loading)

        if (getResponse.data.code === 200) {
          setIsLoading(false);
          setFieldsData(getResponse.data.data[0].ConfigurationDetails[0]);
          return;
        }

        if (getResponse.data.code !== 404) {
          setFieldsData(getResponse.data.data[0].ConfigurationDetails[0]);
          return;
        }

        if (i === 2) {
          setIsLoading(false);
          setShowModal(true)
          setModalMessage(`AI failed to bring the correct solution this time. Requesting you to try again.`);
        }

      } catch (error) {
        console.error(`Retry attempt ${i + 1} failed:`, error);
        if (i === 2) {
          setIsLoading(false);
        }

      }
    }
  };



  useEffect(() => {
    if (orderId.current && hitApi) {
      setTimeout(() => {
        fetchData();
      }, 5000);
    }
  }, [orderId.current, hitApi]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  const handleReset = () => {
    setFormData({ ...formData, TFVars: "" });
  };

  useEffect(() => {
    if (fieldsData) {
      setInitialFormData({ ...fieldsData });
      setFormData({ ...fieldsData });
    }
  }, [fieldsData]);

  const handleOnHide = () => {
    setShowModal(false);
    window.location.reload();
  };


  const handleNext = () => {
    setPrompt("")
    setShowPrompt(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${testapi.baseURL}/cloud_gen_ai_cards`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setData(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Initial fetch

    // const interval = setInterval(fetchData, 60000);

    // return () => clearInterval(interval);     // Clean up interval on unmount
  }, []);


  const handleVueClick = async () => {
    setIsLoading(true);
    try {
      Api.postData(`${testapi.baseURL}/cloud_gen_ai_autogen_terrascan`, {
        "OrderID": orderId.current,
        "GitHubLink": fieldsData?.GitHubLink
      }).then((response: any) => {
        console.log(response.data.data, "ppp")
        setIsLoading(false);
        setVueData([{ "ScanResult": response.data.data?.ScanResult }]);
        setScanSummary(response.data.data?.Summary[0])
      })
    } catch (error) {
      setLoading(false);
      console.error("Error in GET request:", error);
      setScanResultTexts(["Error fetching data."]);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (vueData && vueData.length > 0) {
      const newScanResultTexts = vueData.map((item) => {
        if (item.ScanResult && item.ScanResult.length > 0) {
          return item.ScanResult.map((result) => {
            return [ // Array of strings for each ScanResult
              `Rule Name: ${result.rule_name}   `,
              `Description: ${result.description}   `,
              `Rule ID: ${result.rule_id}   `,
              `Severity: ${result.severity}   `,
              `Category: ${result.category}   `,
              `Resource Name: ${result.resource_name}   `,
              `Resource Type: ${result.resource_type}   `,
              `Module Name: ${result.module_name}   `,
              `File: ${result.file}   `,
              `Line: ${result.line}`,
            ].join(''); // Join the array of strings into one string.
          });
        } else {
          return ["No Scan Results available for this item."]; // Array for consistency
        }
      });
      setScanResultTexts(newScanResultTexts);
      setResource(true)

    } else {
      if (loading) {
        setScanResultTexts([["Loading..."]]); // Nested array for consistent structure
      } else {
        setScanResultTexts([["No data available. Click the button to fetch."]]); // Nested array
      }
    }

  }, [vueData]);


  const handleFilter = (cloud) => {
    setActiveCloud(cloud);
  };

  const renderCloudCards = (cloud) => {
    const cloudData = data?.filter(item => item.Cloud === cloud);
    if (cloudData && cloudData.length > 0) {
      return (
        <>
          {cloudData.map((item, key) => (
            <div key={key} className="mt-3 col-md-6 col-lg-3 col-xxl-6 py-1">
              <div className="card title-bot-card-background gencardwidth cursor-pointer card-background rounded-2 text-primary text-start" style={{ width: "15rem" }} onClick={(e) => handleCardClick(item)}>
                <div className="card-body card-height card-pad">
                  <span className="f-size card_f_size">
                    <span className="fw-bold">Cloud : </span> {item.Cloud} <br />
                  </span>
                  <span className="f-size card_f_size">
                    <span className="fw-bold">ResourceType : </span> {item.ResourceType}
                  </span>
                  <br />
                  <span className="f-size card_f_size">
                    <span className="fw-bold">Catalog : </span> {item.Catalog}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </>
      );
    } else {
      return <p>No {cloud} data available.</p>;
    }
  };

  const renderCloudData = () => {
    switch (activeCloud) {
      case "AWS":
        return renderCloudCards("AWS");
      case "Azure":
        return renderCloudCards("Azure");
      case "GCP":
        return renderCloudCards("GCP");
      default:
        return null;
    }
  };

  function handleFix() {
    setShowFixModal(true);
    setFixModalMessage(`AI will fix this
        Comming Soon!
        `);
  }

  function handleOnHideFix() {
    setShowFixModal(false)
  }

  const handleRescan = () => {

    // setResource(true)
    // setLoading(true)
    try {
      Api.getData(`${testapi.baseURL}/cloud_gen_ai_autogen_terrascan/?OrderID=${orderId.current || filterdData[0]?.OrderID}`).then((response: any) => {
        console.log(response.data.data, "ppp")
        setVueData([{ "ScanResult": response.data.data?.ScanResult }]);
        setScanSummary(response.data.data?.Summary[0])
        setResource(true)
      })
    } catch (error) {
      console.error("Error in GET request:", error);
      setScanResultTexts(["Error fetching data."]);
    } finally {

      // setLoading(false);

    }
  }

  console.log("orderId.current", orderId.current)
  console.log("formData", formData)
  const handleNavigation = (link) => {
    console.log("hi")
  }



  return (
    <div className="bg-white p-2 genAI">
      <Loader isLoading={isLoading} load={null} />
      {showCardDetails ? <ModularizationForm filterdData={filterdData} fetchData={fetchData} handleNavigation={handleNavigation} setExistFormData={setExistFormData} handleReset={handleReset} /> :
        <div className="chatbot-container h-100">
          {!showPrompt &&
            <div className="row" style={{ borderBottom: "solid 2px #2d2d8f", paddingBottom: "10px" }}>
              <div className="col-8">
                <span className="d-flex align-items-center">
                  {clouds.map((cloud) => (
                    <button
                      key={cloud}
                      type="button"
                      className={`btn btn-outline-primary rounded-0 btn-sm mx-1 ${activeCloud === cloud ? 'active' : ''}`}
                      onClick={() => handleFilter(cloud)}
                    >
                      {cloud}
                    </button>
                  ))}
                </span>
              </div>
              <div className="col-4 d-flex justify-content-end">
                <button onClick={handleNext} className="btn btn-outline-primary btn-sm btn-width font-weight-bold">  New Request</button>
              </div>
            </div>
          }
          {
            !resource ? <>
              {
                !showPrompt ? <>
                  <div className="row" style={{ height: "66vh" }}>
                    {renderCloudData()}
                  </div>
                </> : <>
                  <div className="container py-2 mt-2">
                    <div className="row">
                      <div className="col-md-6 overflow-auto"> {/* Chat Area */}
                        <div className="card shadow" style={{ height: "72vh", borderRadius: "initial" }}>
                          <div className="card-body d-flex flex-column">
                            <div className="flex-grow-1 ">
                              {userInput && (
                                <div className="d-flex flex-row justify-content-start mb-4">
                                  <div
                                    className="px-3 py-2 mx-1 profile-icon h-50 bg-secondary align-items-start text-white d-flex align-items-center justify-content-center rounded-circle"
                                  >
                                    <FaUserIcon />
                                  </div>
                                  <div className="d-flex justify-content-start w-50 user-input bg-light p-2 mb-3 role_fnt">
                                    <p className="text-start f-size"> {userInput}</p>
                                  </div>
                                </div>)}

                              {formData !== null && (
                                <div className="d-flex flex-row justify-content-end mb-4">
                                  <div className="d-flex justify-content-end w-50 user-input bg-light p-2 mb-3 role_fnt">
                                    <p className="text-start f-size"> {formData.Description}</p>
                                  </div>
                                  <div
                                    className="px-3 py-2 mx-1 profile-icon h-50 bg-secondary align-items-start text-white d-flex align-items-center justify-content-center rounded-circle"
                                  >
                                    <BsRobotIcon className="vertical-menu-icon" />
                                  </div>
                                </div>)}

                              {/* {formData !== null && (
                                <div className="d-flex justify-content-end ">
                                  <div className="d-flex justify-content-end w-50 user-input bg-light p-2 mb-3 role_fnt">
                                    <p className="text-start"> {formData.Description}</p>
                                  </div>

                                </div>
                              )} */}

                              <p className="response-text mb-3 text-start role_fnt fw-medium">{response}</p>
                            </div>
                          </div>
                        </div>
                        <ChatInput onSend={handleSubmit} />
                      </div>
                      <div className="col-md-6 "> {/* Parameter Area */}
                        <div className="d-flex justify-content-between p-2 align-items-center" style={{ backgroundColor: "#2d2d8f", color: "white" }}>
                          <div className="d-flex justify-content-end">
                            <div >
                              <span className="f-size">Configuration Details</span>
                            </div>
                          </div>
                          <span className="f-size">OrderID : {orderId.current}</span>
                        </div>
                        <div className="card shadow" style={{ height: "65vh", borderRadius: "initial" }}>
                          <div className="card-body overflow-auto">

                            <div className="mb-2 d-flex align-items-center">
                              {imageURL && <img
                                src={imageURL}
                                alt="Preview"
                                style={{ maxWidth: "50px", maxHeight: "50px", borderRadius: "5px" }}
                                className="me-2 border"
                              />}
                            </div>
                            <>
                              {
                                formData !== null ? Object.keys(formData).map((curr: any, index: number) => {
                                  if (Array.isArray(formData[curr]) && curr == "Components") {
                                    return <>
                                      <label className="d-flex pt-2 justify-content-start f-size">{curr}</label>
                                      {formData[curr].map((item, index) => {
                                        const key = Object.keys(item)[0];
                                        const { Description, "Configuration Details": Details } = item[key];
                                        return (
                                          <div className="ps-3" key={index}>
                                            <div className="f-size text-start">{key}</div>
                                            <div className="f-size ps-3 text-start">Description:
                                              <Typewriter text={Description} speed={20} />
                                            </div>
                                            <div className="f-size ps-3 text-start">Details:
                                              <Typewriter text={Details} speed={20} /></div>
                                          </div>
                                        );
                                      })}
                                    </>
                                  } else if (curr == "Flow") {
                                    return <>
                                      <label className="d-flex pt-2 justify-content-start f-size">{curr}</label>
                                      {formData["Flow"].map((currentFlow) => {
                                        return <div className="f-size ps-3 text-start">
                                          <Typewriter text={currentFlow} speed={20} />
                                        </div>
                                      })}
                                    </>
                                  } else {
                                    return <>
                                      <label className="d-flex pt-2 justify-content-start f-size">{curr}</label>
                                      <p className="f-size text-start">
                                        {/* {formData[curr]} */}
                                        <Typewriter text={formData[curr]} speed={20} />
                                      </p>
                                    </>
                                  }
                                }) : <></>
                              }
                            </>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end">
                          {/* <div className="row pt-3">
                            <div className="col gap-2 d-flex justify-content-end">
                              <button onClick={(e) => setShowPrompt(false)} className="btn btn-outline-success btn-width font-weight-bold f-size">Back</button>
                              <button type="button" onClick={handleVueClick} disabled={orderId.current === null} className="btn btn-outline-primary btn-width font-weight-bold f-size">Next</button>
                            </div>
                          </div> */}
                          <div className="d-flex justify-content-end p-3">
                            <button onClick={(e) => setShowPrompt(false)} className="btn btn-outline-primary rounded btn-lg mx-1 stack_btn_width">
                              <FaArrowLeftIcon className="nav-link active pe-auto rounded-pill fw-bold" />
                            </button>
                            <button onClick={handleVueClick} disabled={orderId.current === null} className="btn btn-outline-primary rounded btn-lg mx-1 stack_btn_width">
                              <FaArrowRightIcon className="nav-link active pe-auto rounded-pill fw-bold" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </>
              }
            </> :
              sec ? <>
                {/* <ResourceDetailsList handlefinalSubmit={handlefinalSubmit} fieldsData={fieldsData} handleChange={handleChange} setSec={setSec} handleOnHide={handleOnHide} formData={formData} /> */}
              </> : <>


              </>
          }
        </div>
      }
      <PopUpModal
        show={showModal}
        modalMessage={modalMessage}
        onHide={handleOnHide}
      />
      <PopUpModal
        show={showFixModal}
        modalMessage={modalFixMessage}
        onHide={handleOnHideFix}
      />
    </div>
  );
};
export default ImageChatbot;

