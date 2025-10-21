import React, { useState, useEffect } from "react";
import ServerDetailsCard from "../RoleBasedAutomation/ServerDetailsCard"
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { faWindowRestore } from "@fortawesome/free-solid-svg-icons";
import VMStatusManagemer from "../../../assets/VMStatusManagemer.png";


export const Windows = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // var data = [];

  // if (cloudData.awsServerData) {
  //   data = [...cloudData.awsServerData];
  // }
  // if (cloudData.azureServerData) {
  //   data = [...data, ...cloudData.azureServerData];
  // }
  // if (cloudData.gcpServerData) {
  //   data = [...data, ...cloudData.gcpServerData];
  // }

  // useEffect(() => {
  //   const username = "ServicenowAPI";
  //   const password = "Qwerty@123";
  //   const options = {
  //       auth: {
  //           username: username,
  //           password: password,
  //       },
  //   };

  //   if(data.length !== 0 ){
  //     dispatch(setAllServerData(data))
  //     }else{
  //       try {

  //         Api.getCallOptions(testjson.awsOsDetails, options ).then((response: any) => {
  //         dispatch(setAwsServerData(response?.data.result))
  //         });
  //       Api.getCallOptions(testjson.azurOsDetails, options).then((response: any) => {
  //         dispatch(setAzureServerData(response?.data.result))
  //         });
  //       Api.getCallOptions(testjson.gcpOsDetails, options).then((response: any) => {
  //         dispatch(setGcpServerData(response?.data.result))
  //         });
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   }
  // },[])


  const [allData, setAllData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 25; // Number of records per page


  const baseURL = 'https://cisicmpengineering1.service-now.com/api/now/table/cmdb_ci_computer';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const offset = (page - 1) * limit; // Calculate offset based on current page
        const username = "ServicenowAPI";
        const password = "Qwerty@123";
        const response = await axios.get(baseURL, {
          params: {
            sysparm_query: 'sysparm_query=cloud_provider%3DAWS^ORcloud_provider%3DAzure^ORcloud_provider%3DGCP',
            // sysparm_display_value: true,
            sysparm_limit: limit,
            sysparm_offset: offset,
          },
          auth: {
            username: username,
            password: password,
          },
        });
        setAllData(response.data.result); // Ensure fallback if no data
        setTotal(response.data.result.length || 0); // Adjust based on your API's response field for total records
      } catch (error) {
        setError('Failed to fetch data. Please try again.');
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const filteredWindows = allData?.filter(os => os.os?.split(' ')[0] === "Windows");

  return (
    <>
      {pathname.includes("Windows") ? (
        <ServerDetailsCard
          title="Windows"
          data={filteredWindows}
          logo={VMStatusManagemer}
          icon={faWindowRestore}
          total={total}
          page={page}
          limit={limit}
          isLoading={isLoading}
          handlePageChange={handlePageChange}
          styles={{
            filter: "drop-shadow(2px 1px 2px black)",
            width: "46px",
            height: "40px",
          }}
        />
      ) : (
        null
      )}
    </>
  );


};
