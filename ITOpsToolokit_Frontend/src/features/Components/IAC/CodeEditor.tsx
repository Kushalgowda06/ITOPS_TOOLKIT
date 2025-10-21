
import React, { useEffect, useState } from "react";
import { Button, Typography, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import Editor from '@monaco-editor/react';

const CodeEditor = () => {
  const [code, setCode] = useState(`function hello() {\n  console.log("Hello World!");\n}`);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const refreshCode = () => {
    setCode('function hello() {\n  console.log("Hello World!");\n}');
  };
  // console.log("Items",Items)
  return (
    <div className="bg-white rounded-top shadow-lg text-dark custom-rounded me-2" >
      <div className="d-flex align-items-center justify-content-center px-3 py-2 rounded-top background istm_header_height box-shadow text-primary">
        <div  className="m-0 text-sm text-md text-lg text-xl text-xxl text-big fw-bold ">
        Code Editor
        </div>
      </div>

      <Editor
        height="400px"
        defaultLanguage="javascript"
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
      />




         </div>

  );
};

export default CodeEditor;
