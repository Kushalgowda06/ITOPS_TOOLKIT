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
import { LuUndo, LuUndo2, LuUndoDot } from "react-icons/lu";
import ResourceDetailsList from "./ResourceDetailsList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PopUpModal } from "../../Utilities/PopUpModal";
import ModularizationForm from "./ModularizationForm";
import { TbFlagSearch } from "react-icons/tb";
import { TextField } from "@mui/material";
import Compute from "./Compute";

const Chatbot_Genai = () => {
  const [prompt, setPrompt] = useState("");
  const [userInput, setUserInput] = useState("");
  const [response, setResponse] = useState("");
  const [messages, setMessages] = useState([]); // Modified: Changed to an array to hold multiple messages
  const usedOrderIds = useRef(new Set());
  const orderId = useRef(null);
  const [hitApi, setHitApi] = useState(false);
  const [hideData, setHideData] = useState(true);
  const [fieldsData, setFieldsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log("userInput", userInput)
  const [formData, setFormData] = useState(fieldsData);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [finalData, setFinalData] = useState(null);
  const [responseStatus, setResponseStatus] = useState(false);
  const [initialFormData, setInitialFormData] = useState(null);
  const [data, setData] = useState([]);
  const [showTicketDetails, setShowTicketDetails] = useState(false)
  const [cardData, setCardData] = useState<any>("")
  const [promptData, setPromptData] = useState(false)
  const [modularizationFormData, setModularizationFormData] = useState<any>([])
  const [showPrompt, setShowPrompt] = useState(false);

  const [resource, setResource] = useState(false);
  const [sec, setSec] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("Compute");

  const handleCardClick = (item) => {
    setShowTicketDetails(true)
    setCardData(item)
    fetch('https://demoapi.intelligentservicedeliveryplatform.com/cloud_gen_ai_cards')
      .then(response => response.json())
      .then(data => setModularizationFormData(data.data))
      .catch(error => console.error('Error fetching data:', error));
  };

  const filterdData = modularizationFormData?.filter(item => item.id === cardData.id)


  console.log("modularizationFormData", filterdData, cardData.id)

  const handleSubmit = async (e) => {
    setPromptData(true)
    setUserInput(prompt);
    setIsLoading(true);
    e.preventDefault();

    let uniqueOrderId;
    do {
      uniqueOrderId = Math.random().toString(36).substring(2, 18);
    } while (usedOrderIds.current.has(uniqueOrderId));

    usedOrderIds.current.add(uniqueOrderId);
    orderId.current = uniqueOrderId;

    const requestBody = {
      OrderID: orderId.current,
      Prompt: prompt,
    };

    try {
      Api.postCall(
        `${testapi.baseURL}/cloud_gen_ai_autogen_prompt/`,
        requestBody
      ).then((response) => {
        setHitApi(true);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: response?.data?.data?.message, sender: "bot" }, // Modified: Added sender property
        ]);
      });
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

  // const handlefinalSubmit = async (e) => {
  //   e.preventDefault();

  //   try {
  //     Api.postCall(`${testapi.baseURL}/cloud_gen_ai_git/`, {
  //       ...formData,
  //       From: "frontend",
  //     }).then((response: any) => {
  //       setShowModal(true);
  //       setModalMessage(
  //         `Submit successfully. Ticket Details :${response?.data?.data}`
  //       );
  //     });
  //   } catch (error) {
  //     setShowModal(true);
  //     setModalMessage(` ${error} An error occurred while submitting the data.`);
  //     console.error("Error:", error);
  //   }
  // };

  const fetchData = async () => {
    setIsLoading(false);
    // setResponse("We are going to build your resource. Kindly wait.");
    try {
      // setMessages("");
      const getResponse = await axios.get(
        `${testapi.baseURL}/cloud_gen_ai_autogen/?OrderID=${orderId.current}`
        // ${orderId.current}`
      );
      setHideData(false);
      setFieldsData(getResponse.data.data[0]);
    } catch (error) {
      console.error("Error in GET request:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Error fetching data", sender: "bot" }, // Modified: Added sender property
      ]);
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

  const handleRefresh = () => {
    fetchData();
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
  };

  const handleNext = () => {
    setShowPrompt(true);
  };




  useEffect(() => {
    // Fetch initial data from an API or any other source
    // fetch('http://ec2-3-97-232-96.ca-central-1.compute.amazonaws.com:8006/cloud_gen_ai_cards')
    //   .then(response => response.json())
    //   .then(data => setData(data.data))
    //   .catch(error => console.error('Error fetching data:', error));

    const fetchData = () => {
      // fetch('http://ec2-3-97-232-96.ca-central-1.compute.amazonaws.com:8006/gen_ai_chat_cards/get_all_catalogs')
      //   .then(response => response.json())
      //   .then(data => setData(data.data))
      //   .catch(error => console.error('Error fetching data:', error));


      axios.post('http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/gen_ai_chat_cards/get_all_catalogs/', {})
        .then(response => {
          // var dataresponse.json()
          setData(response.data.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });

    };
    fetchData();
    const interval = setInterval(fetchData, 60000); // Fetch data every 5 seconds

    return () => clearInterval(interval);

  }, []);

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  return (
    <div className="p-2 py-3 h-100">
      <div className=" chatbot-container">
        <Compute />
      </div>
    </div>
  );
};

export default Chatbot_Genai;

