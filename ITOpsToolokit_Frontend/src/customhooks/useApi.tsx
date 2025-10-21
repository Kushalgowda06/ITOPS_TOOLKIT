import { useState } from "react";
import {customAxios} from '../api/customAxios'

const useApi = (apiFunc: (axiosInstance: typeof customAxios, ...args: any) => any) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const request = async (...args: any) => {
    const typedArgs: [] = args;
    setLoading(true);
    try {
      const result = await apiFunc(customAxios, ...typedArgs);
      setData(result.data);
    } catch (err: any) {
      setError(err.message || "Unexpected Error!");
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    error,
    loading,
    request
  };
};

export default useApi
