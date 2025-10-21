import apiClient from "./client";

const getApplication = () => apiClient.get("/onboard_app/");

const ExportFunction = {
  getApplication
}

export default ExportFunction
