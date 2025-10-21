import apiClient from "./client";

const getUser = () => apiClient.get("/users/");

const ExportFunction = {
  getUser
}

export default ExportFunction
