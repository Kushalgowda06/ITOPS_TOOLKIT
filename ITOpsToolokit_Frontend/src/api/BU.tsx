import apiClient from "./client";

const getBU = () => apiClient.get("/bu/");

const ExportFunction = {
  getBU
}

export default ExportFunction
