import apiClient from "./client";

const getProject = () => apiClient.get("/project/");

const ExportFunction = {
  getProject,
}

export default ExportFunction
