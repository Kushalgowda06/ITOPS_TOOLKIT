import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Box,
  TextField,
  TablePagination,
  Snackbar,
  TableSortLabel,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Checkbox,
  Typography,
} from "@mui/material";
import { IoSaveOutline, IoBanOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { CiSearch } from "react-icons/ci";
import { TiDownloadOutline } from "react-icons/ti";
import {
  selectCommonConfig,
  setDropdownsApi,
  setFilteredAdvisoryData,
  setFilteredComplainceData,
  setFilteredOrphanData,
  setFilteredTaggingData,
  setOrphanData,
} from "../CommonConfig/commonConfigSlice";
import { Form } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { CSVLink } from "react-csv";
import { Api } from "../../Utilities/api";
import CustomAutoCompleteRadio from "../../Utilities/CustomAutoCompleteRadio";
import { filterData } from "../../Utilities/filterData";
import testapi from "../../../api/testapi.json";
import { PopUpModal } from "../../Utilities/PopUpModal";
import CustomAutoComplete from "../../Utilities/CustomAutoComplete";
import { HiXMark } from "react-icons/hi2";
import { LiaSortDownSolid } from "react-icons/lia";
import { KubernetesPopupWrapper } from "../KubernetesPopUp/KubernetesPopupWrapper";
import { ScheduleProfileLayout } from "../../Utilities/ScheduleProfileLayout";
import { wrapIcon } from "../../Utilities/WrapIcons";

const Tableedit = (props: any) => {
      const HiXMarkIcon = wrapIcon(HiXMark);
      const LiaSortDownSolidIcon = wrapIcon(LiaSortDownSolid);
      const CiSearchIcon = wrapIcon(CiSearch);
      const TiDownloadOutlineIcon = wrapIcon(TiDownloadOutline);
      const IoSaveOutlineIcon = wrapIcon(IoSaveOutline);
      const IoBanOutlineIcon = wrapIcon(IoBanOutline);
  
  const dispatch = useAppDispatch();
  const tableRef = useRef(null);

  const { customData } = props;

  let apiUrl = props.apiUrl ? props.apiUrl : testapi.tagging;
  const [finalCode, setFinalCode] = useState("");
  const cloudData = useAppSelector(selectCommonConfig);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [sharedLevel, setSharedLevel] = useState("");
  const [data, setData] = useState<any[]>([]); // whole data will store in the data variable only
  const [editIndex, setEditIndex] = useState(-1); // This is for page Index
  const [page, setPage] = useState(0); // Next page state
  const [rowsPerPage, setRowsPerPage] = useState(5); // This is for rowsPerPage selection
  const [snackbarOpen, setSnackbarOpen] = useState(false); // alert popup
  const [snackbarMessage, setSnackbarMessage] = useState(""); // alert Message
  const [snackbarType, setSnackbarType] = useState(""); // type of alert popUp Bar
  const [sortedField, setSortedField] = useState(null); // sort feature
  const [sortDirection, setSortDirection] = useState("asc"); // sort direction
  const [oldData, setOldData] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [reasonRejected, setReasonRejected] = useState("");
  const [showTextField, setShowTextField] = useState(false);
  const [textFieldData, setTextFieldData] = useState<any>("");
  const [untaggedData, setUntaggedData] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [showBusinessJustification, setShowBusinessJustification] =
    useState(false);
  const menuListCapabilities = cloudData.loginDetails.capabilities.Dashboard;
  // const [dropdownsApiData, setDropdownsApiData] = useState(
  //   cloudData.dropdownsApiData
  // );
  const [showValidation, setShowValidation] = useState<any>(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    column: string;
    data: any;
  } | null>(null);
  // const [selectedValue, setSelectedValue] = useState([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [selectedValues, setSelectedValues] = useState<{
    [key: string]: any[];
  }>({});
  // const [showIcon, setShowIcon] = useState<boolean>(false)
  const [lowValError, setLowValError] = useState(false);
  const [DoubleClickStatus, setDoubleClickStatus] = useState(false);
  const [flag, setFlag] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  // const [selectedValue, setSelectedValue] = useState("Status"); // cloud advisory dropdown
  const [showSharedResources, setShowSharedResources] = useState(false);

  const statusOption = ["Approved", "Deferred", "Dropped", "New", "Review"];
  const complaincestatusOption = [
    "Active",
    "InActive",
    "NotEncrypted",
    "Encrypted", "Enabled", "Ignore"
  ];
  const toggleSharedResources = (index) => {
    setShowSharedResources(!showSharedResources);
    setSharedLevel("");
    setShowTextField(false);
  };
  const handleSharedLevel = (index, newValue) => {
    setSharedLevel(newValue);
    setIsPopupOpen(true);
    setAllocationPercentages({});
    setSelectedResources({});
    setErrorMessage(null);
    newValue === null ? setShowTextField(false) : setShowTextField(true)
  };
  const [allocationPercentages, setAllocationPercentages] = useState({}); // Object to store allocation percentages
  const [errorMessage, setErrorMessage] = useState(null);

  const ITEM_HEIGHT = 35;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      },
    },
  };
  const updateAllocation = (event, resource) => {
    const newAllocation = { ...allocationPercentages }; // Create a copy

    newAllocation[resource] = parseInt(event.target.value); // Update allocation for specific resource
    const totalAllocated: any = Object.values(newAllocation).reduce(
      (sum: number, val: number) => {
        const nonNaNValue = isNaN(val) ? 0 : val;
        return sum + nonNaNValue;
      },
      0
    );
    const remaining = 100 - totalAllocated;
    if (totalAllocated > 100) {
      setErrorMessage(
        `You are trying to surpass the maximum limit of 100% for ${resource} by ${Math.abs(
          remaining
        )}%`
      );
    } else if (totalAllocated < 100) {
      setLowValError(true);
      setErrorMessage(
        `Allocation for ${resource} less than the maximum limit of 100. Lesser by ${remaining}%`
      );
    } else {
      setLowValError(false);
      setErrorMessage(null);
    }

    setAllocationPercentages(newAllocation);
  };

  const handlePopUpSave = () => {
    let codedata;
    if (sharedLevel === "Application") {
      codedata = cloudData?.dropdownsApiData?.Application.filter((code) =>
        allocationPercentages.hasOwnProperty(code.AppName)
      );
    } else if (sharedLevel === "BU") {
      codedata = cloudData?.dropdownsApiData?.BU.filter((code) =>
        allocationPercentages.hasOwnProperty(code.BUName)
      );
    } else if (sharedLevel === "project") {
      codedata = cloudData?.dropdownsApiData?.project.filter((code) =>
        allocationPercentages.hasOwnProperty(code.ProjectName)
      );
    }

    const getSharedCode = (appId, allocated) => {
      return `${appId}-${allocated}`;
    };
    const allAppNames = [];
    const sharedCodes = codedata?.map((code) => {
      const appName =
        sharedLevel === "Application"
          ? code.AppName
          : sharedLevel === "BU"
            ? code.BUName
            : code.ProjectName;
      const appId =
        sharedLevel === "Application"
          ? code.AppID
          : sharedLevel === "BU"
            ? code.BuID
            : code.ProjectID;
      const allocated = allocationPercentages[appName];

      allAppNames.push(appName);

      return getSharedCode(appId, allocated);
    });
    setTextFieldData(allAppNames);

    const codeprefix =
      sharedLevel === "BU" ? "B" : sharedLevel === "project" ? "P" : "A";
    setFinalCode(`${codeprefix}${sharedCodes.join("|")}`);
    if (sharedCodes.length === 0) {
      setErrorMessage("Please select atleast one resource"); // change to modal
      return;
    } else if (lowValError) {
      setErrorMessage(`Allocation for less than the maximum limit of 100.`);
      return;
    } else {
      setErrorMessage(null);
      setIsPopupOpen(false);
    }
    setShowTextField(true);
  };
  const handlePopUpCancel = () => {
    setIsPopupOpen(false);
    setAllocationPercentages({});
    setSelectedResources({});
    setErrorMessage(null);
    setSharedLevel("");
  };
  const [selectedResources, setSelectedResources] = useState({}); // State to store selected resources
  const handleResourceChange = (resource) => {
    setSelectedResources({
      ...selectedResources,
      [resource]: !selectedResources[resource],
    });
  };

  // pagination page moment prevPage to nextPage
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setEditIndex(-1);
  };
  // selectable option for how many rows should display in the table
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // alert Snake Bar when user clicks save and cancel icon
  const showSnackbar = (message, type) => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarOpen(true);
  };
  // snackBar close and open operation
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const location = useLocation();
  const pathname = location.pathname;




  useEffect(() => {
    if (pathname.includes("tagging-policy")) {
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

      fetchData();
    }
  }, []);

  // for complaince
  const hasComplianceKey = data.some((obj) =>
    Object.hasOwnProperty.call(obj, "Compliance")
  );
  // const handleMissingKeys = (data) => {
  //   return data?.map((row) => {
  //     const updatedRow = {};
  //     fieldNames.forEach((fieldName: any) => {
  //       updatedRow[fieldName] = row.hasOwnProperty(fieldName)
  //         ? row[fieldName]
  //         : "NA";
  //     });
  //     return updatedRow;
  //   });
  // };


  // useEffect(() => {
  //   const missingdata = handleMissingKeys(data);
  //   hasComplianceKey && !DoubleClickStatus ? setData(missingdata):  setData(props.customData);
  // }, [ hasComplianceKey ,flag, DoubleClickStatus])

  // using this props we are passing these customData to Barchart,DonughtChart and others
  useEffect(() => {
    setData(props.customData);
    setRowsPerPage(
      pathname.includes("kanban-board")
        ? 10
        : pathname.includes("orphan-objects") ||
          pathname.includes("tagging-policy") ||
          pathname.includes("cloud-advisory") ||
          pathname.includes("complaince-policy") ||
          pathname.includes("patch-dashboard")
          ? 5
          : 15
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudData]);

  useEffect(() => {
    setData(props.customData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customData, apiUrl]);
  // Double Clicks Method for user details update
  // setDoubleClickStatus(false);
  const handleDoubleClick = (index) => {
    setShowValidation(false);
    setShowSharedResources(false);
    setShowTextField(false);
    setDoubleClickStatus(true);
    setFlag(!flag);
    if (
      (pathname.includes("tagging") || pathname.includes("/details")) &&
      !menuListCapabilities[0]["Tagging"].includes("Update")
    ) {
      return;
    } else if (
      (pathname.includes("orphan") || pathname.includes("/orphan-details")) &&
      !menuListCapabilities[0]["Orphan Objects"].includes("Update")
    ) {
      return;
    } else if (
      (pathname.includes("advisory") ||
        pathname.includes("/advisory-details")) &&
      !menuListCapabilities[0]["Advisory"].includes("Update")
    ) {
      return;
    }

    setOldData([...data]);
    setEditIndex(index);
  };

  // snackBar cancel icon Operation
  const handleCancel = () => {
    setEditIndex(-1);
    setData(oldData);
    showSnackbar("updation Cancelled.", "error");
    if (tableRef.current) {
      tableRef.current.scrollLeft = 0; // scroll the table to the left side
    }
    setDoubleClickStatus(false);
  };

  // snackBar save icon operation
  const handleSave = (index, ResourceID) => {
    const updatedData = [...filteredData];
    if (
      !pathname.includes("orphan") &&
      !pathname.includes("advisory") &&
      !pathname.includes("complaince") &&
      showSharedResources &&
      sharedLevel.length === 0
    ) {
      setShowValidation(true);
      return;
    } else {
      setShowValidation(false);
    }
    const { _id, ...updatedFields } = updatedData[index];
    if (pathname.includes("tagging-policy") || pathname.includes("details") || pathname.includes("objectaging")) {
      updatedFields.SharedCost = finalCode;
    }

    if (pathname.includes("cloud-advisory") || pathname.includes("advisory")) {
      const updatedResources = updatedFields.FlaggedResources.map(
        (resource) => {
          if (resource.ResourceID === ResourceID) {
            return {
              ...resource,
              Status: status,
              ReasonRejected: reasonRejected,
            };
          } else {
            return resource;
          }
        }
      );
      updatedFields.FlaggedResources = updatedResources;
    }
    // showSnackbar("Data Updated Successfully!!", "success");
    if (hasComplianceKey) {
      setShowModal(true);
      setModalMessage(
        `Please ${updatedFields.Status} ${updatedFields.ResourceType}  from AWS Dashboard`
      );
    }

    if (updatedFields.ReasonRejected === ""
      &&
      (pathname.includes("cloud-advisory") ||
        pathname.includes("advisory-details") ||
        pathname.includes("orphan-objects") ||
        pathname.includes("orphan-details"))) {
      setShowModal(true);
      setModalMessage(
        `Please enter Business Justification`
      );
      setShowValidation(true)
      return;
    }
    else {
      setReasonRejected("")
      setShowModal(false);
      setShowValidation(false)
      axios
        .put(
          `${updatedFields.ResourceType === "MFA"
            ? `${apiUrl[0]}/${_id}`
            : updatedFields.ResourceType === "EBS Volume"
              ? `${apiUrl[2]}/${_id}`
              : updatedFields.ResourceType === "Access key"
                ? `${apiUrl[1]}/${_id}`
                : `${apiUrl}/${_id}`
          }`,
          updatedFields
        )
        // .put(`${apiUrl}/${_id}`, updatedFields)
        .then((response) => {
          setFilteredData(updatedData);
          if (pathname.includes("orphan-objects")) {
            Api.getData(testapi.orphan).then((response: any) => {
              dispatch(setOrphanData(response));
              dispatch(setFilteredOrphanData(response));
            });
          }
          setEditIndex(-1);
          response?.data?.code === 200
            ? showSnackbar(`${response?.data?.data}`, "success")
            : showSnackbar(`${response?.data?.message}`, "error");
        })
        .catch((error) => {
          showSnackbar(`${error}`, "success");
        });

      setFilteredData(updatedData);

      setEditIndex(-1);

      if (tableRef.current) {
        tableRef.current.scrollLeft = 0;
      }
      if (pathname.includes("tagging-policy")) {
        dispatch(setFilteredTaggingData(updatedData));
      } else if (pathname.includes("cloud-advisory")) {
        dispatch(setFilteredAdvisoryData(updatedData));
      } else if (pathname.includes("complaince")) {
        dispatch(setFilteredComplainceData(updatedData)); // warning to change that in dashboard
      }
      setDoubleClickStatus(false);
    };
  };

  const handleEdit = (index, fieldName, value) => {
    console.log(index, fieldName, value, "test")
    if (value === "Create New") {


      setShowProfile(true);
      return
    }
    const updatedData = [...filteredData];
    const rowData = updatedData[index];
    const updatedRow = {
      ...rowData,
      [fieldName]: value,
    };
    updatedData[index] = updatedRow;
    setFilteredData(updatedData);
  };

  // Sort Operation
  const handleSort = (field, direction, filteredData) => {
    const sortedData = [...filteredData].sort((a, b) => {
      if (a[field] < b[field]) return direction === "asc" ? -1 : 1;
      if (a[field] > b[field]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setData(sortedData);
    setSortedField(field);
    setSortDirection(direction);
  };
  // search state

  // search operation
  const handleFilterChange = (event) => {
    setSearchValue(event.target.value.trim());
    setPage(0);
  };

  useEffect(() => {
    // search data according to the user entered in the search field
    const searchData = data.filter((row) =>
      Object.values(row).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchValue.toLowerCase())
      )
    );
    setFilteredData(searchData);
  }, [data, searchValue]);

  useEffect(() => {
    // Filter data based on the selected values from the dropdowns
    let filteredRows = pathname.includes('/tagging-policy') ? untaggedData : props.customData;
    Object.keys(selectedValues).forEach((column) => {
      if (selectedValues[column].length > 0) {
        filteredRows = filteredRows.filter((row) =>
          selectedValues[column].includes(row[column])
        );
      }
    });

    // If all dropdown selections are cleared, reset to original data
    const allDropdownsCleared = Object.values(selectedValues).every(
      (values) => values.length === 0
    );

    if (allDropdownsCleared) {
      setFilteredData(pathname.includes('/tagging-policy') ? untaggedData : props.customData);
    } else {
      setFilteredData(filteredRows);
    }
  }, [selectedValues, props.customData, untaggedData, pathname]);


  // getting all the key names from the api for table heading
  const getVisibleKeys = (data: any[]): string[] => {
    const allKeys = new Set<string>();
    data.forEach((row) => {
      Object.keys(row).forEach((key) => {
        allKeys.add(key);
      });
    });
    return Array.from(allKeys);
  };

  const hiddenKeys = [
    "_id",
    "TicketSysID",
    "SRTicketSysID",
    "id",
    "FlaggedResources",
    "Type",
    "extra",
    "AvailablePatches",
    "PatchDate",
    "OSPatch",
    "SecurityPatch",
    "BugFix",
    "GenericUpdates",

  ]; // these key are hiding in the table
  // const fieldNames1 = getVisibleKeys(data, hiddenKeys); // this will display all the keys except hidden keys
  const fieldNames: string[] = getVisibleKeys(data).filter((key) => !hiddenKeys.includes(key));
  console.log("propsapiUrl", fieldNames)
  // these fields only user can edit and update
  const visibleFields = [
    "Application",
    "CostCenter",
    "Environment",
    "Support",
    "AvailabilityTime",
    "Owner",
    "BU",
    "ResourceStatus",
    "ReasonRejected",
    "Status",
    "GroupName",
    "Cloud",
    "OS",
    "ServerName",
    "ServerIP",
    "LastPatch",
    "LastPatchBy",
    "NewAvailable"

  ];
  // const fieldNames = [...fieldNames1]; // using that.
  const processRowKey = (row: any, key: string, columnWidth: number): string => {
    if (typeof row[key] === "string" && row.hasOwnProperty(key) && row[key].length > 0) {
      const defaultLength = 12;
      const maxLength = columnWidth ? Math.floor(columnWidth / 10) : defaultLength;
      return row[key].length > maxLength ? row[key].substring(0, maxLength) + "..." : row[key];
    }
    return row.hasOwnProperty(key) ? row[key] :
      <span>
        <TextField
          disabled
          variant="standard"
          InputProps={{ disableUnderline: true }}
          margin="dense"
          value={"Not Applicable"}
          // onChange={(event) =>
          //   handleEdit(page * rowsPerPage + index, key, event.target.value)
          // }
          style={{ marginTop: -7, marginBottom: -7, fontFamily: "GelixRegular" }}
        />
      </span>
  };


  // Exporting table table to csv
  const ExcelHeaders = fieldNames.map((fieldName) => ({
    label: fieldName,
    key: fieldName,
  }));

  const getFilenameFromUrl = (url) => {
    const urlSegments = url.split("/");
    const lastSegment = urlSegments[urlSegments.length - 1];
    return lastSegment ? `${lastSegment}-Data.csv` : "HCM-TableData.csv";
  };

  // Get the excelFilename filename based on the URL
  const excelFilename = getFilenameFromUrl(location.pathname);

  const handleCellClick = (row: number, column: string, data: any) => {
    setSelectedCell({ row, column, data });
    setShowDropdown(true);
  };

  const dropdownsObject = {
    BU: Object.keys(filterData("BUName", cloudData.dropdownsApiData["BU"])),
    Application: Object.keys(
      filterData("AppName", cloudData.dropdownsApiData["Application"])
    ),
    Environment: ["Sandbox", "Development", "QA", "Production", "Demo", "Lab"],
    CostCenter: Object.keys(
      filterData("CostCode", cloudData.dropdownsApiData["costCode"])
    ),
    Owner: Object.keys(filterData("UserName", cloudData.dropdownsApiData["users"])),
    project: Object.keys(
      filterData("ProjectName", cloudData.dropdownsApiData["project"])
    ),
  };

  const handleCheckboxChange = (event, row) => {
    if (event.target.checked) {
      setSelectedRows([...selectedRows, row]);
    } else {
      setSelectedRows(
        selectedRows.filter((selectedRow) => selectedRow !== row)
      );
    }
  };


  const checkNullValues: any = (element: any) => {
    return element === null || element === "Null";
  };

  useEffect(() => {
    if (pathname.includes('/tagging-policy')) {
      let untaggeddata = data?.filter((item) => {
        return Object.values(item).some(checkNullValues);
      });
      setUntaggedData(untaggeddata);
      setFilteredData(untaggeddata);
    }
  }, [pathname, data]);

  const [columnWidths, setColumnWidths] = useState(
    fieldNames.reduce((acc, fieldName) => {
      acc[fieldName] = 150; // Default width
      return acc;
    }, {})
  );

  // Function to handle column resizing
  const handleMouseDown = (e, fieldName) => {
    const startX = e.clientX;
    const startWidth = columnWidths[fieldName] || 150;

    const handleMouseMove = (e) => {
      const mouseX = e.clientX;
      const newWidth = startWidth + (mouseX - startX);

      setColumnWidths((prevWidths) => ({
        ...prevWidths,
        [fieldName]: Math.max(newWidth, 170), // Only limit the minimum width
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  // console.log("dragSzie : ",dragSzie)


  return (
    <div className="w-100 overflow-scroll">
      {props.customData.length > 0 && (
        <>
          <div>
            <TableContainer component={Paper} ref={tableRef}>
              <Table stickyHeader={!isPopupOpen} aria-label="sticky table">
                {/* Table Header */}
                <TableHead>
                  <TableRow>
                    {(pathname.includes("advisory-details") ||
                      pathname.includes("kanban-board")) && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            size="small"
                            className="text-primary"
                            indeterminate={
                              selectedRows.length > 0 &&
                              selectedRows.length < data.length
                            }
                            checked={
                              data.length > 0 &&
                              selectedRows.length === data.length
                            }
                            onChange={(event) => {
                              if (event.target.checked) {
                                setSelectedRows(data);
                              } else {
                                setSelectedRows([]);
                              }
                            }}
                          />
                        </TableCell>
                      )}
                    {fieldNames.map((fieldName) => (
                      <TableCell key={fieldName} className={`fw-bold p-1`}>
                        {/* Sort Functionality */}
                        <span className="pe-3 d-flex align-items-center"
                          // style={{
                          //     width: !showDropdown ? columnWidths[fieldName] : 220,
                          //     position: 'relative'
                          //   }}
                          style={!showDropdown ? {
                            width: columnWidths[fieldName],
                            position: 'relative'
                          } : {}}
                        >
                          {selectedCell?.column === fieldName &&
                            showDropdown ? (
                            <span className="d-flex align-items-center">
                              <CustomAutoComplete
                                options={Object.keys(
                                  filterData(
                                    `${selectedCell?.column}`,
                                    selectedCell?.data
                                  )
                                )}
                                value={selectedValues[fieldName] || []}
                                onChange={(event, newValue) => {
                                  setSelectedValues((prevSelectedValues) => ({
                                    ...prevSelectedValues,
                                    [fieldName]: newValue,
                                  }));
                                }}
                                TextFieldSx={{ width: 200, marginTop: 0 }}
                                id="multiple-limit-tags"
                                limitTags={1}
                                placeholder={selectedCell?.column}
                                error={false}
                                showTooltip={{ show: true, range: 1 }}
                                PaperStyle={{ width: 240, overflow: "auto" }}
                              />
                              {/* <FontAwesomeIcon
                        className="f-size ps-2 mb-1 cursor-pointer f-size pt-2"
                        icon={faXmark}
                        onClick={() => {
                          // Clear the selected value for this field
                          setSelectedValues(prevState => ({
                            ...prevState,
                            [fieldName]: [], // Or any default value you prefer
                          }));
                          setShowDropdown(false); // Close the dropdown
                        }}
                      />  */}
                            </span>
                          ) : (
                            <span
                              className={`pe-2 cursor-pointer  ${selectedValues[fieldName]?.length > 0
                                  ? "border-5 border-end rounded-1 border-start border-success   ps-1"
                                  : ""
                                }`}
                              onClick={(event) => {
                                handleCellClick(
                                  filteredData.length,
                                  fieldName,
                                  filteredData
                                );
                                // setShowIcon(true)
                                // setSelectedValue([]);
                                // showDropdown && setShowDropdown(false); // Ensure the dropdown is shown
                              }}
                            >
                              {fieldName}
                            </span>
                          )}
                          <span
                            className="f-size ms-1 mb-1 cursor-pointer"
                            // icon={
                            //   selectedCell?.column === fieldName && showDropdown
                            //     ? faXmark
                            //     : faSortDown
                            // }
                            onClick={() => {
                              if (selectedCell?.column === fieldName) {
                                setShowDropdown(!showDropdown);
                              } else {
                                setShowDropdown(true);
                                // Clear the selected value for this field
                                setSelectedValues((prevState) => ({
                                  ...prevState,
                                  [fieldName]: [], // Or any default value you prefer
                                }));
                                setShowDropdown(false);
                              }
                            }}
                          >
                            {selectedCell?.column === fieldName &&
                              showDropdown ? (
                              <HiXMarkIcon />
                            ) : (
                              <LiaSortDownSolidIcon onClick={(event) => {
                                handleCellClick(
                                  filteredData.length,
                                  fieldName,
                                  filteredData
                                )
                              }} />
                            )}
                          </span>
                          <TableSortLabel
                            active={sortedField === fieldName}
                            className="ps-2"
                            onClick={() =>
                              handleSort(
                                fieldName,
                                sortDirection === "asc" ? "desc" : "asc",
                                filteredData
                              )
                            } // sort functionality
                          />
                          <span
                            style={{
                              position: 'absolute',
                              right: 0,
                              cursor: 'col-resize',
                              userSelect: 'none',
                            }}
                            className="pt-1"
                            onMouseDown={(e) => handleMouseDown(e, fieldName)}
                          >
                            <span className="border-5 rounded-1 border-secondary-gradient border-end"></span>
                          </span>
                          {/* </TableSortLabel> */}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                {/* Table Body */}
                <TableBody>
                  {filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <React.Fragment key={row.id}>
                        <TableRow
                          onDoubleClick={() => handleDoubleClick(index)}
                          hover={true}
                        >
                          {(pathname.includes("advisory-details") ||
                            pathname.includes("kanban-board")) && (
                              <TableCell padding="checkbox">
                                <Checkbox
                                  className="text-primary"
                                  size="small"
                                  checked={selectedRows.includes(row)}
                                  onChange={(event) =>
                                    handleCheckboxChange(event, row)
                                  }
                                />
                              </TableCell>
                            )}
                          {fieldNames.map((key) => (

                            <TableCell
                              key={key}
                              size="small"
                              align="left"
                              className="ps-2"
                            >
                              {editIndex === index ? (
                                row[key] ? (
                                  <TextField
                                    disabled
                                    variant="standard"
                                    InputProps={{ disableUnderline: true }}
                                    margin="dense"
                                    value={row[key]}
                                    onChange={(event) =>
                                      handleEdit(page * rowsPerPage + index, key, event.target.value)
                                    }
                                    className="m-auto lh-sm"
                                  />
                                ) : (
                                  <div className="text-truncate text-black-50">
                                    <Tooltip
                                      title={row[key]}
                                      placement="top"
                                      arrow={true}
                                      followCursor={true}
                                    >
                                      <span className=" cursor-pointer">
                                        {processRowKey(row, key, columnWidths[key])}
                                      </span>
                                    </Tooltip>
                                  </div>
                                )
                              ) : (
                                <div className="text-truncate py-2">
                                  <Tooltip
                                    title={row[key]}
                                    placement="top"
                                    arrow={true}
                                    followCursor={true}
                                  >
                                    <span className=" cursor-pointer">
                                      {processRowKey(row, key, columnWidths[key])}
                                    </span>
                                  </Tooltip>
                                </div>
                              )}</TableCell>
                          ))}
                        </TableRow>
                        {/* collapse Row */}
                        <TableRow>
                          <TableCell
                            className="p-0"
                            colSpan={fieldNames.length}
                            size="small"
                          >
                            <Collapse
                              in={editIndex === index}
                              timeout="auto"
                              unmountOnExit
                              className="pt-3 pb-2"
                            >
                              <Box className="d-flex flex-row w-100">
                                {Object.keys(row).map((field) =>
                                  visibleFields.includes(field) ? (
                                    field === "ResourceStatus" ? (
                                      <FormControl
                                        key={field}
                                        size="small"
                                        className="px-2"
                                      >
                                        <InputLabel className="ps-2">
                                          {field}
                                        </InputLabel>
                                        <Select
                                          defaultValue="Orphaned"
                                          value={row[field]}
                                          onChange={(event) => {
                                            handleEdit(
                                              page * rowsPerPage + index,
                                              field,
                                              event.target.value
                                            );
                                            setShowBusinessJustification(true); // Update the state to show BusinessJustification
                                          }}
                                          label={field}
                                          sx={{ width: "200px" }}
                                        >
                                          {[
                                            "Orphaned",
                                            "UnOrphaned",
                                            "Rejected",
                                            "Deleted",
                                          ].map((statusOption) => (
                                            <MenuItem
                                              key={statusOption}
                                              value={statusOption}
                                            >
                                              {statusOption}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                    ) : field === "ReasonRejected" ? (
                                      showBusinessJustification && (
                                        <Form.Control
                                          className={`${showValidation && row[field].length < 1
                                              ? "border border-danger"
                                              : ""
                                            }`}
                                          // showValidation && curr.value.length < 1
                                          // ? "border border-danger"
                                          // : ""
                                          key={field}
                                          value={row[field]}
                                          placeholder="Business Justification"
                                          onChange={(event) => {
                                            setReasonRejected(
                                              event.target.value
                                            );
                                            handleEdit(
                                              page * rowsPerPage + index,
                                              field,
                                              event.target.value
                                            );
                                          }}
                                          as="textarea"
                                          rows={1}
                                          required
                                          style={{
                                            height: "36px",
                                            marginLeft: "5px",
                                            width: "20%",
                                          }}
                                        />
                                      )
                                    ) : field === "Status" ? (
                                      <FormControl
                                        key={field}
                                        size="small"
                                        className="px-2"
                                      >
                                        <InputLabel className="ps-2">
                                          {field}
                                        </InputLabel>

                                        <Select
                                          defaultValue={row[field]}
                                          value={row[field]}
                                          onChange={(event) => {
                                            setStatus(event.target.value);
                                            handleEdit(
                                              page * rowsPerPage + index,
                                              field,
                                              event.target.value
                                            );
                                            setShowBusinessJustification(true); // Update the state to show BusinessJustification
                                          }}
                                          label={field}
                                          sx={{ width: "200px" }}
                                        >
                                          {pathname.includes("complaince")
                                            ? complaincestatusOption.map(
                                              (complaincestatusOption) => (
                                                <MenuItem
                                                  key={complaincestatusOption}
                                                  value={
                                                    complaincestatusOption
                                                  }
                                                  disabled={
                                                    row[field] === "Active" ||
                                                      row[field] === "InActive"
                                                      ? complaincestatusOption ===
                                                      "Encrypted" ||
                                                      complaincestatusOption ===
                                                      "NotEncrypted" ||
                                                      complaincestatusOption ===
                                                      "Ignore" ||
                                                      complaincestatusOption ===
                                                      "Enabled"
                                                      : row[field] ===
                                                        "Encrypted" ||
                                                        row[field] ===
                                                        "NotEncrypted"
                                                        ? complaincestatusOption ===
                                                        "Active" ||
                                                        complaincestatusOption ===
                                                        "InActive" ||
                                                        complaincestatusOption ===
                                                        "Ignore" ||
                                                        complaincestatusOption ===
                                                        "Enabled"
                                                        : complaincestatusOption ===
                                                        "Active" ||
                                                        complaincestatusOption ===
                                                        "InActive" ||
                                                        complaincestatusOption ===
                                                        "Encrypted" ||
                                                        complaincestatusOption ===
                                                        "NotEncrypted"
                                                  }
                                                >
                                                  {complaincestatusOption}
                                                </MenuItem>
                                              )
                                            )
                                            : statusOption.map(
                                              (statusOption) => (
                                                <MenuItem
                                                  key={statusOption}
                                                  value={statusOption}
                                                  disabled={
                                                    statusOption ===
                                                    "Review" ||
                                                    statusOption === "New"
                                                  }
                                                >
                                                  {statusOption}
                                                </MenuItem>
                                              )
                                            )}
                                        </Select>
                                      </FormControl>
                                    ) : // </div>
                                      !pathname.includes("orphan") &&
                                        !pathname.includes("advisory") &&
                                        !pathname.includes("complaince") ? (
                                        [
                                          "BU",
                                          "Application",
                                          "Environment",
                                          "Owner",
                                          "CostCenter",
                                        ].includes(field) ? (
                                          <span className="px-1">
                                            <CustomAutoCompleteRadio
                                              key={field}
                                              id={`radio-autocomplete-${field}`}
                                              options={dropdownsObject[field]}
                                              value={row[field]}
                                              onChange={(newValue) => {
                                                if (
                                                  newValue !== null &&
                                                  newValue !== undefined
                                                ) {
                                                  handleEdit(
                                                    page * rowsPerPage + index,
                                                    field,
                                                    newValue
                                                  );
                                                }
                                              }}
                                              placeholder={field}
                                              error={false}
                                              FiledLabel={
                                                isPopupOpen ? "" : field
                                              }
                                              widthStyle={{ width: "200px" }}
                                              PaperStyle={{
                                                width: 240,
                                                height: "auto",
                                                overflow: "auto",
                                              }}
                                            />
                                          </span>
                                        ) : ["AvailabilityTime"].includes(
                                          field
                                        ) ? (
                                          <FormControl
                                            sx={{ m: 0, width: 210 }}
                                            hiddenLabel={true}
                                          >
                                            {isPopupOpen ? (
                                              ""
                                            ) : (
                                              <InputLabel>
                                                Availability Time
                                              </InputLabel>
                                            )}
                                            <Select
                                              variant="outlined"
                                              size="small"
                                              label={isPopupOpen ? "" : field}
                                              value={row[field]}
                                              className={` p-0 availaibility-height `}
                                              onChange={(newValue) => {
                                                if (
                                                  newValue !== null &&
                                                  newValue !== undefined
                                                ) {
                                                  handleEdit(
                                                    page * rowsPerPage + index,
                                                    field,
                                                    newValue.target.value
                                                  );
                                                }
                                              }}
                                              error={false}
                                              MenuProps={MenuProps}
                                            >
                                              <MenuItem
                                                key="Create New"
                                                value="Create New"
                                                style={{
                                                  fontWeight: "bold",
                                                  color: "#007bff",
                                                }}
                                              >
                                                <Typography
                                                  variant="body2"
                                                  style={{
                                                    fontWeight: "bold",
                                                    color: "#007bff",
                                                    fontSize: "0.8rem",
                                                    textDecorationLine:
                                                      "underline",
                                                  }}
                                                >
                                                  Create New
                                                </Typography>
                                              </MenuItem>
                                              {[
                                                "Work Days",
                                                "Business Hours - 9 to 6",
                                                "24 Hours",
                                                " 10 hours - 9 to 9",
                                              ]?.map((item) => (
                                                <MenuItem value={item}>
                                                  {item}
                                                </MenuItem>
                                              ))}
                                            </Select>
                                          </FormControl>
                                        ) : (
                                          <TextField
                                            key={field}
                                            label={isPopupOpen ? "" : field}
                                            value={row[field]}
                                            placeholder={field}
                                            onChange={(event) =>
                                              handleEdit(
                                                page * rowsPerPage + index,
                                                field,
                                                event.target.value
                                              )
                                            }
                                            variant="outlined"
                                            className="px-1"
                                            style={{ width: 200 }}
                                          />
                                        )
                                      ) : null
                                  ) : null
                                )}
                                {!pathname.includes("orphan") &&
                                  !pathname.includes("advisory") &&
                                  !pathname.includes("complaince") ? (
                                  <>
                                    <div className="d-flex d-inline align-items-center ps-1">
                                      <div>Shared Resources ?</div>
                                      <Form.Check
                                        type="switch"
                                        id="sharedResources-switch"
                                        checked={showSharedResources}
                                        onChange={() =>
                                          toggleSharedResources(index)
                                        }
                                        className="mx-1 me-2 "
                                      />

                                      {showSharedResources && (
                                        <div className="d-flex d-inline  align-items-center">
                                          <div className="form-label label-width pe-3 ">
                                            <span>Select Shared Resource </span>
                                            <span className="text-danger">
                                              *
                                            </span>
                                          </div>
                                          <CustomAutoCompleteRadio
                                            id="radio-auto"
                                            options={[
                                              "BU",
                                              "Application",
                                              "project",
                                            ]}
                                            value={sharedLevel}
                                            clearvalue={sharedLevel === ""}
                                            onChange={(newValue) => {
                                              handleSharedLevel(
                                                index,
                                                newValue
                                              );
                                            }}
                                            placeholder={
                                              "Levels of shared Resources"
                                            }
                                            widthStyle={{ width: "200px" }}
                                            error={
                                              showValidation &&
                                              (sharedLevel?.length === 0 ||
                                                sharedLevel?.length ===
                                                undefined)
                                            }
                                            PaperStyle={{
                                              width: 200,
                                              overflow: "hidden",
                                            }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                    {showTextField ? (
                                      <div className=" ps-2 d-flex d-inline align-items-center">
                                        <label className="form-label label-width">
                                          <span>
                                            {sharedLevel} shared Resources are
                                          </span>
                                        </label>
                                        <div>
                                          <TextField
                                            id="filled-multiline-flexible"
                                            InputProps={{
                                              readOnly: true,
                                            }}
                                            multiline
                                            value={textFieldData}
                                            maxRows={4}
                                            variant="standard"
                                          />
                                        </div>
                                      </div>
                                    ) : (
                                      <></>
                                    )}
                                  </>
                                ) : (
                                  <></>
                                )}
                                <div className="d-flex flex-row">
                                  <Button
                                    color="success"
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      height: "2.2rem",
                                      marginLeft: "1rem",
                                    }}
                                    onClick={() =>
                                      handleSave(
                                        page * rowsPerPage + index,
                                        row.ResourceID
                                      )
                                    }
                                    startIcon={
                                      <IoSaveOutlineIcon className="fs-5" />
                                    }
                                  >
                                    <span>Submit</span>
                                  </Button>

                                  <Button
                                    color="error"
                                    size="small"
                                    variant="outlined"
                                    sx={{
                                      height: "2.2rem",
                                      marginLeft: "1rem",
                                    }}
                                    onClick={handleCancel}
                                    startIcon={
                                      <IoBanOutlineIcon className="fs-5" />
                                    }
                                  >
                                    <span>Cancel</span>
                                  </Button>
                                </div>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* search field */}
            <div className="d-flex justify-content-start">
              <div className="mt-3 pe-auto">
                <TextField
                  id="search-field"
                  type="search"
                  variant="standard"
                  value={searchValue}
                  onChange={handleFilterChange}
                  placeholder="Search"
                  InputProps={{
                    endAdornment: <CiSearchIcon className="search_icon text-primary" />,
                  }}
                />
              </div>
              {/* Pagination */}
              <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 15, 25, 100]}
                count={filteredData.length}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPage={rowsPerPage}
                className="w-100 justify-content-between justify-items-center p-0"
              />
              <CSVLink
                data={filteredData}
                headers={ExcelHeaders}
                filename={excelFilename}
              >
                <TiDownloadOutlineIcon
                  className="download_icon text-primary"
                  title="Export Table Data to Excel"
                />
              </CSVLink>
            </div>
            {/* snackbar message */}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={handleSnackbarClose}
              message={snackbarMessage}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }} // set the anchor origin to bottom-right
              transitionDuration={500} // set the transition duration to 500ms
              ContentProps={{
                style: {
                  backgroundColor: snackbarType === "success" ? "green" : "red",
                },
              }}
            />
            <PopUpModal
              show={showModal}
              modalMessage={modalMessage}
              onHide={() => setShowModal(false)}
            />
          </div>
          <div className="position-realtive top-50">
            {isPopupOpen && (
              <KubernetesPopupWrapper
                height={"430px"}
                width={"900px"}
                title="Select the shared Resource"
                handleSave={handlePopUpSave}
                handleClose={handlePopUpCancel}
              >
                <div className="py-3">
                  <label className="form-label label-width w-75">
                    <span>
                      Allocate {sharedLevel} shared Resources (Total: 100%)
                    </span>
                    <span className="text-danger">*</span>
                    <div>
                      {errorMessage && (
                        <span className="text-danger">{errorMessage}</span>
                      )}
                    </div>
                  </label>
                  <div className="shared-height">
                    {dropdownsObject[sharedLevel]?.map((resource) => (
                      <div
                        key={resource}
                        className="d-flex align-items-center pb-2 row "
                      >
                         <div className="col-2 ps-4">
                          <div className="d-flex align-items-center">
                            <input
                              type="checkbox"
                              id={`${resource}-checkbox`}
                              checked={selectedResources[resource] || false} // Default unchecked
                              onChange={() => handleResourceChange(resource)}
                              className="me-2"
                            />
                            <label
                              htmlFor={`${resource}-checkbox`}
                              className="mb-0"
                            >
                              {resource}:
                            </label>
                          </div>
                        </div>

                        <div className="col-8 d-flex d-inline ">
                          {selectedResources[resource] && ( // Show input only if checked
                            <>
                              <input
                                type="number"
                                min={1}
                                max={100}
                                defaultValue={0}
                                id={`${resource}-allocation`} // Unique ID for each input
                                value={allocationPercentages[resource]} // Set initial value from allocationPercentages
                                onChange={(event) =>
                                  updateAllocation(event, resource)
                                }
                                className="form-control launch-width h-25 allocation-input p-2"
                              ></input>
                              <span
                                className="input-group-text bg-white border-0 p-0"
                                style={{ marginLeft: "-20px" }}
                              >
                                %
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </KubernetesPopupWrapper>
            )}
          </div>
          {showProfile && <ScheduleProfileLayout handlePopUpSave={handlePopUpSave} handlePopUpCancel={handlePopUpCancel} />}

        </>
      )}
    </div>
  );
};

export default Tableedit;
