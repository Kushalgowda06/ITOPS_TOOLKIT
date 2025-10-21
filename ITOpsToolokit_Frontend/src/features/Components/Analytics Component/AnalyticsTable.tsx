import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";

import { visuallyHidden } from "@mui/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown, faTimesCircle } from "@fortawesome/free-solid-svg-icons";

import CustomAutoComplete from "../../Utilities/CustomAutoComplete";
import { Collapse } from "@mui/material";
import { dynamicFlattenData } from "./dynamicFlattenData";
import { capitalizeFirstLetter } from "../../Utilities/capitalise";
import { PopUpModal } from "../../Utilities/PopUpModal";
import TicketCreation from "./TicketCreation";
import { useAppDispatch } from "../../../app/hooks";
import { AnalyticsLoader } from "../../Utilities/AnalyticsContentLoader";

interface FlatData {
  [key: string]: any; // Allows for dynamic keys
  id: string; // Ensure id is always present
}

const flattenErrorData = (apiData: any): FlatData[] => {
  let processedData: any[] = [];

  // Determine the primary array to process based on input structure
  if (Array.isArray(apiData)) {
    // Structure 1: Top-level array of error objects
    processedData = apiData;
  } else if (
    typeof apiData === "object" &&
    apiData !== null &&
    Array.isArray(apiData.data)
  ) {
    // Structure 2: Object with a 'data' array
    processedData = apiData.data;
  } else {
    // If neither expected structure, treat as a single item or an unhandled case
    console.warn(
      "flattenErrorData received an unexpected data structure:",
      apiData
    );
    if (typeof apiData === "object" && apiData !== null) {
      processedData = [apiData]; // Wrap single object in an array for processing
    } else {
      return []; // Return empty array if completely unprocessable
    }
  }

  const flattenedRows: FlatData[] = [];

  processedData.forEach((entry: any, entryIndex: number) => {
    const isErrorLogEntry =
      (entry.ErrorCategories && Array.isArray(entry.ErrorCategories)) ||
      Object.prototype.hasOwnProperty.call(entry, "ErrorType") ||
      Object.prototype.hasOwnProperty.call(entry, "Errors");

    if (
      entry.ErrorCategories &&
      Array.isArray(entry.ErrorCategories) &&
      entry.ErrorCategories.length > 0
    ) {
      // Handle entries with ErrorCategories (like structure 2)
      entry.ErrorCategories.forEach((errorCategory: any, catIndex: number) => {
        // Flatten the errorCategory object
        const dynamicallyFlattenedCategory = dynamicFlattenData(errorCategory);
        // Each entry from dynamicFlattenData returns an array of flattened objects.
        // For a single errorCategory, it should typically return one object,
        // but handling it as an array ensures robustness.
        dynamicallyFlattenedCategory.forEach(
          (flatCategory: FlatData, flatCatIndex: number) => {
            const uniqueId = `${entry.id || "no-id"}-${
              errorCategory.ErrorType || "no-type"
            }-${catIndex}-${flatCatIndex}`;

            const flatRow: FlatData = {
              id: uniqueId,
              Filename: entry.Filename || "NA", // Retain filename from the parent entry
              ...flatCategory, // Spread all dynamically flattened properties from errorCategory
            };

            flattenedRows.push(flatRow);
          }
        );
      });
    } else {
      // Handle entries without ErrorCategories (like structure 1, or files without errors in structure 2)
      // Or general top-level objects in the first structure
      const entryId =
        entry.id || `${entry.Filename || "no-filename"}-${entryIndex}`;

      // Dynamically flatten the top-level entry
      const dynamicallyFlattenedEntry = dynamicFlattenData(entry);

      dynamicallyFlattenedEntry.forEach(
        (flatEntry: FlatData, flatEntryIndex: number) => {
          const uniqueId = `${entryId}-flat-${flatEntryIndex}`;

          // const defaultValues = {
          //   ErrorType: "NA",
          //   Errors: "NA",
          //   Occurrences: 0,
          //   IPAddress: "NA",
          //   HostName: "NA",
          //   JVMName: "NA",
          //   KEDB: "NA",
          //   AIDocsAnalysis: "NA",
          //   AIErrorAnalysis: "NA",
          //   AIRecommendedAction: "NA",
          // };

          let finalFlatRow: FlatData = {
            id: uniqueId,
            // ...defaultValues, // Apply defaults first
            ...flatEntry, // Override defaults with actual data
          };

          if (isErrorLogEntry) {
            const errorSpecificDefaults = {
              ErrorType: "NA",
              Errors: "NA",
              Occurrences: 0,
              IPAddress: "NA",
              HostName: "NA",
              JVMName: "NA",
              KEDB: "NA",
              AIDocsAnalysis: "NA",
              AIErrorAnalysis: "NA",
              AIRecommendedAction: "NA",
              Solution: "NA",
            };
            finalFlatRow = {
              id: uniqueId, // Ensure ID is first
              // Filename: entry.Filename || 'NA', // Keep filename if it's an error entry
              ...errorSpecificDefaults, // Apply error-specific defaults
              ...flatEntry, // Actual data overrides defaults
            };
          }
          // Remove the original "ErrorCategories" if it was present but empty or not needed in the final flat row
          delete finalFlatRow.ErrorCategories;
          flattenedRows.push(finalFlatRow);
        }
      );
    }
  });

  // Normalize missing keys
  const allKeys = new Set<string>();
  flattenedRows.forEach((row) => {
    Object.keys(row).forEach((key) => allKeys.add(key));
  });

  flattenedRows.forEach((row) => {
    allKeys.forEach((key) => {
      if (!(key in row)) {
        row[key] = "NA"; // Fill missing keys
      }
    });
  });

  return flattenedRows;
};

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Dynamically generate head cells based on the first flattened row's keys
interface HeadCell {
  id: string; // id can be any string now
  label: string;
  numeric: boolean; // You might need to refine this based on actual data types
}

const generateHeadCells = (data: FlatData[]): HeadCell[] => {
  if (data.length === 0) return [];

  const firstRow = data[0];
  const dynamicHeadCells: HeadCell[] = [];

  for (const key in firstRow) {
    if (key !== "id") {
      // 'id' is used internally for React keys, no need to display
      dynamicHeadCells.push({
        id: key,
        label: capitalizeFirstLetter(key), // Converts camelCase to "Camel Case" for labels
        numeric: typeof firstRow[key] === "number", // Basic check for numeric, refine if needed
      });
    }
  }
  return dynamicHeadCells;
};

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy: string;
  columnWidths: { [key: string]: number };
  startResizing: (e: React.MouseEvent, columnId: string) => void; // New prop for resize start handler
  headCells: HeadCell[];
  onFilterChange: (columnId: string, selectedOptions: string[]) => void; // New prop for filter change
  activeFilters: { [key: string]: string[] }; // New prop to pass active filters
  onToggleFilter: (columnId: string | null) => void; // New prop to toggle filter visibility
  activeFilterColumn: string | null; // New prop to indicate which column's filter is open
  getUniqueColumnOptions: (columnId: string) => string[];
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    order,
    orderBy,
    onRequestSort,
    columnWidths,
    startResizing,
    headCells,
    onFilterChange,
    activeFilters,
    onToggleFilter,
    activeFilterColumn,
    getUniqueColumnOptions,
  } = props;
  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };
  return (
    <TableHead sx={{ borderRadius: 5 }}>
      <TableRow sx={{ borderRadius: 5 }}>
        {headCells.map((headCell, index) => {
          const isFilterActive =
            activeFilters[headCell.id] && activeFilters[headCell.id].length > 0;
          const isFilterDropdownOpen = activeFilterColumn === headCell.id;
          return (
            <TableCell
              key={headCell.id}
              align={"center"}
              padding={"normal"}
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{

  boxShadow: `
    0px -2px 4px 0px rgba(255, 255, 255, 0.4) inset,
    0px 2px 4px 0px rgba(255, 255, 255, 0.2) inset
  `,
              backgroundColor: "transparent",
              backdropFilter: "blur(30px)",
                p: 1,
                fontSize: "12px",
                borderRight: "2px solid #ffffffff",
                color: "#ffffffff",
                "&:last-child": {
                  borderRight: "none",
                },

                  borderBottom: "none",
                minWidth: `${headCell.label.length * 8 + 40}px`,
                position: "relative",
                width: columnWidths[headCell.id],
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {isFilterDropdownOpen ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CustomAutoComplete
                    options={getUniqueColumnOptions(headCell.id)}
                    value={activeFilters[headCell.id] || []}
                    onChange={(event, newValue) =>
                      onFilterChange(headCell.id, newValue)
                    }
                    placeholder={`Filter by ${headCell.label}`}
                    PaperStyle={{ width: "200px" ,

  backgroundColor: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(10px)",           
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",  
  color: "#ffffff",                       
  borderRadius: "8px",
  padding: "4px",





                      
                    }} // Example style
                    TextFieldSx={{
                      "& .MuiInputBase-root": {
                        height: "36px", // Adjust height to fit header
                     
                      },
                      "& .MuiInputBase-input": {
                        padding: "4px 8px", // Adjust padding
                       
                      },

                      
                    }}
                    error={false}
                    disableClearable // Disable default clear as we have our own X
                    // Ensure the autocomplete input doesn't trigger sorting
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  />
                  <FontAwesomeIcon
                    icon={faTimesCircle}
                    onClick={() => {
                      onToggleFilter(null); // Close the filter dropdown
                      onFilterChange(headCell.id, []); // Clear the filter for this column
                    }}
                    style={{ cursor: "pointer", color: "gray" }}
                  />
                </Box>
              ) : (
                <>
                  <TableSortLabel
                    active={orderBy === headCell.id}
                    direction={orderBy === headCell.id ? order : "asc"}
                    onClick={createSortHandler(headCell.id)}
                  >
                    <Box
                      sx={{
                        borderBottom: isFilterActive
                          ? "2px solid #F3F6FD"
                          : "none",
                      }}
                    >
                      {headCell.label}
                    </Box>
                    {orderBy === headCell.id ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                  <FontAwesomeIcon
                    icon={faSortDown}
                    style={{
                      color: "#ffffffff",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // Always prevent sort from firing when clicking this icon

                      onToggleFilter(headCell.id); // This is for faSortDown
                    }}
                  />
                </>
              )}
              {/* Resize Handle */}
              {index < headCells.length - 1 && ( // Don't add a handle for the last column
                <Box
                  component="span"
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: "8px", // Width of the draggable area
                    cursor: "col-resize",
                    zIndex: 1,
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.2)",
                    },
                  }}
                  onMouseDown={(e) => startResizing(e, headCell.id)}
                />
              )}
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}
interface EnhancedTableToolbarProps {
  numSelected: number;
}

export default function AnalyticsTable(props) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("Filename");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [activeRowId, setActiveRowId] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  // --- New State for Filtering ---
  const [activeFilters, setActiveFilters] = React.useState<{
    [key: string]: string[];
  }>({});
  const [activeFilterColumn, setActiveFilterColumn] = React.useState<
    string | null
  >(null); // Stores the id of the column whose filter is open

  // Process the API data to get the flattened rows
  const rows: FlatData[] = flattenErrorData(props?.data);
  console.log(rows, "rows");
  // for header data
  const headCells: HeadCell[] = generateHeadCells(rows);
  // --- Column Resizing State and Handlers ---
  const initialColumnWidths = React.useMemo(() => {
    // 1. Find the maximum label length among all headCells
    let maxLabelLength = 0;
    if (headCells.length > 0) {
      maxLabelLength = Math.max(...headCells.map((cell) => cell.label.length));
    }

    // 2. Calculate the base width using the maxLabelLength, with a minimum
    //    Adjust the multiplier (8) and base (40) as needed for your font size and padding
    const baseWidth = Math.max(100, maxLabelLength * 8 + 40);

    // 3. Create the widths object, applying this baseWidth to all columns
    const widths: { [key: string]: number } = {};
    headCells.forEach((cell) => {
      widths[cell.id] = baseWidth;
    });

    return widths;
  }, [headCells]);

  const [columnWidths, setColumnWidths] = React.useState<{
    [key: string]: number;
  }>(initialColumnWidths);
  const resizingColumnId = React.useRef<string | null>(null);
  const initialX = React.useRef<number>(0);
  const initialWidth = React.useRef<number>(0);
  const [isResizing, setIsResizing] = React.useState<string | null>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [modalMessage, setModalMessage] = React.useState("");
  const dispatch = useAppDispatch();

  const startResizing = React.useCallback(
    (e: React.MouseEvent, columnId: string) => {
      resizingColumnId.current = columnId;
      initialX.current = e.clientX;
      initialWidth.current = columnWidths[columnId];
      setIsResizing(columnId);

      // Add global event listeners for mousemove and mouseup
      window.addEventListener("mousemove", onResizing);
      window.addEventListener("mouseup", stopResizing);
      // Add class to body to prevent text selection during drag
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
    },
    [columnWidths]
  ); // Depend on columnWidths to capture the latest width

  const onResizing = React.useCallback((e: MouseEvent) => {
    if (resizingColumnId.current === null) return;

    const currentColumnId = resizingColumnId.current;
    const deltaX = e.clientX - initialX.current;
    const newWidth = Math.max(50, initialWidth.current + deltaX); // 50px min width

    setColumnWidths((prevWidths) => ({
      ...prevWidths,
      [currentColumnId]: newWidth,
    }));
  }, []);

  const stopResizing = React.useCallback(() => {
    resizingColumnId.current = null;
    setIsResizing(null);
    window.removeEventListener("mousemove", onResizing);
    window.removeEventListener("mouseup", stopResizing);
    document.body.style.userSelect = ""; // Reset user-select
    document.body.style.cursor = ""; // Reset cursor
  }, []);
  // --- End Column Resizing State and Handlers ---
  // --- Row Expansion State and Handlers ---
  const [expandedRowId, setExpandedRowId] = React.useState<string | null>(null);

  // Store refs to each row and the table itself
  const rowRefs = React.useRef<{ [key: string]: HTMLTableRowElement | null }>(
    {}
  );
  const tableRef = React.useRef<HTMLTableElement | null>(null); // Ref for the table

  const handleToggleExpand = React.useCallback((rowId: string) => {
    setExpandedRowId((prevExpandedRowId) => {
      // If the clicked row is already expanded, close it. Otherwise, expand the new row.
      return prevExpandedRowId === rowId ? null : rowId;
    });
  }, []);

  // Effect to handle clicks outside the expanded row
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        expandedRowId &&
        tableRef.current &&
        !tableRef.current.contains(event.target as Node)
      ) {
        setExpandedRowId(null); // Close the expanded row if click is outside the table
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expandedRowId]);

  const expandedRowData = React.useMemo(() => {
    if (expandedRowId) {
      return rows.find((row) => row.id === expandedRowId) || null;
    }
    return null;
  }, [expandedRowId, rows]);
  console.log(expandedRowData, "expandedrowdata");
  const getUniqueColumnOptions = React.useCallback(
    (columnIdToFilter: string): string[] => {
      // Start with all original rows
      let tempFilteredRows = [...rows];

      // Apply all active filters EXCEPT the one for the column we're currently opening
      Object.keys(activeFilters).forEach((filterColumnId) => {
        if (filterColumnId !== columnIdToFilter) {
          // Skip the current column's filter
          const selectedOptions = activeFilters[filterColumnId];
          if (selectedOptions && selectedOptions.length > 0) {
            tempFilteredRows = tempFilteredRows.filter((row) =>
              selectedOptions.includes(String(row[filterColumnId]))
            );
          }
        }
      });

      // Now, collect unique options from the `tempFilteredRows` for the target column
      const options = new Set<string>();
      tempFilteredRows.forEach((row) => {
        const value = row[columnIdToFilter];
        if (value !== undefined && value !== null) {
          options.add(String(value));
        }
      });
      return Array.from(options).sort();
    },
    [rows, activeFilters] // This function depends on original rows and all active filters
  );

  // Handle filter changes from CustomAutoComplete
  const handleFilterChange = (columnId: string, selectedOptions: string[]) => {
    setActiveFilters((prevFilters) => ({
      ...prevFilters,
      [columnId]: selectedOptions,
    }));
  };

  // Toggle filter dropdown visibility
  const handleToggleFilter = (columnId: string | null) => {
    setActiveFilterColumn(columnId);
  };

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    handleToggleExpand(id);
    setActiveRowId(id);

    if (activeFilterColumn) {
      handleToggleFilter(null);
    }
  };

  // Apply filters to the rows
  const filteredRows = React.useMemo(() => {
    let currentRows = [...rows];
    Object.keys(activeFilters).forEach((columnId) => {
      const selectedOptions = activeFilters[columnId];
      if (selectedOptions && selectedOptions.length > 0) {
        currentRows = currentRows.filter((row) =>
          selectedOptions.includes(String(row[columnId]))
        );
      }
    });
    return currentRows;
  }, [rows, activeFilters]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...filteredRows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, filteredRows]
  );
  const handleCreateTicket = (data, title) => {
    TicketCreation({
      data,
      title,
      setModalMessage,
      setShowModal,
      setIsLoading,
      dispatch,
    });
  };
const gradientStyle = {
   cursor: "pointer",
  backdropFilter : "blur(30px)",
  background: "linear-gradient(90deg, rgba(255, 255, 255, 0.025) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0.025) 100%)",
};

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", backgroundColor: "transparent" }}>
        <TableContainer ref={tableRef} sx={{ marginBottom: "10px" }}>
          <Table
            sx={{ minWidth: 650, tableLayout: "fixed" }}
            aria-labelledby="tableTitle"
            stickyHeader
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              columnWidths={columnWidths} // Pass widths to header
              startResizing={startResizing}
              headCells={headCells}
              onFilterChange={handleFilterChange} // Pass the new handler
              activeFilters={activeFilters} // Pass active filters
              onToggleFilter={handleToggleFilter} // Pass toggle function
              activeFilterColumn={activeFilterColumn} // Pass active filter column
              getUniqueColumnOptions={getUniqueColumnOptions}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isRowExpanded = expandedRowId === row.id;

                return (
                  <React.Fragment key={row.id}>
                    <TableRow
                      ref={(el) => (rowRefs.current[row.id] = el)}
                      hover
                      onClick={(event) => handleClick(event, row.id)}
                      tabIndex={-1}
                      key={row.id}
                      sx={{
                        ...(activeRowId === row.id && isRowExpanded
                          ? gradientStyle
                          : {
                            backgroundColor: "transparent",
                            backdropFilter : "blur(10px)",
                              "&:hover": {
                                ...gradientStyle,
                                transition: "background-image 0.3s ease-in-out",
                                "& .MuiTableCell-root": {
                                  color: "white",
                                },
                              },
                            }),
                      }}
                    >
                      {headCells.map((headCell) => {
                        const cellValue = String(row[headCell.id]);

                        return (
                          <TableCell
                            key={headCell.id}
                            align="center"
                            sx={{
                              borderBottom: "none",
                              border: "none",
                              fontSize: "12px",
                              color:"white",
                              fontWeight: 400,
                              width: columnWidths[headCell.id],
                              whiteSpace: "nowrap", // Keep text on one line
                              overflow: "hidden", // Hide overflowing text
                              textOverflow: "ellipsis",
                            }}
                          >
                            <Tooltip title={cellValue} enterDelay={200}>
                              <Box
                                component="span"
                                sx={{
                                  display: "inline-block", // Occupy full cell width
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  padding: 1,
                                }}
                              >
                                {cellValue}
                              </Box>
                            </Tooltip>
                          </TableCell>
                        );
                      })}
                    </TableRow>

                    <TableRow>
                      <TableCell
                        style={{ paddingBottom: 0, paddingTop: 0 }}
                        colSpan={headCells.length} // Span across all columns
                      >
                        <Collapse
                          in={isRowExpanded}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box
                            sx={{
                              padding: 1,
                              boxSizing: "border-box",
                              width: "61.3vw",
                              border: "0.5px solid",
 borderImageSource: "linear-gradient(96.43deg, rgba(255, 255, 255, 0.025) 0.38%, rgba(255, 255, 255, 0.5) 50.19%, rgba(255, 255, 255, 0.025) 100%)",
  boxShadow: `
    0px -2px 4px 0px rgba(255, 255, 255, 0.4) inset,
    0px 2px 4px 0px rgba(255, 255, 255, 0.2) inset
  `,
  backdropFilter: "blur(30px)"

                            }}
                          >
                            {((expandedRowData?.hasOwnProperty("KEDB") &&
                              expandedRowData?.KEDB === "No") ||
                              (expandedRowData?.hasOwnProperty("Status") &&
                                expandedRowData?.Status === "UNHEALTHY") ||
                              (expandedRowData?.hasOwnProperty("path") &&
                                expandedRowData?.path !== "")) && (
                              <Box sx={{ justifySelf: "end" }}>
                                <button
                                  className="btn  btn-sm create_ticket_btn_gradient"
                                  type="button"
                                  // onClick={() => {
                                  onClick={() =>
                                    handleCreateTicket(
                                      expandedRowData,
                                      props?.case
                                    )
                                  }
                                  //   <TicketCreation  data={expandedRowData} title={props?.case} />
                                  //   console.log("Create Ticket clicked");
                                  // }}
                                >
                                  Create Ticket
                                </button>
                              </Box>
                            )}

                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                maxHeight: "180px",
                                overflowY: "auto",
                                paddingRight: "10px",
                                "&::-webkit-scrollbar-thumb": {
                                  backgroundColor: "#bdbdbd",
                                  borderRadius: "11px",
                                  cursor: "pointer",
                                },
                              }}
                            >
                              {Object.entries(expandedRowData || {}).map(
                                ([key, value]) => {
                                  if (key === "id") return null;

                                  return (
                                    <Box
                                      key={key}
                                      sx={{
                                        marginBottom: "8px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between", // spread content across row
                                        whiteSpace: "pre-wrap",
                                        wordBreak: "break-word",
                                      }}
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "baseline",
                                          flexGrow: 1,
                                        }}
                                      >
                                        <strong
                                          style={{
                                            color: "#ffffffff",
                                            fontSize: "12px",
                                            paddingRight: "5px",
                                            flexShrink: 0,
                                          }}
                                        >
                                          {key
                                            .replace(/([A-Z])/g, " $1")
                                            .trim()}
                                          :
                                        </strong>
                                        <span
                                          style={{
                                            color: "#ffffffff",
                                            fontSize: "12px",
                                          }}
                                        >
                                          {String(value)}
                                        </span>
                                      </Box>
                                    </Box>
                                  );
                                }
                              )}
                            </Box>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={headCells.length} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <PopUpModal
        show={showModal}
        modalMessage={modalMessage}
        onHide={() => setShowModal(false)}
      />
      <AnalyticsLoader isLoading={isLoading} />
    </Box>
  );
}
