import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Autocomplete, TextField, Box } from "@mui/material";
import { Toast } from "react-bootstrap";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";

export type FormData = {
  tenant_id: string;
  client_id: string;
  client_secret: string;
  subscription_id: string;
  resource_group: string;
  Assessment_Project_Name: string;
  group_name: string;
  assessment_name: string;
  ProjectName: string;
  ClientName: string;
};

const projectOptions = ["Azure Migration Project"];
const clientOptions = ["Client ABC"];

const GcpMigrationForm = () => {
  const [activeTab, setActiveTab] = useState<"tab1" | "tab2">("tab1");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      subscription_id: "5ab66322-398c-4751-b098-225402bdf7a3",
      resource_group: "TargetLZRG",
      Assessment_Project_Name: "AzMigrate8430project",
      group_name: "allvms",
      assessment_name: "allvms",
      ProjectName: projectOptions[0],
      ClientName: clientOptions[0],
    },
  });

  const generateId = () => Math.random().toString(36).substring(2, 12);
  
  const downloadFile = (url) => {
    console.log("downloadFile",url)
    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "AzureMigrationOutput.pptx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      setToastMessage("Download URL not found in response.");
    }
  };

  const onSubmit = async (data: FormData) => {
    const payload = {
      OrderID: generateId(),
      PPTStoragePath: "test",
      ...data,
    };

    try {
      setLoading(true);
      setApiResponse(null);
      const response = await axios.post(
        "http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/gcp_migration_assessment",
        payload
      );
      const { az_ppt_path, json_content } = response.data.data;
      setApiResponse(json_content);
      downloadFile(az_ppt_path);
      reset();
    } catch {
      setToastMessage("Form submission failed. Please try again.");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleExcelUpload = async () => {
    if (!selectedFile) {
      setToastMessage("Please upload a valid Excel file.");
      setShowToast(true);
      return;
    }

    const formData = new FormData();
    formData.append("excel_file", selectedFile);
    formData.append("unit", JSON.stringify({ OrderID: generateId() }));

    try {
      setLoading(true);
      setApiResponse(null);
      const response = await axios.post(
        "http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/gcp_migration_assessment/upload-excel/",
        
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("downloadFile",response.data.data,response.data?.excelStoragePath)
      const { excelStoragePath} = response.data;
      // setApiResponse(json_content);
      downloadFile(excelStoragePath);
      setSelectedFile(null);
    } catch {
      setToastMessage("Excel upload failed. Please try again.");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const fields: (keyof FormData)[] = [
    "subscription_id",
    "resource_group",
    "Assessment_Project_Name",
    "group_name",
    "assessment_name",
  ];
  const parsedJSON = JSON.parse(apiResponse);
  const formattedText = formatJSON(parsedJSON);

  function formatJSON(obj, indent = 0) {
    let result = "";
    const spacing = "  ".repeat(indent);
  
    for (let key in obj) {
      const value = obj[key];
      if (typeof value === "object" && value !== null && !Array.isArray(value)) {
        result += `${spacing}${key}:\n`;
        result += formatJSON(value, indent + 1);
      } else if (Array.isArray(value)) {
        result += `${spacing}${key}:\n`;
        value.forEach((item, index) => {
          result += `${spacing}  - Item ${index + 1}:\n`;
          result += formatJSON(item, indent + 2);
        });
      } else {
        result += `${spacing}${key}: ${value}\n`;
      }
    }
  
    return result;
  }
  

  return (
    <div
      className="Azure_mig"
      style={{ margin: "0 auto", padding: "8px 0rem 26px 6px" }}
    >
      <h1
        style={{
          fontSize: 28,
          fontWeight: "bold",
          marginBottom: 0,
          background: "white",
          padding: "12px 0px 22px 47px",
        }}
      >
        GCP Migration Assessment Bot
      </h1>
      <div className="row">
        <div
          className="col-6 bg-white  px-5 chatbot-container "
          style={{ paddingRight: "4px" }}
        >
          <div
             
            >
              <Box sx={{ mt: 4 }}>
                <input
                  type="file"
                  accept=".xls,.xlsx"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
              </Box>
              <button
                onClick={handleExcelUpload}
                disabled={loading}
                style={{
                  backgroundColor: "#2e7d32",
                  color: "#fff",
                  padding: "10px",
                  border: "none",
                  borderRadius: "4px",
                  fontWeight: 500,
                  fontSize: "14px",
                  marginTop: "25px",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? "Generating..." : "Analyze & Generate Report"}
              </button>
            </div>
        </div>
        <div
          className="col-6 tab_content-wrapper"
          style={{ height: "32.5rem" }}
        >
          <h1
            style={{
              fontSize: 14,
              fontWeight: "bold",
              marginBottom: 0,
              background: "white",
              padding: "12px 0px 22px 47px",
            }}
          >
            GenAI Analyzed Report
          </h1>
          <div style={{ padding: "0 16px 12px 16px" }}>
            <textarea
              id="comment"
              className="form-control"
              rows={10}
              style={{ marginTop: "6px", resize: "vertical" }}
              readOnly
              value={formattedText}
            />
          </div>
        </div>
      </div>

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={4000}
        autohide
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          minWidth: "400px",
          backgroundColor: "#f44336",
          color: "#fff",
          padding: "0.75rem 1rem",
          borderRadius: "0.5rem",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          zIndex: 1050,
        }}
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>

      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px 30px",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              textAlign: "center",
              width: "400px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <div className="spinner-border text-success" role="status" />
            </div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>
              Analyze & Generate PPT file
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GcpMigrationForm;