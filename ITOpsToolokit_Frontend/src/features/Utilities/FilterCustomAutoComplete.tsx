import React, {  useEffect } from "react";
import {
  styled,
  Box,
  Popper,
  Checkbox,
  TextField,
  Autocomplete,
  ClickAwayListener,
  AutocompleteCloseReason,
  Chip,
} from "@mui/material";
import { Tooltip } from "@mui/material";
import { capitalizeFirstLetter } from "../Utilities/capitalise";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const PopperStyledComponent = styled(Popper)(({ theme }) => ({
  border: `1px solid ${
    theme.palette.mode === "light" ? "rgba(149, 157, 165, 0.2)" : "rgb(1, 4, 9)"
  }`,
}));

const FilterCustomAutoComplete = ({
  options,
  value,
  onChange,
  setSelectedCloud,
  setSelectedSubscription,
  setSelectedApplication,
  setSelectedResourceGroup,
  setSelectedBu,
  selectCategory,
  placeholder,
  TextFieldSx = {},
  error,
  // PaperComponent = ({ children }) => <span className='bg-white'>{children}</span>,
  renderTagsStyle = {},
  limitTags = 1, // Default limit to 3 tags
  id = "multiple-limit-tags",
  ...props
}) => {
  const [checkAll, setCheckAll] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  console.log("options", options);
  const checkOptionChange = (
    opt: any,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("opt", opt, value);
    setCheckAll(event.target.checked);
    if (event.target.checked) {
      if (selectCategory === "SubscriptionID") {
        onChange(options);
      }
      if (selectCategory === "Cloud") {
        onChange(options);
      }
      if (selectCategory === "Application") {
        onChange(options);
      }
      if (selectCategory === "ResourceGroup") {
        onChange(options);
      }
      if (selectCategory === "BU") {
        onChange(options);
      }
    } else {
      if (selectCategory === "Cloud") {
        let exist;
        if (value && value.length > 0) {
          exist = value.filter((item: any) => {
            return item !== opt;
          });
          console.log("exist", exist);
        }
        if (exist && exist.length > 0) {
          setSelectedCloud(exist);
        } else {
          // setSelectedCloud([]);
        }
      }
      if (selectCategory === "Application") {
        let exist;
        if (value && value.length > 0) {
          exist = value.filter((item: any) => {
            return item !== opt;
          });
          console.log("exist", exist);
        }
        if (exist && exist.length > 0) {
          setSelectedApplication(exist);
        } else {
          // setSelectedApplication([]);
        }
      }
      if (selectCategory === "ResourceGroup") {
        let exist;
        if (value && value.length > 0) {
          exist = value.filter((item: any) => {
            return item !== opt;
          });
          console.log("exist", exist);
        }
        if (exist && exist.length > 0) {
          setSelectedResourceGroup(exist);
        } else {
          // setSelectedResourceGroup([]);
        }
      }
      if (selectCategory === "BU") {
        let exist;
        if (value && value.length > 0) {
          exist = value.filter((item: any) => {
            return item !== opt;
          });
          console.log("exist", exist);
        }
        if (exist && exist.length > 0) {
          setSelectedBu(exist);
        } else {
          // setSelectedBu([]);
        }
      }
    }
  };

  const checkAllChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckAll(event.target.checked);
    if (event.target.checked) {
      if (selectCategory === "SubscriptionID") {
        onChange(options);
      }
      if (selectCategory === "Cloud") {
        onChange(options);
      }
      if (selectCategory === "Application") {
        onChange(options);
      }
      if (selectCategory === "ResourceGroup") {
        onChange(options);
      }
      if (selectCategory === "BU") {
        onChange(options);
      }
    } else {
      if (selectCategory === "SubscriptionID") {
        setSelectedSubscription([]);
      }
      if (selectCategory === "Cloud") {
        setSelectedCloud([]);
      }
      if (selectCategory === "Application") {
        setSelectedApplication([]);
      }
      if (selectCategory === "ResourceGroup") {
        setSelectedResourceGroup([]);
      }
      if (selectCategory === "BU") {
        setSelectedBu([]);
      }
    }
  };

  const handleClickAway = (e) => {
    console.log("Handle Click Away");
    setOpen(false);
    setCheckAll(false);
  };
  useEffect(() => {
    function handlekeydownEvent(event) {
      setSelectedCloud([]);
    }
    const close = document.getElementsByClassName(
      "MuiAutocomplete-clearIndicator"
    )[0];
    if (close) {
      close.addEventListener("click", () => {
        console.log("finall");
      });
      return () => {
        document.removeEventListener("click", handlekeydownEvent);
      };
    }
  }, []);

  return (
    <ClickAwayListener className="form-control" onClickAway={handleClickAway}>
      <Box>
        <Autocomplete
          multiple
          disableCloseOnSelect
          limitTags={3}
          id="checkboxes-tags-demo"
          options={options}
          value={value}
          open={open}
          onChange={onChange}
          onClose={(e: any, reason: AutocompleteCloseReason) => {
           
            if (reason === "escape") {
              setOpen(false);
            }
          }}
          onOpen={() => {
            setOpen(true);
          }}
          PopperComponent={(param: any) => (
            <PopperStyledComponent {...param}>
              <Box
                sx={{
                  backgroundColor: "white",
                  height: "35px",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                <Checkbox
                  checked={checkAll}
                  onChange={checkAllChange}
                  id="check-all"
                  sx={{ marginRight: "4px" }}
                  size={"small"}
                  onMouseDown={(e) => e.preventDefault()}
                />
                Select All
              </Box>
              <Box {...param} />
            </PopperStyledComponent>
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                size="small"
                className="text-white mx-1 mb-1 bg-primary"
                deleteIcon={
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    className="text-white treeview-p"
                  />
                }
              />
            ))
          }
          getOptionLabel={(option) => option}
          renderOption={(props, option, { selected }) => (
            <li {...props} className="ps-2 pt-0">
              <Checkbox
                icon={<Checkbox size="small" />}
                checked={selected || checkAll}
                className="text-primary me-2 pt-0"
                size={"small"}
                onChange={(e) => checkOptionChange(option, e)}
                sx={{ width: 0 }}
              />
              <Tooltip
                title={capitalizeFirstLetter(option)}
                placement="top"
                arrow={true}
                followCursor={true}
                PopperProps={{
                  style: { zIndex: 9999 },
                }}
              >
                <span className=" cursor-pointer">
                  {option.substring(0, 14)}
                  {option.length > 10 ? "..." : ""}
                </span>
              </Tooltip>
            </li>
          )}
          style={{ width: "100%" }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={placeholder}
              InputProps={{
                ...params.InputProps,
                type: "search",
              }}
              sx={TextFieldSx}
              error={error}
            />
          )}
        />
      </Box>
    </ClickAwayListener>
  );
};

export default FilterCustomAutoComplete;
