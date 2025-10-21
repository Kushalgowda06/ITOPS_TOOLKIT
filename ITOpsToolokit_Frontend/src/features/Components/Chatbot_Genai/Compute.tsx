import axios from "axios";
import { useState, useRef, useEffect } from "react";
import ChatBotForm from "./ChatBotForm";
import { Loader } from "../../Utilities/Loader";
import { Api } from "../../Utilities/api";
import testapi from "../../../api/testapi.json";
import {
  faUndoAlt,
  faCircleChevronRight,
  faLaptop, faDatabase, faHdd, faNetworkWired
} from "@fortawesome/free-solid-svg-icons";
import ResourceDetailsList from "./ResourceDetailsList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PopUpModal } from "../../Utilities/PopUpModal";
import ModularizationForm from "./ModularizationForm";
import { TbFlagSearch } from "react-icons/tb";
import { Box, CircularProgress, TextField } from "@mui/material";
import Grid from '@mui/material/Grid';
import { Vulnerability } from "./Vulnerability";
import { SocketInput } from "./SocketInput";
import Typewriter from "./Typewriter";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa6";
import { ParametersPage } from "./ParametersPage";
import ChatInput from "./ChatInput";
import ApiResponseDisplay from "./ApiResponseDisplay";
import { wrapIcon } from "../../Utilities/WrapIcons";


const Compute = () => {
  const FaArrowLeftIcon = wrapIcon(FaArrowLeft);
  const FaArrowRightIcon = wrapIcon(FaArrowRight);


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
  const [showVulnerability, setShowVulnerability] = useState(false)
  const [showParameters, setShowParameters] = useState(false)
  const [configLoader, setconfigLoader] = useState(false)

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
  const [promptHistory, setPrompthistory] = useState([])
  const [socketResponses, setSocketResponses] = useState([])
  const [chatArray, setChatArray] = useState([])
  const [orderID, setOrderID] = useState(0)
  const [GitHubLink, setGitHubLink] = useState('')
  const [tfVars, setTFvars] = useState(null)
  const [chatLoader, setChatLoader] = useState(false)
  const [showFileUrl, setShowFileUrl] = useState('')


  var uniqueOrderId;


  useEffect(() => {

    setOrderID(Date.now())
  }, [])
  const handleSendPrompt = (prompt) => {

    setChatLoader(true)

    console.log(prompt, "prompt")

    let temp = [...promptHistory];
    temp.push(prompt)
    setPrompthistory(temp)
  }

  const handlePromptResponse = (response) => {
    setChatLoader(false)
    let temp = [...socketResponses];
    temp.push(response)
    setSocketResponses(temp)
  }


  const handleCardClick = async (item) => {
    setIsLoading(true);
    setPrompt("Existing Card");
    // setShowCardDetails(true);
    setCardData(item);

    try {
      axios.post('http://ec2-16.52.107.209.ca-central-1.compute.amazonaws.com:8006/gen_ai_chat_forms/', { "OrderID": `${item.OrderID}` })
        .then(response => {
          setIsLoading(false);
          setModularizationFormData(response.data.data);
          setActiveTab('showModularizationForm')
        })
        .catch(error => {
          setIsLoading(false);
          console.error('Error fetching data:', error);
        });
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching data:', error);
    }
  };


  const handleSubmit = async (data: any) => {
    // setUserInput(prompt);
    setIsLoading(true);
    // e.preventDefault();
    const requestBody = {
      "OrderID": `${orderID}`,
    };

    try {
      axios.post(
        `${testapi.genAI_base_url}/gen_ai_chat_config/`,
        requestBody, {
        headers: {
          'Content-Type': "application/json"
        }
      }
      ).then((response) => {
        setIsLoading(false);
        console.log(response.data.data[0]?.ConfigurationDetails[0], "response")
        setFieldsData(data.ConfigurationDetails[0]);
      });
      // await retryThreeTimes();

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
    // setResponse("We are going to build your resource. Kindly wait.");
    try {
      const getResponse = await axios.get(
        `${testapi.baseURL}/cloud_gen_ai_autogen/?OrderID=${orderId.current || filterdData[0]?.OrderID}`
      );

      setFieldsData(getResponse.data.data[0]);
      // }
    } catch (error) {
      console.error("Error in GET request:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error fetching data", sender: "bot" },
      ]);
    }
  };
  console.log("Loading", loading)

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



  useEffect(() => {
    const fetchData = async () => {
      try {
        axios.post('http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/gen_ai_chat_cards/get_all_catalogs/', {})
          .then(response => {
            // var dataresponse.json()
            setData(response.data.data);
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Initial fetch

    // const interval = setInterval(fetchData, 60000);

    // return () => clearInterval(interval);     // Clean up interval on unmount
  }, []);


  console.log(showFileUrl, "iop")
  const handleVueClick = async () => {
    setIsLoading(true);
    let parsedPromt = JSON.parse(promptHistory[promptHistory.length - 1])


    var reqBody;

    console.log(parsedPromt[0].payload.type, "tt")

    if (parsedPromt[0].payload.type == 'image') {
      reqBody = {
        "OrderID": `${orderID}`,
        "Prompt": `${showFileUrl}`
      }
    } else {
      reqBody = {
        "OrderID": `${orderID}`,
        "Prompt": `${parsedPromt[0]?.payload.payload}`
      }
    }

    try {
      axios.post(`${testapi.genAI_base_url}/gen_ai_chat_wrapper_generate_code`, reqBody, {
        headers: {
          'Content-Type': "application/json"
        }
      }).then((response: any) => {
        setIsLoading(false);
        setVueData([{ "ScanResult": response.data.data?.ScanResult }]);
        setActiveTab("showParametersPage")
      })
    } catch (error) {
      setLoading(false);
      console.error("Error in GET request:", error);
      setScanResultTexts(["Error fetching data."]);
    } finally {
      setLoading(false);
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
            <div key={key} className="mt-3 col-md-6 col-lg-3 col-xxl-6 py-1 px-5">
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


  useEffect(() => {

    let result = []
    for (var i = 0; i < socketResponses.length; i++) {
      result.push(socketResponses[i]);
      result.push(promptHistory[i]);
    }

    console.log(socketResponses[socketResponses.length - 1], 'll')

    setChatArray(result)

    if (socketResponses.length) {
      const socketResponseParsed = JSON.parse(socketResponses[socketResponses.length - 1])


      console.log(socketResponseParsed[0], socketResponseParsed[0]?.payload.payload, "qq")
      // socketResponseParsed[0]?.payload.payload === 'json'
      const callApi = isPlainObject(socketResponseParsed[0]?.payload.payload)
      if (!callApi && socketResponseParsed[0]?.payload.payload?.includes("Your Configuration Details will load soon..\nKindly wait while AI loads the data for you.\nYou are requested to click NEXT if you are satisfied with the provided configuration. You will be able to provide your specifications in next page.")) {
        setconfigLoader(true)
      }


      if (callApi) {
        console.log("calling")
        setconfigLoader(false)
        // handleSubmit()
        setFieldsData(socketResponseParsed[0]?.payload.payload);

      }
    }

  }, [socketResponses, promptHistory])

  function isPlainObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }


  console.log(chatArray, "ppp")

  const chatMarkup = () => {
    return <>{
      chatArray.map((curr, index) => {

        if (!curr) {
          return
        }
        let current = JSON.parse(curr)
        // let current

        console.log(curr, current[0], "xx")
        if (curr && index != chatArray.length - 1) {


          if (current[0]?.payload.type == 'text') {
            return <div className={`d-flex ${current[0].sender === "bot" ? 'justify-content-start' : 'justify-content-end'}`}>
              <div className="d-flex flex-row w-50 user-input bg-light p-2 mb-3 role_fnt">
                <p className="text-start f-size"> {current[0]?.payload?.payload}</p>
              </div>
            </div>
          } else if (current[0]?.payload.type == 'image') {
            return <div className={`d-flex ${current[0].sender === "bot" ? 'justify-content-start' : 'justify-content-end'}`}>
              <div className="d-flex flex-row w-50 user-input bg-light p-2 mb-3 role_fnt">
                <img
                  src={`${current[0].payload.payload}`}
                  alt="Preview"
                  style={{ maxWidth: "150px", maxHeight: "150px", borderRadius: "5px" }}
                  className="me-2 border"
                />
                {/* <Typewriter text={curr} speed={20} /> */}
              </div>
            </div>
          }
        }
        //  else if (curr && current[0]?.payload?.includes('blob')) {
        //   return <div className={`d-flex ${index % 2 === 0 ? 'justify-content-start' : 'justify-content-end'}`}>
        //     <div className="d-flex flex-row w-50 user-input bg-light p-2 mb-3 role_fnt">
        //       <img
        //         src={`${current[0].payload}`}
        //         alt="Preview"
        //         style={{ maxWidth: "150px", maxHeight: "150px", borderRadius: "5px" }}
        //         className="me-2 border"
        //       />
        //       {/* <Typewriter text={curr} speed={20} /> */}
        //     </div>
        //   </div>
        // } else if (curr && !current[0]?.payload?.includes('blob')) {
        //   return <div className={`d-flex ${index % 2 === 0 ? 'justify-content-start' : 'justify-content-end'}`}>
        //     <div className="d-flex flex-row w-50 user-input bg-light p-2 mb-3 role_fnt">
        //       <p className="text-start f-size"> {current[0].payload}</p>
        //       {/* <Typewriter text={curr} speed={20} /> */}
        //     </div>
        //   </div>
        // }
      })}
    </>
  }

  const handleParameterNext = () => {
    // setShowVulnerability(true)
    // setShowParameters(false)
    setActiveTab("showVulnerabilitiesPage")
  }


  const handleGitHubLink = (link) => {
    setGitHubLink(link)
  }
  const handleTfVars = (vars) => {
    setTFvars(vars)
  }

  const handlFinalPopUp = (requestID) => {
    setModalMessage(`Submitted Successfully your ID: ${requestID}`)
    setShowModal(true)
  }

  const handleNavigation = (tab) => {
    setActiveTab(tab)
  }

  const [activeTab, setActiveTab] = useState("showCloudCards")
  console.log(activeTab, "activetab")
  const renderContent = () => {
    switch (activeTab) {
      case 'showModularizationForm':
        return <ModularizationForm filterdData={filterdData} fetchData={fetchData} handleNavigation={handleNavigation} setExistFormData={setExistFormData} handleReset={handleReset} />;
      case 'showCloudCards':
        return <div className="chatbot-container">
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
              <button onClick={() => { setActiveTab("showChatBot") }} className="btn btn-outline-primary btn-sm btn-width font-weight-bold">  New Request</button>
            </div>
          </div>
          <div className="row" style={{ height: "21.5rem" }}>
            {renderCloudData()}
          </div>
        </div>;
      case "showChatBot":
        return <>
          <div className="py-2 mt-2">
            <div className="row">
              {/* Chat Area */}
              <div className="col-12 col-md-6 mb-3">

                <div className="card shadow" style={{ height: "66vh", borderRadius: "initial" }}>

                  <div className="card-body d-flex flex-column h-100">

                    <div className="flex-grow-1 overflow-auto position-relative">
                      {chatLoader ? (
                        //  <Box className= {Api.getPopUpData() ? 'loader1' : "loader"}>
                        <Box className={"chat-spinner-overlay "}>
                          <CircularProgress />
                        </Box>
                      ) : null}
                      {chatMarkup()}
                      <p className="response-text mb-3 text-start role_fnt fw-medium">{response}</p>
                    </div>
                  </div>
                </div>
                <ChatInput setFileUrl={(link) => { setShowFileUrl(link) }} orderId={orderID} sendPrompt={handleSendPrompt} sendMessageHistory={handlePromptResponse} />
              </div>
              {/* Parameter Area */}
              <div className="col-12 col-md-6 mb-3">
                <div className="d-flex justify-content-between p-2 align-items-center" style={{ backgroundColor: "#2d2d8f", color: "white" }}>
                  <div className="d-flex justify-content-end">
                    <span className="f-size">Configuration Details</span>
                  </div>
                  <span className="f-size">OrderID : {orderID}</span>
                </div>
                <div className="card shadow" style={{ height: "59vh", borderRadius: "initial" }}>
                  {configLoader ? (
                    //  <Box className= {Api.getPopUpData() ? 'loader1' : "loader"}>
                    <Box className={"chat-spinner-overlay "}>
                      <CircularProgress />
                    </Box>
                  ) : null}
                  <div className="card-body overflow-auto">
                    {formData !== null &&
                      <ApiResponseDisplay response={formData} />}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="d-flex justify-content-end">
                <div className="d-flex justify-content-end p-3">
                  <button onClick={(e) => setActiveTab("showCloudCards")} className="btn btn-outline-primary rounded btn-lg mx-1 stack_btn_width">
                    <FaArrowLeftIcon className="nav-link active pe-auto rounded-pill fw-bold" />
                  </button>
                  <button onClick={() => handleVueClick()} disabled={orderID === null} className="btn btn-outline-primary rounded btn-lg mx-1 stack_btn_width">
                    <FaArrowRightIcon className="nav-link active pe-auto rounded-pill fw-bold" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      case "showParametersPage":
        return <div className="chatbot-container">
          <ParametersPage handleParameterBackFn={handleNavigation} handleParameterNextFn={handleParameterNext} orderID={orderID} handleGitHubLink={handleGitHubLink} handleTfVars={handleTfVars} />
        </div>;
      case "showResourceDetailsPage":
        return <div className="chatbot-container">
          <ResourceDetailsList orderID={orderID} GitHubLink={GitHubLink} handlefinalSubmit={handlefinalSubmit} fieldsData={fieldsData} handleChange={handleChange} handleNavigation={handleNavigation} handlFinalPopUp={handlFinalPopUp} handleOnHide={handleOnHide} formData={formData} tfVars={tfVars} />
        </div>;
      case "showVulnerabilitiesPage":
        return <div className="chatbot-container">
          <Vulnerability fieldsData={fieldsData} handleChange={handleChange} handleNavigation={handleNavigation} setSec={setSec} summary={scanSummary} handleReScan={handleRescan} GitHubLink={GitHubLink} orderID={orderID} />
        </div>;
      default:
        return <div></div>;
    }
  };


  return (
    <div className="bg-white h-100 genAI">
      <Loader isLoading={isLoading} load={null} />
      {renderContent()}
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
export default Compute;

