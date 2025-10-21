import React, { useEffect, useState } from "react";
import { TextField, Breadcrumbs,Tooltip  } from "@mui/material";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Api } from "../../Utilities/api";
import testapi from "../../../api/testapi.json";
import { useAppSelector } from "../../../app/hooks";
import { selectCommonConfig } from "../CommonConfig/commonConfigSlice";
import { CiSearch } from "react-icons/ci";
import { FaChevronRight } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import SkeletonGrid from "../../Utilities/SkeletonGrid";
import { wrapIcon } from "../../Utilities/WrapIcons";

const OnboardingFormCards = () => {
  type PathData = {
    path: string;
    title: string;
    apiData: any[];
  };
  const CiSearchIcon = wrapIcon(CiSearch);
  const FaChevronRightIcon = wrapIcon(FaChevronRight);
  const FaPlusIcon = wrapIcon(FaPlus);

  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const location = useLocation();
  const [pathData, setPathData] = useState<PathData>({
    path: "",
    title: "",
    apiData: []
  });
  const pathname = location.pathname;
  const navigate = useNavigate();
  const cloudData = useAppSelector(selectCommonConfig);

  const userPermission = cloudData.loginDetails.capabilities.Onboarding[0]


  const breadcrumbs = [
    <Link className="pt-0 border-bottom border-primary fw-normal" to='/onboarding' title="All Onboardings">
      Onboarding
    </Link>,
    <Link className="pt-0 ps-1 border-bottom border-primary fw-normal" to={pathname} title={pathData.title}>
      {pathData.title}
    </Link>
  ];

  useEffect(() => {
    const fetchData = async () => {
      const apiEndPoints = ['BU', 'project', 'mastersubscriptions', 'users', 'roles', 'costCode', 'Application'];
      const apiPromises = apiEndPoints.map(type =>
        Api.getData(testapi[type]).catch(error => {
          console.error(`Error fetching data from ${type}:`, error);
          return null;
        })
      );
      const responses = await Promise.all(apiPromises);
      const responseData = responses.reduce((acc, response, index) => {
        if (response) {
          acc[apiEndPoints[index]] = response;
        }
        return acc;
      }, {});
      setData(responseData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const onboardingConfig = {
      "/BU-onboarding-details": {
        dataKey: "BU",
        path: "/BU-onboarding",
        title: "BU Onboarding",
        fields: ["id", "BUName", "BUOwner", "Description"],
      },
      "/project-onboarding-details": {
        dataKey: "project",
        path: "/project-onboarding",
        title: "Project Onboarding",
        fields: ["id", "ProjectID", "ProjectName", "ProjectManager", "BusinessUnit"],
      },
      "/subscription-onboarding-details": {
        dataKey: "mastersubscriptions",
        path: "/subscription-onboarding",
        title: "Subscription Onboarding",
        fields: ["id", "SubscriptionID", "SubscriptionName", "SubscriptionOwner", "Cloud"],
      },
      "/user-onboarding-details": {
        dataKey: "users",
        path: "/user-onboarding",
        title: "User Management",
        fields: ["id", "FullName", "EmailID"],
      },
      "/role-onboarding-details": {
        dataKey: "roles",
        path: "/role-onboarding",
        title: "Role Management",
        fields: ["id", "RoleName", "Members"],
      },
      "/costcode-onboarding-details": {
        dataKey: "costCode",
        path: "/costcode-onboarding",
        title: "Cost Code Onboarding",
        fields: ["_id", "CostCodeName", "CostCode", "Applications", "BusinessUnit"],
      },
      "/application-onboarding-details": {
        dataKey: "Application",
        path: "/application-onboarding",
        title: "Application Onboarding",
        fields: ["_id", "AppName", "AppPrimaryOwner", "BusinessUnit"],
      },
    };

    const configKey = Object.keys(onboardingConfig).find((key) =>
      pathname.includes(key)
    );

    if (configKey) {
      const config = onboardingConfig[configKey];
      const onboardingData = data[config.dataKey]?.map((item) => {
        const mappedItem = {};
        config.fields.forEach((field) => {
          const key = field === "_id" ? "id" : field;
          mappedItem[key] = item[field];
        });
        return mappedItem;
      });

      setPathData({
        path: config.path,
        title: config.title,
        apiData: onboardingData || [],
      });
    }
  }, [data, pathname]);


  const filteredData = pathData.apiData.filter((item) => {
    const isSearchMatch = Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchInput.toLowerCase())
    );
    return isSearchMatch;
  });

  const toTitleCaseWithSpaces = (str) => {
    return (
      str
        // Replace underscores with spaces
        .replace(/_/g, " ")
        // Add a space before any uppercase letters that are preceded by a lowercase letter
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        // Capitalize the first character of each word
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    );
  };

  const handleCardClick = (id) => {
    navigate(`${pathData.path}/${id}`);
  };

  // console.log(userPermission[cloudData.activeOnboarding] , 'ppp');
  // console.log(userPermission , 'ppp')
  // console.log(cloudData.activeOnboarding , 'ppp')

  return (
    <>
      <div className="m-2 bg_color onboarding-page-h">
        <div className="p-2">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center ps-2">
              {/* <FontAwesomeIcon icon={faRectangleList} className="fs-2" /> */}
              <p className="k8title pt-3 fw-bolder px-3">
                {pathData.title}
              </p>
              <span className="align-self-center pt-2">
                <Breadcrumbs className="align-self-center fw-normal px-2 card-title" separator={<FaChevronRightIcon className="text-primary pt-1 fw-normal" />} aria-label="breadcrumb">
                  {breadcrumbs}
                </Breadcrumbs>
              </span>
            </div>
            <div className="d-flex align-items-center">
              <div className="col d-flex justify-content-center align-items-center px-2">
                {userPermission[cloudData.activeOnboarding]?.includes("Add") ? <div className="px-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary bu_btn_width"
                    onClick={() => navigate(pathData.path)}
                  >
                    <span className="d-flex align-items-center"><FaPlusIcon className="me-1" /> {pathData.title}</span>
                  </button>
                </div> : <></>}
                <div className="px-2">
                  <TextField
                    id="search-field"
                    placeholder="Search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <CiSearchIcon
                          className="text-primary search_icon"
                        />
                      ),
                    }}
                    sx={{ width: 190 }}
                  />
                </div>
              </div>
            </div>
          </div>
          {filteredData.length > 0 ?
          <div className="row d-flex ps-3  align-items-start">
            {filteredData.map((item, index) => (
              <div
                key={index}
                className="k8-card-container col-xl-3 col-lg-3 col-md-6 py-3"
              // style={{ width: "300px" }}
              >
                <div
                  className="card cursor-pointer border-0 title-card-background  rounded-4 text-white"
                  style={{ width: "90%" }}
                  onClick={() => handleCardClick(item.id)}
                >
                  <div className="card-body description">

                    {Object.keys(item).map((key) => {
                      if (key !== 'id') {
                        return (
                          <div key={key} className="f-size text-title ">
                            <span className="fw-bold text-title">{key} : </span>{" "}
                            {Array.isArray(item[key])
                              ? <Tooltip
                                title={item[key].join(', ')}
                                placement="top"
                                arrow={true}
                                followCursor={true}
                              >
                                 <span className="d-inline-block cursor-pointer py-1">
                                {item[key].join(', ').substring(0, 20)}
                                {item[key].join(', ').length > 15 ? "..." : ""}
                                </span>
                              </Tooltip>


                              : <Tooltip
                                title={toTitleCaseWithSpaces(item[key])}
                                placement="top"
                                arrow={true}
                                followCursor={true}
                              >
                                 <span className="d-inline-block cursor-pointer py-1">
                                 {toTitleCaseWithSpaces(item[key]).substring(0, 15)}
                                 {toTitleCaseWithSpaces(item[key]).length > 15 ? "..." : ""}
                                 </span>
                              </Tooltip>

                            }
                          </div>
                        );
                      }
                      return null;
                    })}

                  </div>
                </div>
              </div>
            ))}
          </div>
         : <div><SkeletonGrid variant={"rounded"} progressLoader={false} columns={4} rows={5} /></div> }
        </div>
      </div>
    </>
  );
};

export default OnboardingFormCards;
