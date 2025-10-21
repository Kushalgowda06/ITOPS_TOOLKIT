import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { Modal } from 'react-bootstrap'
import { Loader } from '../../Utilities/Loader'
import AzureChatInput from '../Chatbot_Genai/AzureChatInput'
import ChatInput from '../Chatbot_Genai/ChatInput'

const AzureMigrate = () => {
  const [orderID, setOrderID] = useState(0)
  const [socketResponses, setSocketResponses] = useState([])
  const [promptHistory, setPrompthistory] = useState([])
  const [chatArray, setChatArray] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [files, setFiles] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [uploadResults, setUploadResults] = useState<string[]>([]);
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('error');



  useEffect(() => {
    setOrderID(Date.now())
  }, [])


  useEffect(() => {
    // setIsLoading(true)
    let result = []
    for (var i = 0; i < socketResponses.length; i++) {
      result.push(socketResponses[i]);
      result.push(promptHistory[i]);
    }
    console.log(result, "result ooooo")
    setChatArray(result)
    // setIsLoading(false)


  }, [socketResponses, promptHistory])

  useEffect(() => {
    endOfMessages.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatArray])

  useEffect(() => {
    if (chatArray.length == 0) {
      setIsLoading(true)
    } else {
      setIsLoading(false)

    }
  })


  // const HighlightQuestion = (text) => {
  const HighlightQuestion = (text: string) => {

    console.log(text, "text")
    // Regex to capture the question after \Q: or **\Q:
    const questionRegex = /[\n\\]?\*?\*?Q\*?\*?:\s*(.*?)(?:\\n|\n|$)/i;
    const match = text.match(questionRegex);

    if (match) {
      const question = match[1].trim();
      const parts = text.split(match[0]);

      return (
        <div className="d-flex row ">
          <div>{parts[0]}</div>
          <div><strong>{question}</strong></div>
          <div>{parts[1]}</div>
        </div>
      );
    } else {
      return <>{text}</>
    }
  }

  // };


  const chatMarkup = () => {
    return <>{
      chatArray.map((curr, index) => {
        if (curr && index != chatArray.length - 1) {
          return <div className={`d-flex ${index % 2 === 0 ? 'justify-content-start' : 'justify-content-end'}`}>
            <div className="d-flex flex-row w-50 user-input rounded bg-light p-2 mb-3 role_fnt">
              <p className="text-start f-size">
                {HighlightQuestion(curr)}
              </p>
            </div>
          </div>
        } else if (curr) {
          return <div className={`d-flex ${index % 2 === 0 ? 'justify-content-start' : 'justify-content-end'}`}>
            <div className="d-flex flex-row w-50 user-input rounded bg-light p-2 mb-3 role_fnt">
              <p className="text-start f-size"> {curr}</p>
              {/* <Typewriter text={curr} speed={20} /> */}
            </div>
          </div>
        }
      })}
    </>
  }

  useEffect(() => {

    setOrderID(Date.now())

    if (chatArray.length == 0) {
      setIsLoading(true)
    } else {
      setIsLoading(false)

    }
  }, [])

  const handleSendPrompt = (prompt) => {
    let temp = [...promptHistory];
    temp.push(prompt)
    setPrompthistory(temp)
  }

  const handlePromptResponse = (response) => {
    console.log()
    let temp = [...socketResponses];
    temp.push(response)
    console.log(response, "response iii")
    setSocketResponses(temp)
  }

  const [ReRender, setReRender] = useState(false)
  useEffect(() => {
    setReRender(!ReRender)
  }, [socketResponses])

  const handleDownload = async () => {
    try {
      // The 'orderID' variable needs to be defined in the component's scope for this to work.
      // Step 1: Hit the API with POST request and order ID
      const response = await axios.post('http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/azure_migration_chatbot/all', { OrderID: `${orderID}` });

      const blobUrls = response?.data?.data

      if (!blobUrls || !Array.isArray(blobUrls) || blobUrls.length === 0) {
        throw new Error("Download URLs not found in response");
      }

      // Step 2 & 3: Iterate through URLs and download each file sequentially
      for (const [index, fileUrl] of blobUrls.entries()) {
        try {
          const fileResponse = await axios.get(fileUrl, {
            responseType: "blob", // Very important for file downloading
          });

          const blob = new Blob([fileResponse.data]);
          const downloadUrl = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          const fileName = fileUrl.split('/').pop();
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(downloadUrl);
        } catch (downloadError) {
          console.error(`Failed to download file from ${fileUrl}`, downloadError);
          // You could add user feedback here, e.g., using a toast notification.
        }
      }
    } catch (error) {
      console.error("Error downloading files:", error);
    }
  };

  useEffect(() => {

  }, [socketResponses,])

  const endOfMessages = useRef(null)

  const handleExcelUpload = async () => {
    if (selectedFiles.length === 0) {
      setToastVariant('error');
      setToastMessage("Please select one or more Excel files.");
      setShowToast(true);
      return;
    }

    setIsLoading(true);
    setUploadResults([]);

    const uploadPromises = selectedFiles.map(file => {
      const formData = new FormData();
      formData.append("excel_files", file);
      return axios.post(
        "http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/azure_migration_chatbot/upload-excel/",
        formData,
      ).then(response => ({
        fileName: file.name,
        status: 'success',
        data: response.data
      }));
    });

    const results = await Promise.allSettled(uploadPromises);

    const resultMessages = results.map((result, index) => {
      const fileName = selectedFiles[index]?.name || `File ${index + 1}`;
      if (result.status === 'fulfilled') {
        console.log(`Upload successful for ${fileName}:`, result.value.data);
        return `${fileName}: Upload successful!`;
      } else {
        // result.reason is the error
        const error = result.reason;
        let errorMessage = "Upload failed.";
        if (axios.isAxiosError(error) && error.response) {
          const serverError = error.response.data?.detail || JSON.stringify(error.response.data);
          errorMessage = `Upload failed: ${error.response.statusText} (Status ${error.response.status}). ${serverError}`;
        } else if (error instanceof Error) {
          errorMessage = `An error occurred: ${error.message}`;
        }
        console.error(`Upload failed for ${fileName}:`, error);
        return `${fileName}: ${errorMessage}`;
      }
    });

    setUploadResults(resultMessages);
    setToastVariant('success');
    setToastMessage("All uploads processed. See results below.");
    setShowToast(true);
    setSelectedFiles([]); // Clear selection after upload
    setIsLoading(false);
  };
  return <>
    <Loader isLoading={isLoading} load={null} />

    <div className="bg_color container-fluid d-flex justify-content-center align-items-center py-3 mt-2 ">
      <div className="px-5 py-2 justify-content-center w-20">

        <div className="fw-bolder fs-3 k8title pb-5 ">Azure Migrate Application Intake Form</div>
        <div>
          <div
            className="p-1 bg-white gradient-border  gradient-background text-primary h-25"
            onClick={() => {
              setUploadModal(true)
            }}
          >  <div className="d-flex justify-content-center align-items-center ">
              <span className="px-1 fw-bold stack_p">Upload </span>
            </div>
          </div>
        </div>
      </div>
      <div className="chatbot-container rounded w-100">
        <div className="row justify-content-center">
          {/* Chat Area */}
          <div className="col-md-9 mb-1">
            <div className="card shadow" style={{ height: "70vh", borderRadius: "initial" }}>
              <div className="card-body d-flex flex-column h-100">
                <div className="w-100 overflow-auto">
                  {chatMarkup()}
                  <div ref={endOfMessages} ></div>
                </div>
              </div>
            </div>
            {orderID !== 0 && <AzureChatInput className="w-100" orderId={orderID} handleDownload={handleDownload} sendPrompt={handleSendPrompt} sendMessageHistory={handlePromptResponse} />}
          </div>
          {/* Parameter Area */}

        </div>
        <div>
        </div>
      </div>

      <Modal show={uploadModal} centered onHide={() => {
        setUploadModal(false)
        setUploadResults([])
      }}>
        <Modal.Body>
          <div className="px-4 stack_p">
            <p>
              Upload your customized Files here
            </p>
          </div>
          <div className="d-flex justify-content-center">
            <input
              type="file"
              accept=".xls,.xlsx"
              multiple
              onChange={(e) => setSelectedFiles(e.target.files ? Array.from(e.target.files) : [])}
            />
            <button
              type="button"
              className="p-2 bg-white gradient-border  gradient-background text-primary"
            // onClick={exportData}
            >
              <div className="d-flex justify-content-center align-items-center " onClick={handleExcelUpload}>
                <span className="px-3 fw-bold stack_p">Upload File</span>
              </div>
            </button>
          </div>

          {uploadResults.length > 0 && (
            <div className="mt-3 text-center px-4 stack_p">
              <h6>Upload Results:</h6>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                {uploadResults.map((result, index) => (
                  <li key={index} style={{ color: result.includes('failed') || result.includes('error') ? '#dc3545' : '#28a745' }}><p className='treeview-p'>{result}</p></li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  </>
}

export default AzureMigrate