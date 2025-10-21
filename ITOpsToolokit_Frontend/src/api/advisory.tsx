import apiClient from "./client";

const getAdvisory = () => apiClient.get("/advisory_tags/");

const ExportFunction = {
  getAdvisory,
};

export default ExportFunction;
