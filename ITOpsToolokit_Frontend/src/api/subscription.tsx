// import client from "./client";
import {apiClient} from '../api/customAxios'

const getSubscription = () => apiClient.get("/mastersubscriptions/");

const ExportFunction = {
    getSubscription
}

export default ExportFunction
