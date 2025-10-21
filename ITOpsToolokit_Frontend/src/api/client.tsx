import axios from "axios";
import testapi from "../api/testapi.json";

const apiClient = axios.create({
  // Later read this URL from an environment variable
  baseURL: testapi.baseURL
});

export default apiClient;
