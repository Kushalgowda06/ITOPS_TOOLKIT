import React, { useState, useEffect } from "react";
import ServerDetailsCard from "../RoleBasedAutomation/ServerDetailsCard"
import { useLocation } from "react-router-dom";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import VMStatusManagemer from "../../../assets/VMStatusManagemer.png";
import axios from 'axios';
import { Loader } from "../../Utilities/Loader";


export const Linux = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const [allData, setAllData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const limit = 10000; // Number of records per page


  const baseURL = 'https://cisicmpengineering1.service-now.com/api/now/table/cmdb_ci_computer';

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Reset error state before fetching

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

  const filteredLinux = allData?.filter(os => os.os?.split(' ')[0] === "Linux");

  return (
    <>
      {pathname.includes("Linux") ? (
        <ServerDetailsCard
          title="Linux"
          data={filteredLinux}
          logo={VMStatusManagemer}
          icon={faPowerOff}
          total={total}
          isLoading={isLoading}
          page={page}
          limit={limit}
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
