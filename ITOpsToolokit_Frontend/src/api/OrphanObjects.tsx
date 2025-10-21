import apiClient from "./client";

const getOrphanObjects = () => apiClient.get("/orphan_tags/");

const ExportFunction =  {
    getOrphanObjects
};

export default ExportFunction
