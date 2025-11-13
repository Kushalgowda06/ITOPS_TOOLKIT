import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Autocomplete,
  CircularProgress,
  Snackbar,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import { CloudUpload, AttachFile } from "@mui/icons-material";
import HeaderBar from "../AksCluster/TitleHeader";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";

interface ChangeRequestForm {
  nameOfChange: string;
  purposeOfChange: string;
  configurationItem: string;
  operatingSystem: string;
  uploadImage?: File;
}

interface ChangeDetailsForm {
  shortDescription: string;
  description: string;
  implementationPlan: string;
  backoutPlan: string;
  testPlan: string;
  changeModel: string;
  impactAnalysis: string;
}

const ChangeAssist: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChangeLoading, setChangeIsLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [createChange, setCreateChange] = useState<string>("");
  const [toastSeverity, setToastSeverity] = useState<
    "success" | "error" | "info"
  >("info");
  const [show, setShow] = useState(false);

  const [activeTab, setActiveTab] = useState(0);
  const categories = ["Details ", "Planning ", "Analysis "];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ChangeRequestForm>({
    defaultValues: {
      nameOfChange: "",
      purposeOfChange: "",
      configurationItem: "",
      operatingSystem: "",
    },
  });

  const {
    register: registerDetails,
    handleSubmit: handleSubmitDetails,
    control: controlDetails,
    formState: { errors: errorsDetails },
    reset: resetDetails,
    setValue: setValueDetails,
  } = useForm<ChangeDetailsForm>({
    defaultValues: {
      shortDescription: "",
      description: "",
      implementationPlan: "",
      backoutPlan: "",
      testPlan: "",
      changeModel: "",
      impactAnalysis: "",
    },
  });

  const [configurationItem, setConfigurationItem] = useState<string>("");
  const changeModelOptions = ["Standard", "Normal", "Emergency"];

  const onSubmit = async (data: ChangeRequestForm) => {
    setIsLoading(true);

    try {
      // Prepare payload
      const payload = {
        change_title: data.nameOfChange,
        change_purpose: data.purposeOfChange,
        config_items: data.configurationItem,
        os_info: data.operatingSystem,
        uploaded_files: uploadedFile ? uploadedFile.name : "",
      };
      setConfigurationItem(data.configurationItem);
      console.log("Sending payload:", payload);

      // Make API call with authentication
      const response = await axios.post(
        "https://backend.autonomousitopstoolkit.com/change_management/api/v1/draft_change_prompt/",
        payload,
        {
          auth: {
            username: "rest",
            password: "!fi$5*4KlHDdRwdbup%ix",
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data);
      setApiResponse(response.data);

      // Populate the Change Details form with API response
      const changeDetails = response.data.output?.data?.change_details;
      const impactAnalysis = response.data.output?.data?.impact_analysis;

      if (changeDetails) {
        setValueDetails(
          "shortDescription",
          changeDetails.short_description || ""
        );
        setValueDetails("description", changeDetails.description || "");
        setValueDetails(
          "implementationPlan",
          changeDetails.implementation_plan || ""
        );
        setValueDetails("backoutPlan", changeDetails.backout_plan || "");
        setValueDetails("testPlan", changeDetails.test_plan || "");
        setValueDetails("changeModel", changeDetails.chg_model || "");
      }

      if (impactAnalysis) {
        setValueDetails("impactAnalysis", impactAnalysis || "");
      }

      // Show success toast
      // setToastMessage("Change request generated successfully!");
      // setToastSeverity("success");
      // setToastOpen(true);
    } catch (error: any) {
      console.error("API Error:", error);

      // Show error toast
      setToastMessage(
        error.response?.data?.message ||
          "Failed to generate change request. Please try again."
      );
      setToastSeverity("error");
      setToastOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  const onSubmitChangeDetails = async (data: ChangeDetailsForm) => {
    setChangeIsLoading(true);

    try {
      const payload = {
        // uploaded_files: uploadedFile, // Ensure uploaded file is included
        cmdb_ci: configurationItem,
        short_description: data.shortDescription,
        description: data.description,
        implementation_plan: data.implementationPlan,
        backout_plan: data.backoutPlan,
        test_plan: data.testPlan,
        chg_model: data.changeModel,
        risk_impact_analysis: data.impactAnalysis,
      };

      const response = await axios.post(
        "https://cisicmpengineering1.service-now.com/api/now/table/change_request",
        payload,
        {
          auth: { username: "ServicenowAPI", password: "Qwerty@123" },
          headers: { "Content-Type": "application/json" },
        }
      );

      setCreateChange(response.data.result.number);
      const sys_id = response.data.result.sys_id;

      if (uploadedFile && sys_id) {
        // File upload after change creation
        const formData = new FormData();
        formData.append("table_name", "change_request");
        formData.append("table_sys_id", sys_id);
        formData.append("uploadFile", uploadedFile);

        await axios.post(
          "https://cisicmpengineering1.service-now.com/api/now/attachment/upload",
          formData,
          {
            auth: { username: "ServicenowAPI", password: "Qwerty@123" },
            headers: { "Content-Type": "multipart/form-data" }, // Correct content type for file upload
          }
        );
      }

      setToastMessage("Change created successfully!");
      setToastSeverity("success");
      setToastOpen(true);
    } catch (error) {
      setToastMessage(
        error.response?.data?.message || "Failed to create change."
      );
      setToastSeverity("error");
      setToastOpen(true);
    } finally {
      setChangeIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <div className="change-assist-container">
      {/* Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={6000000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleToastClose}
          severity={toastSeverity}
          className="glass-notice-card"
          variant="filled"
          sx={{
            // display: "flex",
            top: "50px",
            // flexDirection: "column",
            // alignItems: "center",
            padding: "16px 24px",
            borderRadius: "8px",
            backdropFilter: "blur(5px)", // Glassmorphism effect
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "white", // Keep the text white for contrast
            width: "400px", // Adjust the width as needed
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", fontSize: "16px" }}
            >
              Change created successfully!
            </Typography>
          </Box>

          <Typography variant="body2" sx={{ mb: 1, fontSize: "16px" }}>
            Change Request Number:{" "}
            <Typography
              component="span"
              sx={{ fontWeight: "bold", fontSize: "13px" }}
            >
              {createChange}
            </Typography>
          </Typography>

          {/* <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <Button
            size="small"
            onClick={() => window.open("https://yourlink.com", "_blank")}
            sx={{ color: "white" }}
          >
            View Change Request
          </Button>
          <IconButton onClick={handleToastClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box> */}
        </Alert>
      </Snackbar>
      {/* <Snackbar
        open={toastOpen}
        autoHideDuration={600000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleToastClose}
          severity={toastSeverity}
          className="glass-notice-card"
          variant="filled"
          sx={{
            // backdropFilter: "blur(10px)",
            // border: "1px solid rgba(255, 255, 255, 0.2)",
            // color: "white",
             display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "16px 24px",
          borderRadius: "8px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "white",
          width: "300px", // Adjust based on your design
          }}
        >
          {toastMessage}
          {createChange}
        </Alert>
      </Snackbar> */}

      <div className="row g-0 h-100 pt-1">
        {/* Left Column - Form */}
        <div className="col-md-5 d-flex align-items-start justify-content-start">
          <div className="change-assist-glass-form">
            {/* Header */}
            <HeaderBar
              content="Create Change Request"
              position="left"
              padding="px-3"
              partialBorder={true}
            />

            {/* Form */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="change-form-content"
            >
              {/* Name of the change */}
              <div className="form-field-group ">
                <Typography className="field-label">
                  *Name of the change
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter change name"
                  className="glass-form-input"
                  {...register("nameOfChange", {
                    required: "Name of change is required",
                  })}
                  error={!!errors.nameOfChange}
                  helperText={errors.nameOfChange?.message}
                />
              </div>

              {/* Purpose of the change */}
              <div className="form-field-group">
                <Typography className="field-label">
                  *Purpose of the change
                </Typography>
                <TextField
                  fullWidth
                  // multiline
                  // rows={1}
                  variant="outlined"
                  placeholder="Describe the purpose of this change"
                  className="glass-form-input"
                  {...register("purposeOfChange", {
                    required: "Purpose of change is required",
                  })}
                  error={!!errors.purposeOfChange}
                  helperText={errors.purposeOfChange?.message}
                />
              </div>

              {/* Configuration Item */}
              <div className="form-field-group">
                <Typography className="field-label">
                  *Configuration Item
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter configuration item"
                  className="glass-form-input"
                  {...register("configurationItem", {
                    required: "Configuration item is required",
                  })}
                  error={!!errors.configurationItem}
                  helperText={errors.configurationItem?.message}
                />
              </div>

              {/* Operating System */}
              <div className="form-field-group">
                <Typography className="field-label">
                  Operating System (Optional)
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter operating system"
                  className="glass-form-input"
                  {...register("operatingSystem")}
                />
              </div>

              {/* Upload Image */}
              <div className="form-field-group">
                <Typography className="field-label">
                  Upload Image (Optional)
                </Typography>
                <div className="upload-area">
                  <input
                    type="file"
                    id="file-upload"
                    accept=".png,.jpg,.jpeg,.gif"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                  <label htmlFor="file-upload" className="upload-label">
                    <div className="upload-content">
                      <CloudUpload className="upload-icon" />
                      <Typography className="upload-text">
                        {uploadedFile
                          ? uploadedFile.name
                          : "Click to upload an image or drag and drop"}
                      </Typography>
                      <Typography className="upload-subtext">
                        PNG, JPG, JPEG upto 10MB
                      </Typography>
                    </div>
                  </label>
                </div>
              </div>

              {/* Error Message */}

              {/* Generate Change Button */}
              <div className="d-flex justify-content-end mt-5 pt-5 mb-2">
                <Button
                  type="submit"
                  className="generate-change-btn"
                  variant="contained"
                  size="small"
                  disabled={isLoading}
                  onClick={() => setShow(true)}
                >
                  {isLoading ? (
                    <>
                      <CircularProgress
                        size={16}
                        sx={{
                          color: "rgba(255, 255, 255, 0.8)",
                          marginRight: "8px",
                        }}
                      />
                      Generating...
                    </>
                  ) : (
                    "Generate Change"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column - Create Change Details */}
        <div className="col-md-7 change-assist-bg-column">
          <div className="change-assist-bg-image">
            {apiResponse && (
              <div className="change-details-glass-form animate-slide-in">
                <HeaderBar
                  content="Create Change Details"
                  position="center"
                  padding="px-3"
                  partialBorder={true}
                />
                <div className="genai-tabs mt-1 py-1">
                  <Tabs
                    sx={{ minHeight: "32px" }}
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    indicatorColor="primary"
                    className="genai-tabs-wrapper tab_bg text-white"
                  >
                    {categories.map((category, index) => (
                      <Tab key={index} label={category} />
                    ))}
                  </Tabs>
                </div>
                <form
                  onSubmit={handleSubmitDetails(onSubmitChangeDetails)}
                  className="change-form-content"
                >
                  {activeTab === 0 && (
                    <>
                      {/* Details Tab */}
                      <div className="form_scroll">
                        <div className="form-field-group ">
                          <Typography className="field-label">
                            Short Description
                          </Typography>
                          <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Enter short description"
                            className="glass-form-input"
                            {...registerDetails("shortDescription")}
                          />
                        </div>

                        <div className="form-field-group">
                          <Typography className="field-label">
                            Description
                          </Typography>
                          <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Enter detailed description"
                            className="glass-form-input"
                            {...registerDetails("description")}
                          />
                        </div>

                        <div className="form-field-group">
                          <Typography className="field-label">
                            Change Type
                          </Typography>
                          <Controller
                            name="changeModel"
                            control={controlDetails}
                            rules={{ required: "Change Type is required" }}
                            render={({ field, fieldState }) => (
                              <Autocomplete
                                options={changeModelOptions}
                                getOptionLabel={(option) => option}
                                value={field.value || ""}
                                onChange={(_, value) => field.onChange(value)}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    variant="outlined"
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                    className="glass-form-input"
                                    placeholder="Select Change Model"
                                  />
                                )}
                                clearIcon={
                                  <IconButton sx={{ fontSize: 16 }}>
                                    {" "}
                                    {/* Reduces the size of the close icon */}
                                    <CloseIcon
                                      sx={{
                                        fontSize: 13,
                                        color: "white",
                                        borderRadius: "4px",
                                      }}
                                    />
                                  </IconButton>
                                }
                                componentsProps={{
                                  paper: {
                                    sx: {
                                      fontSize: "10px", //  Just this changes the dropdown option font size
                                    },
                                  },
                                }}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 1 && (
                    <>
                      {/* Planning Tab */}
                      <div className="form_scroll">
                        <div className="form-field-group">
                          <Typography className="field-label">
                            Test Plan
                          </Typography>
                          <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Enter test plan"
                            className="glass-form-input"
                            multiline
                            // rows={2}
                            {...registerDetails("testPlan")}
                          />
                        </div>

                        <div className="form-field-group">
                          <Typography className="field-label">
                            Backout Plan
                          </Typography>
                          <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Enter backout plan"
                            className="glass-form-input"
                            multiline
                            // rows={2}
                            {...registerDetails("backoutPlan")}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 2 && (
                    <>
                      {/* Analysis Tab */}
                      <div className="form_scroll">
                        <div className="form-field-group">
                          <Typography className="field-label">
                            Impact Analysis
                          </Typography>
                          <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Enter impact analysis"
                            className="glass-form-input"
                            multiline
                            // rows={2}
                            {...registerDetails("impactAnalysis")}
                          />
                        </div>

                        {/* If you want to add 'conflect' field, uncomment this and add to your form state */}
                        {/* <div className="form-field-group">
        <Typography className="field-label">Conflict</Typography>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter conflict details"
          className="glass-form-input"
          multiline
          rows={2}
          {...registerDetails("conflect")}
        />
      </div> */}
                      </div>
                    </>
                  )}

                  {/* Action Buttons (Always visible) */}
                  <div className="d-flex justify-content-end gap-3 mt-1">
                    <Button
                      className="cancel-change-btn"
                      variant="outlined"
                      size="small"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="create-change-btn"
                      variant="contained"
                      size="small"
                      type="submit"
                    >
                      {isChangeLoading ? (
                        <>
                          <CircularProgress
                            size={16}
                            sx={{
                              color: "rgba(255, 255, 255, 0.8)",
                              marginRight: "8px",
                            }}
                          />
                          Creating...
                        </>
                      ) : (
                        "Create Change"
                      )}
                    </Button>
                  </div>
                </form>

                {/* <form
                  onSubmit={handleSubmitDetails(onSubmitChangeDetails)}
                  className="change-form-content"
                >
                  <div className="form-field-group">
                    <Typography className="field-label">
                      Short Description
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Enter short description"
                      className="glass-form-input"
                      // multiline
                      {...registerDetails("shortDescription")}
                    />
                  </div>

                  <div className="form-field-group">
                    <Typography className="field-label">Description</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Enter detailed description"
                      className="glass-form-input"
                      // multiline
                      // rows={1}
                      {...registerDetails("description")}
                    />
                  </div>

                  <div className="form-field-group">
                    <Typography className="field-label">
                      Implementation Plan
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Enter implementation plan"
                      className="glass-form-input"
                      multiline
                      rows={2}
                      {...registerDetails("implementationPlan")}
                    />
                  </div>

                  <div className="form-field-group">
                    <Typography className="field-label">Backup Plan</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Enter backup plan"
                      className="glass-form-input"
                      multiline
                      rows={2}
                      {...registerDetails("backoutPlan")}
                    />
                  </div>

                  <div className="form-field-group">
                    <Typography className="field-label">Test Plan</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Enter test plan"
                      className="glass-form-input"
                      multiline
                      rows={2}
                      {...registerDetails("testPlan")}
                    />
                  </div>

                  <div className="form-field-group">
                    <Typography className="field-label">
                      Change Model
                    </Typography>
                    <Controller
                      name="changeModel"
                      control={controlDetails}
                      rules={{ required: "Change model is required" }}
                      render={({ field, fieldState }) => (
                        <Autocomplete
                          options={changeModelOptions}
                          getOptionLabel={(option) => option}
                          value={field.value || ""}
                          onChange={(_, value) => field.onChange(value)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              // label="Change Model"
                              variant="outlined"
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                              className="glass-form-input"
                              placeholder="Select Change Model"
                            />
                          )}
                        />
                      )}
                    />
                  </div>

                  <div className="form-field-group">
                    <Typography className="field-label">
                      Impact Analysis
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Enter impact analysis"
                      className="glass-form-input"
                      multiline
                      rows={2}
                      {...registerDetails("impactAnalysis")}
                    />
                  </div>

                  <div className="d-flex justify-content-end gap-3 mt-4">
                    <Button
                      className="cancel-change-btn"
                      variant="outlined"
                      size="small"
                    >
                      Cancel
                    </Button>
                    <Button
                      className="create-change-btn"
                      variant="contained"
                      size="small"
                      type="submit"
                    >
                      {isChangeLoading ? (
                        <>
                          <CircularProgress
                            size={16}
                            sx={{
                              color: "rgba(255, 255, 255, 0.8)",
                              marginRight: "8px",
                            }}
                          />
                          Creating...
                        </>
                      ) : (
                        "Create Change"
                      )}
                    </Button>
                  </div>
                </form> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeAssist;
