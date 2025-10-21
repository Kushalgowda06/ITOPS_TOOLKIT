import client from "./client";
// import apiClient from '../'

const getReports = () => client.get("/reports/");

const ExportFunction = {
    getReports
}

export default ExportFunction
