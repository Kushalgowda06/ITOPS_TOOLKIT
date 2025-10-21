import axios from "axios";

const VmDetailsApiClient = axios.create({
  // Later read this URL from an environment variable
  baseURL: "https://vm-details-api.azurewebsites.net/api/http_trigger?code=Vy7xzLFKF6bHsM0E6aAeDkqkjmNzkQ_LJQvPlfGSCitPAzFuhn324A%3D%3D"
});


export default VmDetailsApiClient;
