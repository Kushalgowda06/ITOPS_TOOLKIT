import React, { useEffect, useState } from "react";
import Tile from "../Tiles/Tile";
import { TaggingStatus } from "../TaggingStatus/TaggingStatus";
import { CostAnalysis } from "../CostyAnalysis/CostAnalysis";
import ActionStatus from "../ActionStatus/ActionStatus";
import {
  CloudState,
  selectCloud,
  setCloud,
} from "../Cloudtoggle/CloudToggleSlice";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  selectCommonConfig,
  setAdvisoryData,
  setAllVmData,
  setAwsVmData,
  setAzureVmData,
  setCloudData,
  setDropdownsApi,
  setFilteredAdvisoryData,
  setFilteredOrphanData,
  setFilteredTaggingData,
  setGcpVmData,
  setOrphanData,
  setTicketDetailsData,
} from "../CommonConfig/commonConfigSlice";
import { Api } from "../../Utilities/api";
import testapi from "../../../api/testapi.json";
import { filterData } from "../../Utilities/filterData";
import { processAdvisoryData } from "../../Utilities/processAdvisoryData";
import MyRequestAging from "../MyRequestAging/MyRequestAging";
import MasonryCards from "../MasonryCards/MasonryCards";
import GaugeChart from "../GaugeChart/GaugeChart";
import TotalCost from "../FinopsChart/TotalCost";
import ForeCast from "../FinopsChart/ForeCast";
import Budget from "../FinopsChart/Budget";
import MaxDailyCostUsage from "../FinopsChart/MaxDailyCostUsage";
import AvgDailyCostUsage from "../FinopsChart/AvgDailyCostUsage";
import dayjs, { Dayjs } from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import {
  selectFinopsData,
  setAwsDailyUsage,
  setAwsForecast,
  setAzureDailyUsage,
  setAzureForecast,
  setFinopsAwsDailyUsage,
  setFinopsAwsForecast,
  setFinopsAzureDailyUsage,
  setFinopsAzureForecast,
  setFinopsGcpDailyUsage,
  setFinopsGcpForecast,
  setGcpDailyUsage,
  setGcpForecast,
} from "../FinOpsPage/FinOpsDataSlice";
import testjson from "../../../api/testapi.json";
import MiniCard from "../../Utilities/MiniCard";
import awsIcon from "../../../assets/awsIcon.png";
import azureIcon from "../../../assets/azureIcon.png";
import gcpIcon from "../../../assets/gcpIcon.png";
import FinopsCard from "../FinopsChart/FinopsCard";
import FormatNumber from "../../Utilities/FormatNumber";

const LandingPage = () => {
  var processedData;
  const navigate = useNavigate();
  const currentCloud: CloudState = useAppSelector(selectCloud);
  const cloudData = useAppSelector(selectCommonConfig);
  const dispatch = useAppDispatch();
  const finopsSliceData = useAppSelector(selectFinopsData);
  // const [tovalue, settoValue] = React.useState<Dayjs | null>(
  //   dayjs("2024-06-01")
  // );
  // const [fromvalue, setfromValue] = React.useState<Dayjs | null>(
  //   dayjs("2024-06-30")
  // );

  const currentDate = dayjs();
  const oneMonthBefore = currentDate.subtract(1, 'month');
  const [tovalue, settoValue] = React.useState<Dayjs | null>(oneMonthBefore);
  const [fromvalue, setfromValue] = React.useState<Dayjs | null>(currentDate);
  // DashBoards API hit
  useEffect(() => {
    if (cloudData.cloudData.length <= 0) {
      Api.getData(testapi.tagging).then((response: any) => {
        dispatch(setCloudData(response));
        dispatch(setFilteredTaggingData(response));
        if (!currentCloud.currentCloud.length) {
          let filteredCloudData: any = filterData("Cloud", response);
          let availableCLouds = Object.keys(filteredCloudData);
          availableCLouds.length > 0 &&
            dispatch(setCloud(Object.keys(filteredCloudData)));
        }
      });

      // orphan
      Api.getData(testapi.orphan).then((response: any) => {
        dispatch(setOrphanData(response));
        dispatch(setFilteredOrphanData(response));
        if (!currentCloud.currentCloud.length) {
          let filteredCloudData: any = filterData("Cloud", response);
          let availableCLouds = Object.keys(filteredCloudData);
          availableCLouds.length > 0 &&
            dispatch(setCloud(Object.keys(filteredCloudData)));
        }
      });

      // advisory
      Api.getData(testapi.advisory).then((response: any) => {
        const arrayData = response;
        processedData = processAdvisoryData(arrayData);
        dispatch(setAdvisoryData(processedData));
        dispatch(setFilteredAdvisoryData(processedData));
        if (!currentCloud.currentCloud.length) {
          let filteredCloudData: any = filterData("Cloud", processedData);
          let availableCLouds = Object.keys(filteredCloudData);
          availableCLouds.length > 0 &&
            dispatch(setCloud(Object.keys(filteredCloudData)));
        }
      });
    } else {
      if (!currentCloud.currentCloud.length) {
        let filteredCloudData: any = filterData("Cloud", cloudData.cloudData);
        let availableCLouds = Object.keys(filteredCloudData);
        availableCLouds.length > 0 &&
          dispatch(setCloud(Object.keys(filteredCloudData)));
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let filteredCloudData: any = filterData("Cloud", cloudData.cloudData);
    let tempDataStore = [];
    if (Object.keys(filteredCloudData).length) {
      currentCloud.currentCloud.forEach((selectedCloud: any) => {
        tempDataStore.push(...filteredCloudData[selectedCloud]);
      });
    }

    dispatch(setFilteredTaggingData(tempDataStore));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCloud]);

  useEffect(() => {
    let filteredCloudData: any = filterData("Cloud", cloudData.orphanData);
    let tempDataStore = [];
    if (Object.keys(filteredCloudData).length) {
      currentCloud.currentCloud.forEach((selectedCloud: any) => {
        tempDataStore.push(...filteredCloudData[selectedCloud]);
      });
    }

    dispatch(setFilteredOrphanData(tempDataStore));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCloud]);

  useEffect(() => {
    processedData = processAdvisoryData(cloudData.advisoryData);
    let filteredCloudData: any = filterData("Cloud", processedData);
    let tempDataStore = [];

    if (Object.keys(filteredCloudData).length) {
      currentCloud?.currentCloud?.forEach((selectedCloud: any) => {
        if (filteredCloudData[selectedCloud]) {
          tempDataStore.push(...filteredCloudData[selectedCloud]);
        }
      });
    }
    dispatch(setFilteredAdvisoryData(tempDataStore));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCloud]);

  useEffect(() => {
    if (!currentCloud.currentCloud.length) {
      processedData = processAdvisoryData(cloudData.advisoryData);
      let filteredCloudData: any = filterData("Cloud", processedData);
      let availableCLouds = Object.keys(filteredCloudData);
      availableCLouds.length > 0 &&
        dispatch(setCloud(Object.keys(filteredCloudData)));
    }
  });

  // FinOps API hit
  function dateFormatter(value) {
    const date = value.toDate(); // Convert Day.js to Date object
    date.setDate(date.getDate()); // Add one day
    const formattedDate = date.toISOString().slice(0, 10);
    return formattedDate;
  }

  useEffect(() => {
    settoValue(!finopsSliceData.toValue ? tovalue : finopsSliceData.toValue);
    setfromValue(
      !finopsSliceData.fromValue ? fromvalue : finopsSliceData.fromValue
    );
  }, []);

  let requestbody;
  useEffect(() => {
    requestbody = {
      From_Date: dateFormatter(tovalue),
      To_Date: dateFormatter(fromvalue),
    };
  }, [tovalue, fromvalue, finopsSliceData.finopsToken]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        Api.postFinopsData(
          testapi.awsdailyusage,
          requestbody,
          finopsSliceData.finopsToken
        ).then((response: any) => {
          dispatch(setFinopsAwsDailyUsage(response?.data?.data));
          dispatch(setAwsDailyUsage(response?.data?.data));
        });
        Api.postFinopsData(
          testapi.azuredailyusage,
          requestbody,
          finopsSliceData.finopsToken
        ).then((response: any) => {
          dispatch(setFinopsAzureDailyUsage(response?.data?.data));
          dispatch(setAzureDailyUsage(response?.data?.data));
        });
      //   Api.getCall(`https://us-central1-cis-icmp-engineering-v.cloudfunctions.net/gcp_daily_usage_test?From_Date=${dateFormatter(tovalue)}&To_Date=${dateFormatter(fromvalue)}`)
      //  .then((response: any) => {
      //   console.log(response,"test")
      //     dispatch(setFinopsGcpDailyUsage(response?.data));
      //     dispatch(setGcpDailyUsage(response?.data));
      //   });
      //   console.log(finopsSliceData?.gcpDailyUsage,"gcp test")
        Api.postFinopsData(
          testapi.gcpdailyusage,
          requestbody,
          finopsSliceData.finopsToken
        ).then((response: any) => {
          dispatch(setFinopsGcpDailyUsage(response?.data?.data));
          dispatch(setGcpDailyUsage(response?.data?.data));
        });
        Api.postFinopsData(
          testapi.awsforecast,
          requestbody,
          finopsSliceData.finopsToken
        ).then((response: any) => {
          dispatch(setAwsForecast(response?.data?.data));
          dispatch(setFinopsAwsForecast(response?.data?.data));
        });
        Api.postFinopsData(
          testapi.azureforecast,
          requestbody,
          finopsSliceData.finopsToken
        ).then((response: any) => {
          dispatch(setAzureForecast(response?.data?.data));
          dispatch(setFinopsAzureForecast(response?.data?.data));
        });
        Api.postFinopsData(
          testapi.gcpforecast,
          requestbody,
          finopsSliceData.finopsToken
        ).then((response: any) => {
          dispatch(setGcpForecast(response?.data?.data));
          dispatch(setFinopsGcpForecast(response?.data?.data));
        });
      } catch (error) {
        console.error("Error fetching FinOps data:", error);
      }
    };
    fetchData();
  }, [finopsSliceData.finopsToken, tovalue, fromvalue]);

  // Cloud Operations API hit
  useEffect(() => {
    const fetchData = () => {
      try {
        Api.getCall(testjson.awsvmdetails).then((response: any) => {
          // setAwsVmDetailsData(response?.data)
          dispatch(setAwsVmData(response?.data));
        });
        Api.getCall(testjson.azurevmdetail).then((response: any) => {
          dispatch(setAzureVmData(response?.data?.data));
        });
        Api.getCall(testjson.gcpvmdetail).then((response: any) => {
          dispatch(setGcpVmData(response?.data));
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  var AllVmsData = [];

  if (cloudData.awsVmData) {
    AllVmsData = [...cloudData.awsVmData];
  }
  if (cloudData.azureVmData) {
    AllVmsData = [...AllVmsData, ...cloudData.azureVmData];
  }
  if (cloudData.gcpVmData) {
    AllVmsData = [...AllVmsData, ...cloudData.gcpVmData];
  }

  useEffect(() => {
    if (AllVmsData) {
      dispatch(setAllVmData(AllVmsData));
    }
  }, []);

// Function to process data and calculate counts for each cloud and total across all clouds
function processData(data) {
  const countsPerCloud = {};
  let totalCounts = { totalInstances: 0, running: 0, stopped: 0 };

    data.forEach((item) => {
      const cloud = item.Cloud;
      if (!countsPerCloud[cloud]) {
        countsPerCloud[cloud] = { totalInstances: 0, running: 0, stopped: 0 };
      }
      countsPerCloud[cloud].totalInstances += 1;
      if (item.State === "running") {
        countsPerCloud[cloud].running += 1;
      } else if (item.State === "stopped") {
        countsPerCloud[cloud].stopped += 1;
      }

      // Update total counts
      totalCounts.totalInstances += 1;
      if (item.State === "running") {
        totalCounts.running += 1;
      } else if (item.State === "stopped") {
        totalCounts.stopped += 1;
      }
    });

  // Return both per-cloud counts and total counts
  return { countsPerCloud, totalCounts };
}

// Process data
const { countsPerCloud, totalCounts } = processData(AllVmsData);

if(finopsSliceData.finOpsTotalCost){
  var totalAws = finopsSliceData.finOpsTotalCost["totalAws"];
  var totalAzure = finopsSliceData.finOpsTotalCost["totalAzure"]
  var totalGcp = finopsSliceData.finOpsTotalCost["totalGcp"] 
}
// getcall for bu ,app ,cost 
useEffect(() => {
  const fetchData = async () => {
    try {
      const apiEndPoints = ["BU", "users", "Application", "costCode","mastersubscriptions","project"];
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
  if (cloudData.dropdownsApiData.length === 0) {
    fetchData();
  }
},[])

  if (finopsSliceData.finOpsTotalCost) {
    var totalAws = finopsSliceData.finOpsTotalCost["totalAws"];
    var totalAzure = finopsSliceData.finOpsTotalCost["totalAzure"];
    var totalGcp = finopsSliceData.finOpsTotalCost["totalGcp"];
  }
  // getcall for bu ,app ,cost
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const apiEndPoints = [
  //         "BU",
  //         "users",
  //         "Application",
  //         "costCode",
  //         "mastersubscriptions",
  //         "project",
  //       ];
  //       const apiPromises = apiEndPoints.map((type) =>
  //         Api.getData(testapi[type])
  //       );
  //       const responses = await Promise.all(apiPromises);
  //       const responseData = responses.reduce((acc, response, index) => {
  //         acc[apiEndPoints[index]] = response;
  //         return acc;
  //       }, {});
  //       setDropdownsApi(responseData);
  //       dispatch(setDropdownsApi(responseData));
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   if (cloudData.dropdownsApiData.length === 0) {
  //     fetchData();
  //   }
  // }, []);

  return (
    <>
      <div className="mx-3 my-2">
        <div
          className="row col-row my-1 bg-white"
          onClick={() => {
            navigate({ pathname: "/FinopsDashboard" });
          }}
        >
          {/* <small className=' d-flex fw-bold d-inline pb-1'>FinOps Cost Utilization</small> */}
          <div className="col-lg-2 col-xxl-2 col-md-4 card-width gx-2 border-5">
            <TotalCost />
          </div>
          <div className="col-lg-2 col-xxl-2 col-md-4 card-width gx-2">
            <ForeCast />
          </div>
          <div className="col-lg-2 col-xxl-2 col-md-4 card-width gx-2">
            <Budget />
          </div>
          <div className="col-lg-2 col-xxl-2 col-md-4 mt_md_2  card-width1 gx-2">
            <MaxDailyCostUsage />
          </div>
          <div className="col-lg-2 col-xxl-2 col-md-4 mt_md_2 card-width2 gx-2">
            <AvgDailyCostUsage
              To_date={dateFormatter(tovalue)}
              From_date={dateFormatter(fromvalue)}
            />
          </div>
          <div className="col-lg-2 col-xxl-2 col-md-4  mt_md_2 card-width  gx-2">
            <FinopsCard title = {"Cost Saved"} count ={FormatNumber(cloudData.OrphanDeletedCost + cloudData.AdvisoryCost)}/>

          </div>
        </div>
        <div className="row bg-light">
          <div
            className="col-lg-3 col-md-6 col-xs-12 col-xl-3  col-sm-6 cursor-pointer col-row-1 gx-1"
            onClick={() => {
              navigate({ pathname: "/tagging-policy" });
            }}
          >
            <Tile>
              <TaggingStatus />
            </Tile>
          </div>
          <div
            className="col-lg-3 col-md-6 col-xs-12 col-xl-3 col-sm-6  cursor-pointer col-row-1 gx-1"
            onClick={() => {
              navigate({ pathname: "/orphan-objects" });
            }}
          >
            <Tile className="container card">
              <CostAnalysis />
            </Tile>
          </div>
          <div
            className="col-lg-3 col-md-6 col-xs-12 col-xl-3 col-sm-6 cursor-pointer col-row-1 mt-md-1 gx-1"
            onClick={() => {
              navigate({ pathname: "/cloud-advisory" });
            }}
          >
            <Tile>
              <ActionStatus />
            </Tile>
          </div>
          <div className="col-lg-3 col-md-6 col-xs-12  col-sm-6  col-xl-3 col-row-1 mt-md-1 gx-1">
            <Tile>
              <GaugeChart
                actualBudget={finopsSliceData.finOpsBudget["totalCloudBudget"]}
                totalBudget={finopsSliceData.finOpsTotalCost["totalCloud"]}
              />
            </Tile>
          </div>
        </div>
        <div
          className="row col-row mt-1 bg-light"
          onClick={() => {
            navigate({ pathname: "/Cloud-operations" });
          }}
        >
          {/* <small className=' d-flex fw-bold d-inline pb-1'>Virtual Machine instances</small> */}
          <Tile>
    <div className="row">
          <div className="col-lg-3 col-sm-6">
            <MiniCard
              images={[awsIcon, azureIcon, gcpIcon]}
              imgClasses={["h-50 w-50 p-1 "]}
              CardContentClass="border-start border-top border-bottom border-primary"
              TotalCost={totalAws + totalAzure + totalGcp}
              counts={totalCounts}
            />
            </div>
            <div className="col-lg-3 col-sm-6">
            <MiniCard
              images={[awsIcon]}
              imgClasses={["h-100 w-100 pt-3 "]}
              CardContentClass="border-bottom border-top  border-warning "
              TotalCost={totalAws}
              counts={countsPerCloud["AWS"]}
            />
            </div>
             <div className="col-lg-3 col-sm-6">
            <MiniCard
              images={[azureIcon]}
              CardContentClass="border-top border-bottom border-info"
              TotalCost={totalAzure}
              counts={countsPerCloud["Azure"]}
            />
            </div>
              <div className="col-lg-3 col-sm-6">
            <MiniCard
              images={[gcpIcon]}
              imgClasses={["h-100 w-100 "]}
              CardContentClass="border-top border-bottom border-end border-success"
              TotalCost={totalGcp}
              counts={countsPerCloud["GCP"]}
            />
            </div>
            </div>
          </Tile>
        </div>
        <div className="row col-row mt-1">
          <div className="col-8 gx-1 h-50">
            <div className="h-100 bg-white p-2">
              <MasonryCards />
            </div>
          </div>
          <div className="col-4 gx-1">
            <Tile>
              <MyRequestAging />
            </Tile>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
