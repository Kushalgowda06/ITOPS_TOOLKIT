import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export const NewWsComponent = () => {
  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState('ws://ec2-99-79-63-59.ca-central-1.compute.amazonaws.com:8006/gen_ai_chat/ws/1596');
  const [messageHistory, setMessageHistory] =  useState<MessageEvent<any>[]>([]);

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
  }, [lastMessage]);

  const handleClickChangeSocketUrl = useCallback(
    () => setSocketUrl('ws://ec2-3-97-232-96.ca-central-1.compute.amazonaws.com:8006/role_socket_test/ws'),
    []
  );

  const handleClickSendMessage = useCallback(() => sendMessage('Hello'), []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div>
      <button onClick={handleClickChangeSocketUrl}>
        Click Me to change Socket Url
      </button>
      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Click Me to send 'Hello'
      </button>
      <div>The WebSocket is currently {connectionStatus}</div>
      {lastMessage ? <div>Last message: {lastMessage.data}</div> : null}
      <ul>
        {messageHistory.map((message, idx) => (
          <div key={idx}>{message ? message.data : null}</div>
        ))}
      </ul>
    </div>
  );
};