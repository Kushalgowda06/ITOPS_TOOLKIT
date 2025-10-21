import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextField } from '@mui/material';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export const SocketInput = (props) => {
    //Public API that will echo messages sent to it back to the client
    const [socketUrl, setSocketUrl] = useState(`ws://ec2-99-79-63-59.ca-central-1.compute.amazonaws.com:8006/gen_ai_chat/ws/${props.orderId}`);
    const [messageHistory, setMessageHistory] = useState<MessageEvent<any>[]>([]);
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
    const [file, setFile] = useState(null);


    useEffect(() => {
        console.log(lastMessage, "last Message ooo")
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage));
            props.sendMessageHistory(lastMessage.data)
        }

    }, [lastMessage]);

    // useEffect(()=>{
    //     setSocketUrl(`ws://ec2-99-79-63-59.ca-central-1.compute.amazonaws.com:8006/gen_ai_chat/ws/${orderId.current}`)
    // }, [])

    const handleClickSendMessage = (e) => {
        e.preventDefault()
        props.sendPrompt(prompt)
        sendMessage(prompt)
        setPrompt('')
    }


    const handleFileUpload = (e) => {
        e.preventDefault();
        if (file) {
            const reader: any = new FileReader();
            reader.onload = function () {
                const base64 = reader.result.replace(/.*base64,/, '');
                sendMessage(base64);
            };
            reader.readAsDataURL(file);
            setFile(null);
        }
    };


    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };


    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    const [prompt, setPrompt] = useState("")

    return (
        <div>
            <div className="py-2" >
                <form onSubmit={(e) => {
                    handleFileUpload(e)
                    handleClickSendMessage(e)
                }} className="input-group">
                    <TextField
                        type="text"
                        className="form-control chatbot-input"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your message..."
                        label="Enter your message"
                    />
                    <input type="file" onChange={handleFileChange} />

                    <button
                        onClick={handleFileUpload}
                        className="btn btn-secondary"
                        disabled={!file || connectionStatus !== 'Open'}
                        style={{ height: '36px', marginLeft: '10px' }}
                    />

                        <button onClick={handleClickSendMessage} type="submit" className="btn btn-primary" disabled={prompt === "" || connectionStatus !== "Open"} style={{ height: "36px", marginLeft: "-3px" }} >

                            <FontAwesomeIcon icon={faCircleChevronRight} />

                        </button>
                </form>
            </div>
        </div>
    );
};