import React, { useState } from 'react';
import { Container, InputGroup, FormControl, Button } from 'react-bootstrap';
import SendIcon from '@mui/icons-material/Send'; 

const TeachAssistInput = ({ onSend, placeholder }) => {
  const [message, setMessage] = useState("");

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();  
      handleSubmit();
    }
  };

  return (
    <div className="d-flex pb-2 flex-column bg_color"> 
      <div className="d-flex flex-grow-1 align-items-center justify-content-center input_width">
        <div className="input-group-container w-100">
          <InputGroup className="input_shadow rounded-3 border">  
            <FormControl
              placeholder={placeholder}
              aria-label="Service Status"
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}  
              className="border-0 bg-transparent text-white ps-4 pe-2 py-3 chat_input rounded-3"
            />
            <Button
              onClick={handleSubmit}
              className="rounded-circle zoom d-flex align-items-center justify-content-center"  
            >
              <SendIcon className="send_icon" />
            </Button>
          </InputGroup>
        </div>
      </div>
    </div>
  );
};

export default TeachAssistInput;
