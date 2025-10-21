import apiClient from "./client";

const getRole = () => apiClient.get("/roles/");

const ExportFunction = {
  getRole
}

export default ExportFunction
