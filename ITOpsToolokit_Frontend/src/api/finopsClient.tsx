import axios from "axios";
import testapi from '../api/testapi.json'

const finopsClient = axios.create({
  // Later read this URL from an environment variable
  baseURL: testapi.finopsClientBaseUrl
});

export default finopsClient;