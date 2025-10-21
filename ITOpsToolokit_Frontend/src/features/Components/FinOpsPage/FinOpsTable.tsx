import React, { useEffect, useState } from "react";

import {
  Box,
  Collapse,
  FormControl,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import {
  selectFinopsData,
  setAwsDailyUsage,
  setAwsForecast,
  setAzureDailyUsage,
  setAzureForecast,
  setGcpDailyUsage,
  setGcpForecast,
} from "./FinOpsDataSlice";
import { CSVLink } from "react-csv";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

const FinOpsTable = () => {
  const finopsSliceData = useAppSelector(selectFinopsData);
  var final = [...finopsSliceData.awsDailyUsage,
    ...finopsSliceData.azureDailyUsage,
    ...finopsSliceData.gcpDailyUsage,
    ...finopsSliceData.azureForecast,
    ...finopsSliceData.awsForecast,
    ...finopsSliceData.gcpForecast]

  const [prevSelectedData, setPrevSelectedData] = React.useState(null);
  const [editIndex, setEditIndex] = useState(-1); // This is for page Index
  const [page, setPage] = useState(0); // Next page state
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState<any>([]);
  const dispatch = useAppDispatch();
  const [filteredData, setFilteredData] = useState(final);
  useEffect(() => {
    setData(final);
  }, [finopsSliceData]);
  let test;
useEffect(()=>{
  test = data.length === 0 ? filteredData : data
  const dataWithMissingKeysFilled = handleMissingKeys(test);
setFilteredData(dataWithMissingKeysFilled)
},[data])
  // filter out keys from filterdata
  const allKeys = new Set();
  for (const obj of filteredData) {
    Object.keys(obj).forEach((key) => allKeys.add(key));
  }
  const fieldnames = Array.from(allKeys);

  // Function to check for missing keys and add "NA"
  const handleMissingKeys = (data) => {
    return data.map((row) => {
      const updatedRow = {};
      fieldnames.forEach((fieldName: any) => {
        updatedRow[fieldName] = row.hasOwnProperty(fieldName)
          ? row[fieldName]
          : "NA";
      });
      return updatedRow;
    });
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setEditIndex(-1);
  };
  // search operation
  // search state
  const [searchValue, setSearchValue] = useState("");
  const handleFilterChange = (event) => {
    setSearchValue(event.target.value.trim());
    setPage(0);
  };
  // selectable option for how many rows should display in the table
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const processRowKey = (row, key) => {
    if (
      typeof row[key] === "string" &&
      row.hasOwnProperty(key) &&
      row[key].length > 0
    ) {
      return row[key].substring(0, 11) + (row[key].length > 12 ? "..." : "");
    }
  };
  const handleClickdata = (key, row) => {
    setPrevSelectedData(row.id);
    if (row.id === prevSelectedData) {
      dispatch(setAwsDailyUsage(finopsSliceData?.finopsawsDailyUsage));
      dispatch(setAzureDailyUsage(finopsSliceData?.finopsazureDailyUsage));
      dispatch(setGcpDailyUsage(finopsSliceData?.finopsgcpDailyUsage));
      dispatch(setAzureForecast(finopsSliceData?.finopsazureForecast));
      dispatch(setAwsForecast(finopsSliceData?.finopsawsForecast));
      dispatch(setGcpForecast(finopsSliceData?.finopsgcpForecast));
      setPrevSelectedData(null); // Reset selected value
    } 

else{
    const filtered = data?.find(item => item.id === row.id);
    const { Cloud, Forecast, Cost_inr } = filtered; // Object destructuring for clarity


    if (Cloud && (Forecast || Cost_inr)) {


      switch (Cloud) {
        case "AWS":
           dispatch(setAwsForecast([filtered])) 
        dispatch(setAzureForecast([]))
        dispatch(setGcpForecast([]))
        dispatch(setAwsDailyUsage([]))
        dispatch(setAzureDailyUsage([]))
        dispatch(setGcpDailyUsage([])) 
          break;
        case "Azure":
          dispatch(setAwsForecast([])) 
          dispatch(setAzureForecast([filtered])) 
          dispatch(setGcpForecast([]))
          dispatch(setAwsDailyUsage([]))
          dispatch(setAzureDailyUsage([]))
          dispatch(setGcpDailyUsage([])) 
          break;
        case "GCP":
          dispatch(setAwsForecast([])) 
          dispatch(setAzureForecast([])) 
          dispatch(setGcpForecast([filtered]))
          dispatch(setAwsDailyUsage([]))
          dispatch(setAzureDailyUsage([]))
          dispatch(setGcpDailyUsage([])) 
          break;
      }
    }

    else{
      switch (Cloud) {
      case "AWS":
        dispatch(setAwsDailyUsage([filtered]))
            dispatch(setAwsForecast([])) 
            dispatch(setAzureForecast([])) 
            dispatch(setGcpForecast([]))
            dispatch(setAzureDailyUsage([]))
            dispatch(setGcpDailyUsage([])) 
        break;
      case "Azure":
        dispatch(setAzureDailyUsage([filtered]))
            dispatch(setAwsDailyUsage([]))
            dispatch(setAwsForecast([])) 
            dispatch(setAzureForecast([])) 
            dispatch(setGcpForecast([]))
            dispatch(setGcpDailyUsage([]))
        break;
      case "GCP":
        dispatch(setGcpDailyUsage([filtered]))
                dispatch(setAzureDailyUsage([]))
                dispatch(setAwsDailyUsage([]))
                dispatch(setAwsForecast([])) 
                dispatch(setAzureForecast([])) 
                dispatch(setGcpForecast([]))
        break;
      }
    }
  }
  };
 // Exporting table table to csv
 const ExcelHeaders = fieldnames.map((fieldName:any) => ({
  label: fieldName,
  key: fieldName,
}));
  return (
    <div className="w-100 overflow-scroll">
      {filteredData.length > 0 && (
        <div className="table-responsive-xl">
          <TableContainer  component={Paper}>
            <Table stickyHeader aria-label="sticky table">
              {/* Table Header */}
              <TableHead>
                <TableRow>
                  {fieldnames.map((fieldName: any) => (
                    <TableCell key={fieldName} className="fw-bold p-1">
                      {/* Sort Functionality */}
                      <TableSortLabel
                        className="pe-5 ps-1"
                        //    active={sortedField === fieldName}
                        //    onClick={() =>
                        //      handleSort(
                        //        fieldName,
                        //        sortDirection === "asc" ? "desc" : "asc"
                        //      )
                        //    }
                        // sort functionality
                      >
                        {fieldName}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              {/* Table Body */}
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row: any, index) => (
                    <React.Fragment key={row.id}>
                      <TableRow
                        onClick={() => handleClickdata(index, row)}
                        hover={true}
                      >
                        {Object.keys(row).map((key) => {
                          return (
                            <TableCell
                              key={key}
                              size="small"
                              align="left"
                              className="ps-2"
                            >
                              {editIndex === index ? (
                                row[key].length <= 12 ? (
                                  <TextField
                                    disabled
                                    variant="standard"
                                    InputProps={{ disableUnderline: true }}
                                    margin="dense"
                                    value={row[key]}
                                    
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
                                      <span className="d-inline-block cursor-pointer">
                                        {processRowKey(row, key)}
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
                                    <span className="d-inline-block cursor-pointer">
                                      {processRowKey(row, key)}
                                    </span>
                                  </Tooltip>
                                </div>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                      {/* collapse Row */}
                      <TableRow>
                        <TableCell
                          className="p-0"
                          colSpan={fieldnames.length}
                          size="small"
                        >
                          <Collapse
                            in={editIndex === index}
                            timeout="auto"
                            unmountOnExit
                            className="pt-3 pb-2"
                          >
                            <Box className="d-flex flex-row w-50">
                              {Object.keys(row).map((field) =>
                                fieldnames.includes(field) ? (
                                  <TextField
                                    key={field}
                                    label={field}
                                    value={row[field]}
                                    placeholder={field}
                                  
                                    variant="outlined"
                                    fullWidth
                                    className="px-1"
                                  />
                                ) : null
                              )}

                           
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <div className="d-flex justify-content-start">
            {/* <div className="mt-3 pe-auto">
              <TextField
                id="search-field"
                type="search"
                variant="standard"
                value={searchValue}
                onChange={handleFilterChange}
                placeholder="Search"
                InputProps={{
                  endAdornment: (
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="btn" />
                  ),
                }}
              />
            </div> */}
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
              filename="Finops_table_data.csv"
            >
              <FontAwesomeIcon
                icon={faDownload}
                className="btn btn-outline-primary  download_icon"
                title="Export Table Data to Excel"
              />
            </CSVLink>
            
          </div>
          {/* search field */}
        </div>
      )}
    </div>
  );
};
export default FinOpsTable;
