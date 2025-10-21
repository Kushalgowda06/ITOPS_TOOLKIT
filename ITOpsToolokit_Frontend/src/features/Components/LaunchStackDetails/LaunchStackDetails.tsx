import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
  selectCommonConfig,
  setAwsDropdowndata,
  setAwsPassDb,
  setAwsSize,
  setAzureLocation,
  // setGcpVm,
  // setGcpCluster,
  // setGcpNetwork,
  setAzureSize,
  setAzureVmlist,
  setCluster,
  setContainer,
  // setGcpDbName,
  // setGcpImage,
  setGcpRegion,
  setDropdownsApi,
  setAwsRegion,
} from "../CommonConfig/commonConfigSlice";
import DynamicForms from "../DynamicForms/DynamicForms";
import testapi from "../../../api/testapi.json";
import { Api } from "../../Utilities/api";
import { FormLoader } from "../../Utilities/FormLoader";

const LaunchStackDetails = () => {
  const params = useParams();
  const apiData = useAppSelector(selectCommonConfig);

  const [isLoading, setIsLoading] = useState(false);
  const [param, setParam] = useState(params);

  useEffect(() => {
    // execute on location change
    setParam(params);
  }, [params]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiEndPoints = [
          "BU",
          "users",
          "Application",
          "costCode",
          "mastersubscriptions",
          "project",
        ];
        const apiPromises = apiEndPoints.map((type) =>
          Api.getData(testapi[type])
        );
        const responses = await Promise.all(apiPromises);
        const responseData = responses.reduce((acc, response, index) => {
          acc[apiEndPoints[index]] = response;
          return acc;
        }, {});
        setDropdownsApi(responseData);
        dispatch(setDropdownsApi(responseData));
      } catch (error) {
        console.error(error);
      }
    };
    // if (apiData.dropdownsApiData.length === 0) {
    fetchData();
    // }
  }, []);
  const [data, setData] = useState({
    Azure: {
      location: null,
      vmlist: null,
      size: null,
      container: null,
      cluster: null,
    },
    AWS: {
      size: null,
      dropdown: null,
      passDb: null,
      region:null,
    },
    GCP: {
      region: null,
      // dbname: null,
      // image: null,
      // network: null,
      // vm: null,
      // cluster: null,
    },
  });

  const fetchData = async () => {
    setIsLoading(true);
    const cloudParam = param.Cloud;
    const fetchDataForCloud = async (cloud, apiCalls) => {
      if (cloudParam === cloud || !cloudParam) {
        const results = await Promise.all(
          apiCalls.map(async (call) => {
            try {
              const response = await Api.getCall(call);
              return response;
            } catch (error) {
              console.error(`Error fetching data for ${call}:`, error);
              alert(`Error fetching data : ${error.message}`);
              // Handle error appropriately, e.g., display an error message to the user
              return null; // Or set a flag to indicate the error
            }
          })
        );

        const processedData = results.map((response, index) =>
          processResponse(response, apiCalls[index])
        ); // Process data as needed
        const cloudData = data[cloud];

        apiCalls.forEach((_, index) => {
          const [key, value] = Object.entries(cloudData)[index];
          cloudData[key] = processedData[index];
        });
      }
    };
    // Fetch data based on cloud.param
    await fetchDataForCloud("Azure", [
      testapi.azure_location_launch,
      testapi.azure_vmlist_launch,
      testapi.azuresizetypes,
      testapi.acrList,
      testapi.clusterdetail,
    ]);
    await fetchDataForCloud("AWS", [
      testapi.awssizetypes,
      testapi.aws_dropdown,
      testapi.aws_dropdown_passdb,
      testapi.aws_region,
    ]);
    await fetchDataForCloud("GCP", [
      testapi.Regions,
      // testapi.Db_Name,
      // testapi.Images,
      // testapi.Networks,
      // testapi.Virtual_Machines,
      // testapi.gcp_cluster,
    ]);

    dispatch(setAzureLocation(data.Azure.location));
    dispatch(setGcpRegion(data.GCP.region));
    // dispatch(setGcpDbName(data.GCP.dbname));
    // dispatch(setGcpImage(data.GCP.image));
    dispatch(setAzureVmlist(data.Azure.vmlist));
    dispatch(setAzureSize(data.Azure.size));
    dispatch(setAwsSize(data.AWS.size));
    dispatch(setAwsDropdowndata(data.AWS.dropdown));
    dispatch(setAwsPassDb(data.AWS.passDb));
    dispatch(setCluster(data.Azure.cluster));
    dispatch(setContainer(data.Azure.container));
    // dispatch(setGcpVm(data.GCP.vm));
    // dispatch(setGcpCluster(data.GCP.cluster));
    // dispatch(setGcpNetwork(data.GCP.network));
    dispatch(setAwsRegion(data.AWS.region))

    setIsLoading(false);
    setData(data);
  };

  function processResponse(response, api) {
    if (api.includes("resourcegrplist")) {
      return response.data.data[0].Locations;
    }
   if (api.includes("list_of_region_zone")) {
      return response.data.map((item) => item.region_name);
    }

     if (
      api.includes("list_of_db_names") ||
      // api.includes("list_of_boot_disk_image") ||
      api.includes("vm-size") ||
      api.includes("cluster-list") ||
      api.includes("machine_types") ||
      api.includes("list_of_virtual_machines") ||
      api.includes("list_of_Kubernetes_clusters")
    ) {
      return response.data;
    }
    if (api.includes("vmlistall")) {
      return response.data.data[0].VirtualMachines;
    }
    if (
      api.includes("paasdb_list_of_resources") ||
      api.includes("existingresources")
    ) {
      return response?.data?.data;
    }
    if (api.includes("acrlist")) {
      return response?.data?.data[0]?.ContainerRegistry;
    }
    if (api.includes("list_of_network_subnets_region")) {
      return Object.keys(response.data);
    }
    if (api.includes("aws_regions")){
      return response?.data?.data
    }

  }

  useEffect(() => {
    // execute on location change
    if (Object.values(data[param.Cloud]).some((value) => value === null)) {
      fetchData();
    }
  }, [param.Cloud]);

  return (
   
      <div className=" h-100 bg-white p-1 mx-2 my-2">
        <h4 className="p-2 ps-3 fw-bold k8title"> {param.launchStack} </h4>
        <div>
          {isLoading ? (
            <FormLoader />
          ) : (
            <DynamicForms
              Cloud={param.Cloud}
              launchStack={param.launchStack}
              apiData={apiData.launchStackData}
            />
          )}
        </div>
      </div>
  );
};

export default LaunchStackDetails;
