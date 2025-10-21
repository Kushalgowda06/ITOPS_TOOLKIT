import ResourceGroup from "../FinopsChart/ResourceGroup";
import ActualBudgetForecastChart from "../FinopsChart/ActualBudgetForecastChart";
import CostUsageChart from "../FinopsChart/CostUsageChart";
import Top10CostChart from "../FinopsChart/Top10CostChart";
import Top10DailyUsageChart from "../FinopsChart/Top10DailyUsageChart";
import Tile from "../Tiles/Tile";
import Top10Application from "../FinopsChart/Top10Application";
import TotalCost from "../FinopsChart/TotalCost";
import ForeCast from "../FinopsChart/ForeCast";
import Budget from "../FinopsChart/Budget";
import MaxDailyCostUsage from "../FinopsChart/MaxDailyCostUsage";
import AvgDailyCostUsage from "../FinopsChart/AvgDailyCostUsage";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Card } from "react-bootstrap";
import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import { VscFilter } from "react-icons/vsc";
import {
  selectFinopsData,
  setAzureDailyUsage,
  setAwsDailyUsage,
  setGcpDailyUsage,
  setFinopsAwsDailyUsage,
  setFinopsAzureDailyUsage,
  setFinopsGcpDailyUsage,
  setAwsForecast,
  setAzureForecast,
  setGcpForecast,
  setFinopsAwsForecast,
  setFinopsAzureForecast,
  setFinopsGcpForecast,
  setFromValue,
  setToValue
} from "./FinOpsDataSlice";
import { Api } from "../../Utilities/api";
import testapi from "../../../api/testapi.json";
import { useLocation } from "react-router-dom";
import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import FinOpsTable from "./FinOpsTable";
import { filterData } from "../../Utilities/filterData";
import FilterCustomAutoComplete from "../../Utilities/FilterCustomAutoComplete";
import Top10BU from "../FinopsChart/Top10BU";
import FinopsCard from "../FinopsChart/FinopsCard";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import FormatNumber from "../../Utilities/FormatNumber";
import { wrapIcon } from "../../Utilities/WrapIcons";


const FinOpsPage = () => {
  const finopsSliceData = useAppSelector(selectFinopsData);
  const cloudData = useAppSelector(selectCommonConfig);
  const VscFilterIcon = wrapIcon(VscFilter);

  const dispatch = useAppDispatch();
  const location = useLocation();
  const pathname = location.pathname;
  const [getTokenValue, setTokenValue]: any = useState([]);
  const ref = React.useRef(null);

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

  function dateFormatter(value) {
    const date = value.toDate(); // Convert Day.js to Date object
    date.setDate(date.getDate()); // Add one day
    const formattedDate = date.toISOString().slice(0, 10);
    return formattedDate;
  }

  const [showTop10App, setShowTop10App] = useState(false);


  useEffect(() => {
    setTimeout(() => setShowTop10App(true), 8000); // Delay by 5 seconds
  }, []);
  let requestbody;
  useEffect(() => {
    requestbody = {
      From_Date: dateFormatter(tovalue),
      To_Date: dateFormatter(fromvalue),
    };
    dispatch(setToValue(tovalue))
    dispatch(setFromValue(fromvalue))
    setShowTop10App(false);
    setTimeout(() => setShowTop10App(true), 8000); // Delay by 5 seconds
  }, [tovalue, fromvalue]);
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
          console.log(response?.data?.data, "test azure")
          dispatch(setFinopsAzureDailyUsage(response?.data?.data));
          dispatch(setAzureDailyUsage(response?.data?.data));
        });
        // Api.getCall(`https://us-central1-cis-icmp-engineering-v.cloudfunctions.net/gcp_daily_usage_test?From_Date=${dateFormatter(tovalue)}&To_Date=${dateFormatter(fromvalue)}`)
        // .then((response: any) => {
        //  console.log(response,"test")
        //    dispatch(setFinopsGcpDailyUsage(response?.data));
        //    dispatch(setGcpDailyUsage(response?.data));
        //  });
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
  // filtering logic
  const finopsdata = [
    ...finopsSliceData.finopsawsDailyUsage,
    ...finopsSliceData.finopsazureDailyUsage,
    ...finopsSliceData.finopsgcpDailyUsage,
  ];
  const finopsforecastdata = [
    ...finopsSliceData.finopsawsForecast,
    ...finopsSliceData.finopsazureForecast,
    ...finopsSliceData.finopsgcpForecast,
  ];

  const [Appdata, setAppData] = useState([]);
  const [Clouddata, setCloudData] = useState([]);
  const [Budata, setBuData] = useState([]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      var classlist = event.target.className;
      const cls = [
        "Mui-focused",
        "ps-2",
        "cursor-pointer",
        "PrivateSwitchBase-input",
        "MuiAutocomplete-listbox",
        "MuiPickersCalendarHeader-root",
        "MuiPickersSlideTransition-root",
        "MuiPickersYear-yearButton",
        "MuiDayCalendar-weekContainer",
        "MuiDateCalendar-root",
        "MuiTypography-root",
        "MuiDayCalendar-weekContainer",
        "MuiButtonBase-root",
        "MuiDayCalendar-header",
        "base-Popper-root",
        "MuiPickersCalendarHeader-label",
      ];

      const clsNamecheck = cls.some((i) => classlist.includes(i));

      if (ref.current && !ref.current.contains(event.target) && !clsNamecheck) {
        setShowDropdowns(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const handleFilterData = (newValue, str) => {
    if (str === "cloud") setCloudData(newValue);
    if (str === "bu") setBuData(newValue);
    if (str === "app") setAppData(newValue);
  };
  const filteredFinopsData = React.useMemo(() => {
    // Apply filters if cloudData, buData, or appData have values
    if (Clouddata.length || Budata.length || Appdata.length) {
      return finopsdata.filter((item: any) => {
        const matchesCloud =
          Clouddata.length === 0 || Clouddata.includes(item.Cloud); // Match cloud if no filter or exact match
        const matchesBu =
          Budata.length === 0 || Budata.includes(item.BusinessUnit); // Match BU if no filter or exact match
        const matchesApp =
          Appdata.length === 0 || Appdata.includes(item.Application); // Match app if no filter or exact match
        return matchesCloud && matchesBu && matchesApp;
      });
    }
    // No filters applied, return original data
    return finopsdata;
  }, [finopsdata, Clouddata, Budata, Appdata]);

  const Cloudoptions = React.useMemo(() => {
    // Apply filters if cloudData, buData, or appData have values
    if (Clouddata.length) {
      return finopsdata.filter((item: any) => {
        const matchesCloud =
          Clouddata.length === 0 || Clouddata.includes(item.Cloud); // Match cloud if no filter or exact match
        return matchesCloud;
      });
    }
    // No filters applied, return original data
    return finopsdata;
  }, [finopsdata, Clouddata]);
  let forecastfilter = [];
  useEffect(() => {
    forecastfilter = finopsforecastdata.filter((item: any) =>
      Clouddata.includes(item.Cloud)
    );
  }, [Clouddata]);

  useEffect(() => {
    if (Clouddata.length || Budata.length || Appdata.length) {
      const awsData = filteredFinopsData.filter(
        (item: any) => item.Cloud === "AWS"
      );
      const azureData = filteredFinopsData.filter(
        (item: any) => item.Cloud === "Azure"
      );
      const gcpData = filteredFinopsData.filter(
        (item: any) => item.Cloud === "GCP"
      );

      const awsForecast = forecastfilter.filter(
        (item: any) => item.Cloud === "AWS"
      );
      const azureForecast = forecastfilter.filter(
        (item: any) => item.Cloud === "Azure"
      );

      const gcpForecast = forecastfilter.filter(
        (item: any) => item.Cloud === "GCP"
      );
      if (!filteredFinopsData.length) {
        // testing
        window.alert("invalid option");
      } else {
        dispatch(setAwsDailyUsage(awsData));
        dispatch(setGcpDailyUsage(gcpData));
        dispatch(setAzureDailyUsage(azureData));
        dispatch(setAwsForecast(awsForecast));
        dispatch(setAzureForecast(azureForecast));
        dispatch(setGcpForecast(gcpForecast));
      }
    } else {
      dispatch(setAwsDailyUsage(finopsSliceData?.finopsawsDailyUsage));
      dispatch(setAzureDailyUsage(finopsSliceData?.finopsazureDailyUsage));
      dispatch(setGcpDailyUsage(finopsSliceData?.finopsgcpDailyUsage));
      dispatch(setAwsForecast(finopsSliceData?.finopsawsForecast));
      dispatch(setAzureForecast(finopsSliceData?.finopsazureForecast));
      dispatch(setGcpForecast(finopsSliceData?.finopsgcpForecast));
    }
  }, [Clouddata.length, Budata.length, Appdata.length]);

  // filters cloud based key for options
  const test = filterData("Cloud", Cloudoptions);
  const filterDataOptions = (data) => {
    const allClouds = Object.keys(data);
    const businessUnits = new Set();
    const applications = new Set();

    // Iterate through each cloud data
    for (const cloud of allClouds) {
      const cloudData = data[cloud] || []; // Get data for the specific cloud or empty array

      cloudData.forEach((item) => {
        businessUnits.add(item.BusinessUnit || "");
        applications.add(item.Application || "");
      });
    }

    return {
      businessUnits: [...businessUnits],
      applications: [...applications],
    };
  };

  const { businessUnits, applications } = filterDataOptions(test);
  const [showDropdowns, setShowDropdowns] = useState(false); // New state to control dropdown visibility

  // Function to toggle dropdown visibility
  const toggleDropdowns = () => {
    setShowDropdowns(!showDropdowns);
  };

  return (
    <>
      <div className="mx-3 ">
        <div className="row ">
          <div className="col-md-12 ">
            <div className="row">
              <div className="bg-white pt-3 d-flex finops justify-content-between click">
                {!showTop10App ? (
                  <Skeleton variant="text" width={210} height={50} />
                ) : (
                  <p className="k8title fw-bolder">FinopsDashboard</p>
                )}
                {!showTop10App ? (
                  <Skeleton variant="rectangular" width={40} height={40} />
                ) : (
                  <VscFilterIcon
                    className="filter_icon text-primary cursor-pointer"
                    onClick={toggleDropdowns} // Toggle dropdowns on click
                  />
                )}
              </div>
              {showDropdowns && (
                <Card
                  className={`d-flex flex-row-reverse shadow-lg mb-1`}
                  ref={ref}
                >
                  <Card.Body className="d-flex flex-wrap justify-content-end">
                    <div className="bg-white  d-inline d-flex justify-content-start finops">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                          components={["DatePicker", "DatePicker"]}
                        >
                          <DatePicker
                            label="From"
                            value={tovalue}
                            onChange={(newValue) => settoValue(newValue)}
                          />
                          <DatePicker
                            label="To"
                            value={fromvalue}
                            onChange={(newValue) => setfromValue(newValue)}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                      <span className="  ps-2 pt-2">
                        <FilterCustomAutoComplete
                          id="multiple-limit-tags"
                          options={Object.keys(filterData("Cloud", finopsdata))}
                          value={Clouddata}
                          setSelectedCloud={setCloudData}
                          setSelectedApplication={setAppData}
                          setSelectedResourceGroup={null}
                          setSelectedSubscription={null}
                          setSelectedBu={setBuData}
                          selectCategory={"Cloud"}
                          onChange={(event, newValue0) => {
                            if (event && event.length > 0) {
                              setCloudData(event);
                            } else {
                              handleFilterData(newValue0, "cloud");
                            }
                          }}
                          placeholder="Cloud"
                          TextFieldSx={{ width: 220 }}
                          limitTags={1}
                          error={false}
                        />
                      </span>
                      <span className=" ps-2 pt-2 ">
                        <FilterCustomAutoComplete
                          TextFieldSx={{ width: 220 }}
                          id="multiple-limit-tags"
                          options={businessUnits}
                          value={Budata}
                          setSelectedSubscription={null}
                          selectCategory={"bu"}
                          setSelectedCloud={setCloudData}
                          setSelectedApplication={setAppData}
                          setSelectedResourceGroup={null}
                          setSelectedBu={setBuData}
                          onChange={(event, newValue1) => {
                            if (event && event.length > 0) {
                              setBuData(event);
                            } else {
                              handleFilterData(newValue1, "bu");
                            }
                          }}
                          limitTags={1}
                          placeholder="BU"
                          error={false}
                        />
                      </span>
                      <span className="pt-2 ps-2 ">
                        <FilterCustomAutoComplete
                          id="multiple-limit-tags"
                          options={applications}
                          value={Appdata}
                          selectCategory={"app"}
                          setSelectedCloud={setCloudData}
                          setSelectedApplication={setAppData}
                          setSelectedResourceGroup={null}
                          setSelectedSubscription={null}
                          setSelectedBu={setBuData}
                          onChange={(event, newValue2) => {
                            if (event && event.length > 0) {
                              setAppData(event);
                            } else {
                              handleFilterData(newValue2, "app");
                            }
                          }}
                          placeholder="Application"
                          TextFieldSx={{ width: 220 }}
                          limitTags={1}
                          error={false}
                        />
                      </span>
                    </div>
                  </Card.Body>
                </Card>
              )}

              <div className="row gx-0 bg-white pb-2 ">
                <div className="col-lg-2 col-xxl-2 col-md-4 card-width gx-2">
                  {!showTop10App ? (
                    <Skeleton variant="rounded" width="100%" height={86} />
                  ) : (
                    <TotalCost />
                  )}
                </div>
                <div className="col-lg-2 col-xxl-2 col-md-4 card-width gx-2">
                  {!showTop10App ? (
                    <Skeleton variant="rounded" width="100%" height={86} />
                  ) : (
                    <ForeCast />
                  )}
                </div>
                <div className="col-lg-2 col-xxl-2 col-md-4 card-width gx-2">
                  {!showTop10App ? (
                    <Skeleton variant="rounded" width="100%" height={86} />
                  ) : (
                    <Budget />
                  )}
                </div>
                <div className="col-lg-2 col-xxl-2 col-md-4 mt_md_2  card-width1 gx-2">
                  {!showTop10App ? (
                    <Skeleton variant="rounded" width="100%" height={86} />
                  ) : (
                    <MaxDailyCostUsage />
                  )}
                </div>

                <div className="col-lg-2 col-xxl-2 col-md-4 mt_md_2 card-width2 gx-2">
                  {!showTop10App ? (
                    <Skeleton variant="rounded" width="100%" height={86} />
                  ) : (
                    <AvgDailyCostUsage
                      To_date={dateFormatter(tovalue)}
                      From_date={dateFormatter(fromvalue)}
                    />
                  )}
                </div>
                <div className="col-lg-2 col-xxl-2 col-md-4  mt_md_2 card-width  gx-2">
                  {!showTop10App ? (
                    <Skeleton variant="rounded" width="100%" height={86} />
                  ) : (
                    <FinopsCard
                      title={"Cost Saved"}
                      count={FormatNumber(cloudData.OrphanDeletedCost + cloudData.AdvisoryCost)}
                    />
                  )}
                </div>
              </div>

              {!showTop10App ? (
                Array.from(new Array(1)).map((_, rowIndex) => (
                  <Grid
                    container
                    item
                    xs={12}
                    spacing={1}
                    key={rowIndex}
                    justifyContent="flex-start"
                  >
                    {Array.from(new Array(6)).map((_, colIndex) => (
                      <Grid item xs={Math.floor(12 / 3)} key={colIndex}>
                        <Skeleton variant="rounded" width="100%" height={300} />
                      </Grid>
                    ))}
                  </Grid>
                ))
              ) : (
                <>
                  <div className="col-4 col-lg-4 col-md-6 gx-0">
                    <Tile>{showTop10App && <CostUsageChart />}</Tile>
                  </div>
                  <div className="col-4 col-lg-4 col-md-6 gx-0">
                    <Tile className="container card">
                      <ActualBudgetForecastChart />
                    </Tile>
                  </div>
                  <div className="col-4 col-lg-4 col-md-6 gx-0">
                    <Tile className="container card">
                      <ResourceGroup />
                    </Tile>
                  </div>
                  <div className="row ">
                    <div className="col-3 col-lg-3 col-md-6 gx-0">
                      <Tile>
                        {!showTop10App ? (
                          <Skeleton
                            variant="rounded"
                            width="100%"
                            height={300}
                          />
                        ) : (
                          <Top10BU />
                        )}
                      </Tile>
                    </div>
                    <div className="col-3 col-lg-3 col-md-6  gx-0">
                      <Tile>
                        <Top10Application />
                      </Tile>
                    </div>
                    <div className="col-3 col-lg-3 col-md-6 gx-0">
                      <Tile className="container card">
                        <Top10CostChart />
                      </Tile>
                    </div>
                    <div className="col-3 col-lg-3 col-md-6 gx-0">
                      <Tile>
                        <Top10DailyUsageChart />
                      </Tile>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="row  mb-2">
              <div className="col w-100 p-0">
                <Tile>
                  {!showTop10App ? (
                    <Skeleton variant="rounded" width="100%" height={250} />
                  ) : (
                    <FinOpsTable />
                  )}
                </Tile>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinOpsPage;
