import React, { useState, useRef, useEffect } from "react";
import { IoIosAttach, IoIosDownload, IoMdAttach } from "react-icons/io";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Loader } from "../../Utilities/Loader";
import { wrapIcon } from "../../Utilities/WrapIcons";

const AzureChatInput: React.FC<any> = (props) => {

  const IoIosDownloadIcon = wrapIcon(IoIosDownload);
  const IoMdAttachIcon = wrapIcon(IoMdAttach);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadButton, setDownloadButton] = useState(true)

  const [socketUrl, setSocketUrl] = useState(`ws://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/gen_ai_az_migrate_chatbot/ws/${props.orderId}`);
  const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);
  // const [file, setFile] = useState(null);

  // Cleanup the object URL when file changes
  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setImagePreviewUrl(null);
    }
  }, [file]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const [listSocketResponses, setListSocketResponses] = useState([]);

  console.log("listSocketResponses", listSocketResponses)
  // Triggered every time a new message arrives from the WebSocket
  useEffect(() => {
    if (lastMessage) {

      props.sendMessageHistory(lastMessage.data);
    }
  }, [lastMessage]);

  console.log("listSocketResponses ,pppp ", listSocketResponses)

  // Processes all messages in the queue, one by one
  // const processQueuedMessages = async () => {
  //   if (isProcessingRef.current || messageQueueRef.current.length === 0) return;

  //   isProcessingRef.current = true;

  //   while (messageQueueRef.current.length > 0) {
  //     const message = messageQueueRef.current.shift();

  //     if (message && message.data?.includes('{')) {
  //       console.log('Parsed msg 👇', JSON.parse(message.data));

  //       const temp = JSON.parse(message.data);

  //       if (temp?.content?.sender === "QuestionBot") {
  //         console.log(temp?.content?.content, '← valid bot message');

  //         await props.sendMessageHistory(temp?.content?.content);
  //       }
  //     }
  //   }

  //   isProcessingRef.current = false;
  // };




  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {
    console.log(connectionStatus, "ee")
    if (connectionStatus == 'Closed') {
      setIsLoading(false)
      setDownloadButton(false)
    }
  }, [connectionStatus])


  // useEffect(() => {
  //   // console.log( JSON.parse( `${lastMessage?.data}`) , "last Message ooo")
  //   if (props.orderId !== 0) {
  //     sendMessage(props.orderId)
  //   }

  // }, [props.orderId]);

  // const handleSend = () => {
  //   if (message.trim() || file) {
  //     onSend(message.trim(), file ?? undefined);
  //     setMessage("");
  //     setFile(null);
  //     setImagePreviewUrl(null);
  //   }
  // };

  const handleClickSendMessage = (e) => {
    e.preventDefault()

    if (message.length > 0) {
      props.sendPrompt(message)
      sendMessage(message)
    } else {
      return
    }
    if (message == "exit") {
      setIsLoading(true)
    }
    setMessage('')


    // e.preventDefault();
    if (file) {
      const reader: any = new FileReader();
      reader.onload = function () {
        const base64 = reader.result.replace(/.*base64,/, '');
        sendMessage(base64);
      };
      reader.readAsDataURL(file);
      setFile(null);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length > 0) {
      setFile(event.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className="card w-100 p-1"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <Loader isLoading={isLoading} load={null} />

      {imagePreviewUrl && (
        <div className="mb-2 image-preview d-flex align-items-center">
          <img
            src={imagePreviewUrl}
            alt="Preview"
            style={{ maxWidth: "150px", maxHeight: "150px", borderRadius: "5px" }}
            className="me-2 border"
          />
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => {
              setFile(null);
              setImagePreviewUrl(null);
            }}
          >
            Remove
          </button>
        </div>
      )}

      <form onSubmit={handleClickSendMessage} className="input-group">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message AI..."
          className="form-control f-size"

        />

        <input
          type="file"
          ref={fileInputRef}
          className="d-none"
          onChange={handleFileChange}
          // Accept all files; if you want only images use: accept="image/*"
          accept="image/*"
        />

        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={() => props.handleDownload()}
          disabled={downloadButton}
        >
          <IoIosDownloadIcon style={{ fontSize: '1.3rem' }} />
        </button>

        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          <IoMdAttachIcon style={{ fontSize: '1rem' }} />
        </button>

        <button className="btn btn-primary" type="submit" >
          ➤
        </button>
      </form>
    </div>
  );
};

export default AzureChatInput;