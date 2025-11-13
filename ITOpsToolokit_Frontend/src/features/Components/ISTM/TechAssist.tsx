import axios from "axios";
import { useState, useEffect } from "react";
import { Api } from "../../Utilities/api";
import ChatWindow from "../../Utilities/ChatWindow";
import TeachAssistInput from "../../Utilities/TeachAssistInput";
import TypingDotsStyle from "../../Utilities/TypingDotsStyle";
import HeaderBar from "../AksCluster/TitleHeader";

// import { Api } from "../utils/api";
// import testapi from "../../../api/testapi.json";

// import HeaderBar from "../AksCluster/TitleHeader";
// import HeaderBar from "../utils/TitleHeader";

const CHAT_STORAGE_KEY = "techassist_chat_history";
const CONTEXT_STORAGE_KEY = "techassist_context";
const CURRENT_TICKET_KEY = "techassist_current_ticket";

const TechAssistChat = ({
  onWorkNotesUpdate,
  selectedTicket,
  knowledgeAssistContent,
  knowledgeAssistSuccess,
  knowledgeAssistLoading,
}) => {
  // Authentication variables - keeping for future use
  // const dispatch = useAppDispatch();
  // const { token: techAssistToken, isAuthenticated, isLoading, error } = useAppSelector((state) => state.techAssist);

  // Track the current ticket to detect changes
  const [currentTicketId, setCurrentTicketId] = useState(null);

  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState([]);
  const [hasGeneratedInitialMessage, setHasGeneratedInitialMessage] =
    useState(false);
  const [systemContext, setSystemContext] = useState(null);
  console.log("selectedTicket", selectedTicket);
  useEffect(() => {
    try {
      const savedTicketId = localStorage.getItem(CURRENT_TICKET_KEY);
      const savedHistory = localStorage.getItem(CHAT_STORAGE_KEY);
      const savedContext = localStorage.getItem(CONTEXT_STORAGE_KEY);
      if (
        savedTicketId &&
        selectedTicket &&
        savedTicketId === selectedTicket.sys_id &&
        savedHistory
      ) {
        const parsedHistory = JSON.parse(savedHistory);
        const parsedContext = savedContext ? JSON.parse(savedContext) : [];

        setChatHistory(parsedHistory);
        setConversationContext(parsedContext);
        setCurrentTicketId(savedTicketId);

        return;
      }
    } catch (error) {
      console.error("Error restoring chat history:", error);
    }

    setChatHistory([]);
    setConversationContext([]);
    setHasGeneratedInitialMessage(false);
    setSystemContext(null);
    if (selectedTicket) {
      setCurrentTicketId(selectedTicket.sys_id);
      localStorage.setItem(CURRENT_TICKET_KEY, selectedTicket.sys_id);
      localStorage.removeItem(CHAT_STORAGE_KEY);
      localStorage.removeItem(CONTEXT_STORAGE_KEY);
    } else {
      setCurrentTicketId(null);
      localStorage.removeItem(CURRENT_TICKET_KEY);
      localStorage.removeItem(CHAT_STORAGE_KEY);
      localStorage.removeItem(CONTEXT_STORAGE_KEY);
    }
  }, [selectedTicket]); // Include selectedTicket in dependencies

  useEffect(() => {
    if (
      currentTicketId !== null &&
      selectedTicket?.sys_id !== currentTicketId
    ) {
      // Clear chat and context
      setChatHistory([]);
      setConversationContext([]);
      setHasGeneratedInitialMessage(false);
      setSystemContext(null);

      if (selectedTicket) {
        setCurrentTicketId(selectedTicket.sys_id);
        localStorage.setItem(CURRENT_TICKET_KEY, selectedTicket.sys_id);
        localStorage.removeItem(CHAT_STORAGE_KEY);
        localStorage.removeItem(CONTEXT_STORAGE_KEY);
      } else {
        setCurrentTicketId(null);
        localStorage.removeItem(CURRENT_TICKET_KEY);
        localStorage.removeItem(CHAT_STORAGE_KEY);
        localStorage.removeItem(CONTEXT_STORAGE_KEY);
      }
    }
  }, [selectedTicket?.sys_id, currentTicketId]); // Include currentTicketId in dependencies

  useEffect(() => {
    if (selectedTicket && currentTicketId && chatHistory.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatHistory));
      console.log("💾 Saved chat history for ticket:", selectedTicket.number);
    }
  }, [chatHistory, selectedTicket, currentTicketId]);

  useEffect(() => {
    if (selectedTicket && currentTicketId && conversationContext.length > 0) {
      localStorage.setItem(
        CONTEXT_STORAGE_KEY,
        JSON.stringify(conversationContext)
      );
    }
  }, [conversationContext, selectedTicket, currentTicketId]);

  // Generate initial message when ticket and knowledge content are available and successful
  useEffect(() => {
    if (
      selectedTicket &&
      knowledgeAssistContent &&
      knowledgeAssistSuccess &&
      !hasGeneratedInitialMessage &&
      chatHistory.length === 0
    ) {
      generateInitialMessage(selectedTicket, knowledgeAssistContent);
    }
  }, [
    selectedTicket,
    knowledgeAssistContent,
    knowledgeAssistSuccess,
    hasGeneratedInitialMessage,
    chatHistory.length,
  ]);

  // Reset hasGeneratedInitialMessage when ticket changes
  useEffect(() => {
    if (selectedTicket && currentTicketId !== selectedTicket.sys_id) {
      setHasGeneratedInitialMessage(false);
    }
  }, [selectedTicket, currentTicketId]);

  const formatSingleTicket = (ticket) => {
    return `

 Ticket Number: ${ticket.number || "N/A"}

 Summary: ${ticket.short_description || "No description"}

Description: ${ticket.description || "No additional description"}

 Resolution: ${ticket.close_notes || "No close notes"}

 View Full Ticket: ${ticket.ticket_link || "No link available"}

 System ID: ${ticket.sys_id || "N/A"}`;
  };

  // COMMENTED OUT - Authentication functions (keeping for future use)
  // const performLogin = async () => {
  //   dispatch(setTechAssistLoading(true));
  //
  //   const tokenRequestBody = {
  //     username: "techassist_user",
  //     password: "techassist_password",
  //   };
  //
  //   try {
  //     const response = await Api.postTechAssistAuth(testapi.techAssistAuth, tokenRequestBody);
  //     const token = response?.data?.access_token;
  //
  //     if (token) {
  //       // Store token in local storage
  //       localStorage.setItem('techAssist_token', token);
  //
  //       // Store in Redux state
  //       dispatch(setTechAssistToken(token));
  //     } else {
  //       dispatch(setTechAssistError('Unable to connect to TechAssist service'));
  //     }
  //   } catch (error) {
  //     console.error("Error during TechAssist login:", error);
  //
  //     // User-friendly login error messages
  //     let loginErrorMessage = 'Unable to connect to TechAssist service';
  //
  //     if (error.response?.status === 401) {
  //       loginErrorMessage = 'TechAssist service authentication failed';
  //     } else if (error.response?.status === 500) {
  //       loginErrorMessage = 'TechAssist service is temporarily unavailable';
  //     } else if (!error.response) {
  //       loginErrorMessage = 'Cannot connect to TechAssist service. Please check your connection.';
  //     }
  //
  //     dispatch(setTechAssistError(loginErrorMessage));
  //   } finally {
  //     dispatch(setTechAssistLoading(false));
  //   }
  // };

  // COMMENTED OUT - Authentication useEffect (keeping for future use)
  // useEffect(() => {
  //   const storedToken = localStorage.getItem('techAssist_token');
  //   const tokenExpiry = localStorage.getItem('techAssist_token_expiry');
  //
  //   if (storedToken && tokenExpiry) {
  //     const currentTime = Date.now();
  //     const expiryTime = parseInt(tokenExpiry);
  //
  //     // Token exists and is not expired
  //     if (currentTime < expiryTime) {
  //       if (!techAssistToken) {
  //         dispatch(setTechAssistToken(storedToken));
  //       }
  //       return; // Don't call login API
  //     } else {
  //       // Token expired, clear it
  //       localStorage.removeItem('techAssist_token');
  //       localStorage.removeItem('techAssist_token_expiry');
  //       dispatch(clearTechAssistToken());
  //     }
  //   }
  //
  //   // Only call login if no valid token exists
  //   if (!storedToken && !isAuthenticated && !isLoading) {
  //     performLogin();
  //   }
  // }, []); // Only run once on mount

  // Function to generate initial message using LLM
  const generateInitialMessage = async (ticket, kbContent) => {
    if (
      !ticket ||
      !ticket.short_description ||
      !ticket.description ||
      !kbContent
    ) {
      console.log("Missing required data for initial message generation");
      return;
    }

    setIsTyping(true);
    try {
      // Extract kb_content from the knowledgeAssistContent response
      let kb_content = "";
      if (
        kbContent.output &&
        kbContent.output.data &&
        kbContent.output.data.content
      ) {
        kb_content = kbContent.output.data.content;
      } else if (typeof kbContent === "string") {
        kb_content = kbContent;
      } else if (kbContent.content) {
        kb_content = kbContent.content;
      } else {
        console.warn(
          "Could not extract content from knowledgeAssistContent:",
          kbContent
        );
        kb_content = JSON.stringify(kbContent);
      }

      const requestBody = {
        query: `Read the following content. It contains steps to resolve a specific issue -

Incident Details-
Short Description: ${ticket.short_description}
Description: ${ticket.description}

Relevant resolution mechanism -
${kb_content}

Generate a set of instructions in a layman language for IT engineer who can execute backend commands to resolve the issue.`,
      };

      console.log("Generating initial message with request body:", requestBody);

      // const response = await Api.postCall(
      //   "https://backend.autonomousitopstoolkit.com/llm/api/v1/ask_llm_in_isolation/",
      //   requestBody
      // );

      const response = await await axios.post(
        "https://backend.autonomousitopstoolkit.com/kb_management/api/v1/get_contextual_response/",
        requestBody,
        {
          auth: {
            username: "rest",
            password: "!fi$5*4KlHDdRwdbup%ix",
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        let botResponseText = "";
        let systemContextData = "";

        if (response.data.output && response.data.output.data) {
          botResponseText = response.data.output.data;
          systemContextData = response.data.output.data;
        } else if (response.data.data) {
          botResponseText = response.data.data;
          systemContextData = response.data.data;
        } else if (response.data.response) {
          botResponseText = response.data.response;
          systemContextData = response.data.response;
        } else if (typeof response.data === "string") {
          botResponseText = response.data;
          systemContextData = response.data;
        } else {
          botResponseText = "Initial resolution steps generated successfully.";
          systemContextData =
            "Initial resolution steps generated successfully.";
        }

        // Store the system context for future requests
        const initialSystemContext = {
          context: [
            {
              role: "system",
              content: systemContextData,
            },
          ],
        };
        setSystemContext(initialSystemContext);
        console.log("System context set:", initialSystemContext);

        const initialBotMsg = {
          sender: "bot",
          text: botResponseText,
          timestamp: Date.now(),
          isInitialMessage: true,
          ticketData: ticket,
        };

        setChatHistory([initialBotMsg]);
        setHasGeneratedInitialMessage(true);
        console.log("Initial message generated successfully");
      }
    } catch (error) {
      console.error("Error generating initial message:", error);
      const errorMsg = {
        sender: "bot",
        text: "I apologize, but I encountered an error while generating the initial resolution steps. Please try asking me directly about this ticket.",
        timestamp: Date.now(),
        isInitialMessage: true,
        ticketData: ticket,
      };
      setChatHistory([errorMsg]);
      setHasGeneratedInitialMessage(true);
    } finally {
      setIsTyping(false);
    }
  };

  const sendMessage = async (message) => {
    const userMsg = { sender: "user", text: message, timestamp: Date.now() };
    setChatHistory((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // COMMENTED OUT - Authentication logic (keeping for future use)
      // const currentToken = techAssistToken || localStorage.getItem('techAssist_token');
      //
      // if (!currentToken) {
      //   // If no token, attempt login first
      //   await performLogin();
      //   const newToken = localStorage.getItem('techAssist_token');
      //   if (!newToken) {
      //     // Create error message for authentication failure
      //     const authErrorMsg = {
      //       sender: "bot",
      //       text: "I'm having trouble connecting. Please try again in a moment.",
      //       timestamp: Date.now(),
      //     };
      //     setChatHistory((prev) => [...prev, authErrorMsg]);
      //     return; // Exit early
      //   }
      // }

      // Make API call to TechAssist chat endpoint with context-based payload
      // Use systemContext for the first message, then conversationContext for subsequent messages
      const contextToUse =
        conversationContext.length > 0
          ? conversationContext
          : systemContext
          ? systemContext.context
          : [];

      const payload = {
        query: message,
        context: {
          context: contextToUse,
        },
      };

      console.log("Sending payload:", payload);
      console.log("Current context length:", contextToUse.length);
      console.log("Using context:", contextToUse);

      // const response = await Api.postTechAssistData("https://backend.autonomousitopstoolkit.com/resolution_management/api/v1/act_for_demo_on_ask", payload, null);

      const response = await axios.post(
        "https://backend.autonomousitopstoolkit.com/resolution_management/api/v1/act_for_demo_on_ask",
        payload,
        {
          auth: {
            username: "rest",
            password: "!fi$5*4KlHDdRwdbup%ix",
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = response?.data;
      console.log("Response data:", responseData);

      if (responseData?.code === 200) {
        let botResponseText = "";
        let contextUpdatedFromAPI = false;

        if (responseData.output && Array.isArray(responseData.output)) {
          const tickets = responseData.output;
          if (tickets.length > 0) {
            if (tickets.length > 1) {
              const summaryMsg = {
                sender: "bot",
                text: `Found ${tickets.length} tickets related to your query:`,
                timestamp: Date.now(),
                isTicketResponse: false,
              };
              setChatHistory((prev) => [...prev, summaryMsg]);
            }

            tickets.forEach((ticket, index) => {
              const ticketMsg = {
                sender: "bot",
                text: formatSingleTicket(ticket),
                timestamp: Date.now() + index,
                isTicketResponse: true,
                ticketData: [ticket],
              };
              setChatHistory((prev) => [...prev, ticketMsg]);
            });
          } else {
            const noTicketsMsg = {
              sender: "bot",
              text: "No tickets found for your query.",
              timestamp: Date.now(),
              isTicketResponse: false,
            };
            setChatHistory((prev) => [...prev, noTicketsMsg]);
          }
          return;
        } else if (responseData.output && responseData.output.data) {
          const outputData = responseData.output.data;

          if (typeof outputData === "object" && outputData.response) {
            botResponseText = outputData.response;

            if (outputData.work_notes_or_comments && onWorkNotesUpdate) {
              console.log(
                "Received work_notes_or_comments:",
                outputData.work_notes_or_comments
              );
              onWorkNotesUpdate(outputData.work_notes_or_comments);
            }

            if (
              outputData.context &&
              outputData.context.context &&
              Array.isArray(outputData.context.context)
            ) {
              console.log(
                "API returned context data, using it for next request:",
                outputData.context.context
              );
              setConversationContext(outputData.context.context);
              contextUpdatedFromAPI = true;
            } else if (
              outputData.context &&
              Array.isArray(outputData.context)
            ) {
              console.log(
                "API returned context data (legacy format), using it for next request:",
                outputData.context
              );
              setConversationContext(outputData.context);
              contextUpdatedFromAPI = true;
            }
          } else if (typeof outputData === "string") {
            botResponseText = outputData;
          } else {
            console.warn("Unexpected output data format:", outputData);
            botResponseText = JSON.stringify(outputData);
          }
        } else if (responseData.message) {
          botResponseText = responseData.message;
        } else {
          botResponseText =
            "I received your message but couldn't process it properly.";
        }

        const botMsg = {
          sender: "bot",
          text: botResponseText,
          timestamp: Date.now(),
          isTicketResponse: false,
          ticketData: null,
        };
        setChatHistory((prev) => [...prev, botMsg]);

        if (
          responseData.context &&
          responseData.context.context &&
          Array.isArray(responseData.context.context)
        ) {
          console.log(
            "Updating context from response root:",
            responseData.context.context
          );
          setConversationContext(responseData.context.context);
          contextUpdatedFromAPI = true;
        } else if (
          responseData.context &&
          Array.isArray(responseData.context)
        ) {
          console.log(
            "Updating context from response root (legacy format):",
            responseData.context
          );
          setConversationContext(responseData.context);
          contextUpdatedFromAPI = true;
        }

        if (!contextUpdatedFromAPI) {
          const newUserContext = {
            role: "user",
            content: message,
          };

          const newSystemContext = {
            role: "system",
            content: botResponseText,
          };

          setConversationContext((prev) => {
            const newContext = [...prev, newUserContext, newSystemContext];
            console.log(
              "Built context manually. Total messages:",
              newContext.length
            );
            return newContext;
          });
        } else {
          console.log(
            "Context was provided by API, skipping manual context building"
          );
        }
      } else {
        const errorText =
          responseData?.message ||
          "I received your message but couldn't process it properly.";
        const botMsg = {
          sender: "bot",
          text: errorText,
          timestamp: Date.now(),
          isTicketResponse: false,
          ticketData: null,
        };
        setChatHistory((prev) => [...prev, botMsg]);
      }
    } catch (error) {
      let userFriendlyMessage =
        "I'm experiencing technical difficulties. Please try again in a moment.";

      if (error.response?.status === 401) {
        // COMMENTED OUT - Authentication error handling (keeping for future use)
        // userFriendlyMessage = "I need to reconnect. Please try sending your message again.";
        userFriendlyMessage =
          "Request not authorized. Please check the API configuration.";
      } else if (error.response?.status === 422) {
        userFriendlyMessage =
          "I didn't understand your request format. Could you please rephrase your question?";
      } else if (error.response?.status === 500) {
        userFriendlyMessage =
          "I'm having some internal issues right now. Please try again in a few minutes.";
      } else if (error.code === "NETWORK_ERROR" || !error.response) {
        userFriendlyMessage =
          "I'm having trouble connecting. Please check your internet connection and try again.";
      }

      console.log("Sending error message:", userFriendlyMessage);

      const errorMsg = {
        sender: "bot",
        text: userFriendlyMessage,
        timestamp: Date.now(),
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };
  console.log("knowledgeAssistSuccess", knowledgeAssistSuccess);

  return (
    <div className="custom-container rounded-top shadow-lg text-white rounded-bottom">
      <HeaderBar
        content="Tech Assist"
        position="center"
        padding="px-3"
        partialBorder={true}
      />
      <div className="mt-1 rounded-bottom flex-grow-1 d-flex flex-column overflow-auto">
        <TypingDotsStyle />

        {/* {: (
          <></>
        )} */}
        { selectedTicket === null ? (
          <>
            <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
              <div className="d-flex flex-column align-items-center text-center">
                <div className="fw-medium no_card_p text-white">
                  Please select a ticket for AI assistance
                </div>
              </div>
            </div>
          </>
        ) : knowledgeAssistLoading ? (
          <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
            <div className="d-flex flex-column align-items-center text-center">
              {/* Spinner */}
              <div
                className="spinner-border text-primary"
                style={{ width: "3rem", height: "3rem" }}
              ></div>

              <h3 className="h5 fw-medium text-white mt-3">
                Waiting for Knowledge Assist
              </h3>
              <p className="text-muted small" style={{ maxWidth: "24rem" }}>
                Tech Assist will be available once Knowledge Assist successfully
                loads the contextual information for this ticket.
              </p>
            </div>
          </div>
        ) : !knowledgeAssistSuccess ? (
          <div className="flex-grow-1 d-flex align-items-center justify-content-center p-4">
            <div className="d-flex flex-column align-items-center text-center">
              {/* Warning Icon */}
              <div
                className="rounded-circle bg-warning bg-opacity-25 border border-warning d-flex align-items-center justify-content-center"
                style={{ width: "3rem", height: "3rem" }}
              >
                <svg
                  className="text-warning"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              <h3 className="h5 fw-medium text-white mt-3">
                Knowledge Assist Required
              </h3>
              <p className="text-muted small" style={{ maxWidth: "24rem" }}>
                {knowledgeAssistContent?.error
                  ? "Knowledge Assist failed to load. Please try selecting the ticket again or refresh the page."
                  : "Please wait for Knowledge Assist to successfully load contextual information before using Tech Assist."}
              </p>

              {knowledgeAssistContent?.error && (
                <button
                  onClick={() => window.location.reload()}
                  className="btn create_ticket_btn_gradient mt-3"
                >
                  Refresh Page
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <ChatWindow chatHistory={chatHistory} isTyping={isTyping} />
            <TeachAssistInput
              onSend={sendMessage}
              placeholder={
                knowledgeAssistSuccess
                  ? "Type your prompt here..."
                  : "Waiting for Knowledge Assist..."
              }
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TechAssistChat;
