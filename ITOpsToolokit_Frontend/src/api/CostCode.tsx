import apiClient from "./client";

const getCostCode = () => apiClient.get("/cost_codes/");

const ExportFunction = {
  getCostCode
}

export default ExportFunction
