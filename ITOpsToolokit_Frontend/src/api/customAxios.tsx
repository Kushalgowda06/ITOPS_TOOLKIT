import axios from "axios";
import testapi from "../api/testapi.json";

const customAxios = axios.create({
  baseURL: testapi.baseURL
});

customAxios.interceptors.response.use(
  response => {
    console.log("Response:", response); // Log the response
    return response;
  },
  error => {
    if (error.response.status === 404) {
      // window.location.href = '/NotFound';
    }else if (error.response && error.response.status === 401) {
      // window.location.href = '/Unauthorized';
    } else {
      // alert(`Error: ${error.response.statusText}`);
    }
    return Promise.reject(error);
  });

const apiClient = axios.create({
  baseURL: testapi.baseURL
});


apiClient.interceptors.response.use(
  response => {
    console.log("Response:", response); // Log the response
    return response;
  },
  error => {
    if (error.response.status === 404) {
      // window.location.href = '/NotFound';
    }else if (error.response && error.response.status === 401) {
      // window.location.href = '/Unauthorized';
    } else {
      // alert(`Error: ${error.response.statusText}`);
    }
    return Promise.reject(error);
  });

const finopsClient = axios.create({
  // Later read this URL from an environment variable
  baseURL: testapi.finopsClientBaseUrl
});

finopsClient.interceptors.response.use(
  response => {
    console.log("Response:", response); // Log the response
    return response;
  },
  error => {
    if (error.response.status === 404) {
      // window.location.href = '/NotFound';
    }else if (error.response && error.response.status === 401) {
      // window.location.href = '/Unauthorized';
    } else {
      // alert(`Error: ${error.response.statusText}`);
    }
    return Promise.reject(error);
  });

const LaunchStackClient = axios.create({
  // Later read this URL from an environment variable
  baseURL: testapi.baseURL
});

LaunchStackClient.interceptors.response.use(
  response => {
    console.log("Response:", response); // Log the response
    return response;
  },
  error => {
    if (error.response.status === 404) {
      // window.location.href = '/NotFound';
    }else if (error.response && error.response.status === 401) {
      // window.location.href = '/Unauthorized';
    } else {
      // alert(`Error: ${error.response.statusText}`);
    }
    return Promise.reject(error);
  });

export { apiClient, finopsClient, LaunchStackClient, customAxios };