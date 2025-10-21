import React, { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FormData, Errors } from './types';
import CustomSelect from './CustomSelect';
import DateTimeInput from './DateTimeInput';
import RadioButtonGroup from './RadioButtonGroup';
import formstyles from './formstyles';

function ImplementationGroupForm() {
  // Form data state
  const [formData, setFormData] = useState<FormData>({
    groupName: '',
    description: '',
    application: '',
    environment: '',
    os: '',
    server: '',
    serverId: '',
    changeRequestType: '',
    service: '',
    changeOwner: '',
    assignmentGroup: '',
    assignmentGroupId: '',
    cloud: 'AWS',
    provider: 'Test',
  });

  // UI state
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  // Radio button states
  const [isApprovalPatch, setIsApprovalPatch] = useState(false);
  const [isApprovalReboot, setIsApprovalReboot] = useState(false);
  const [isManualPatch, setIsManualPatch] = useState(false);
  const [isManualReboot, setIsManualReboot] = useState(false);
  const [isChangeRequest, setIsChangeRequest] = useState(false);

  // Date states
  const [patchStartDate, setPatchStartDate] = useState(new Date());
  const [patchEndDate, setPatchEndDate] = useState(new Date());
  const [crStartDate, setCrStartDate] = useState(new Date());
  const [crEndDate, setCrEndDate] = useState(new Date());

  // Recurrence states
  const [recurrenceEnabled, setRecurrenceEnabled] = useState(false);
  const [recurrencePattern, setRecurrencePattern] = useState("Weekly");
  const [recurrenceWeekDay, setRecurrenceWeekDay] = useState("Monday");
  const [monthlyType, setMonthlyType] = useState("day");
  const [monthlyDay, setMonthlyDay] = useState("0");
  const [monthlyWeek, setMonthlyWeek] = useState(1);
  const [monthlyWeekDay, setMonthlyWeekDay] = useState("Monday");
  const [weeklyEndDate, setWeeklyEndDate] = useState(new Date());
  const [monthlyEndDate, setMonthlyEndDate] = useState(new Date());
  const [weeklyNoEndDate, setWeeklyNoEndDate] = useState(false);
  const [monthlyNoEndDate, setMonthlyNoEndDate] = useState(false);

  // Options for select fields
  const applicationOptions = ['gauntlet', 'mjollnir', 'hydra', 'hcm', 'ultron'];
  const environmentOptions = ['Dev', 'QA', 'Production'];
  const osOptions = ['Windows', 'Linux', 'MacOS'];
  const changeRequestTypeOptions = ['Normal', 'Standard'];
  const serviceOptions = ['SAP Enterprise Services', 'SAP Financial Accounting', 'SAP Materials Management', 'SAP Controlling', 'SAP Sales and Distribution', 'SAP Human Resources', 'SAP Payroll', 'SAP Labor Distribution'];
  const serverOptions = ['Service-now Production Sacramento', 'Service-now Production San Diego', 'ec2-35-183-208-18.ca-central-1.compute.amazonaws.com', 'DatabaseServer2', 'VMWARE-SD-04', 'VMWARE-SD-07', 'INSIGHT-NY-03', 'AS400', 'Car-1', 'Car-2', 'Car-3', 'Webserver FLX', 'Car-4', 'SD1', 'FileServerFloor2', 'FileServerFloor1', 'MailServerUS', 'ApplicationServerPeopleSoft'];
  const serverIdOptions = ['106c5c13c61122750194a1e96cfde951', '1072335fc611227500c0267a21be5dc5', '1473e6ff3b63421057a74f0864e45acf', '14a9e27bc61122750037b90c4d34da38', '27e52cc8c0a8000b0067d0b66b8a66de', '27e59e75c0a8000b003b3fab4211d2c2', '27eabc4bc0a8000b0089fd512b3e8934', '3a63d606c611222500487ae00a5bf3b8', '6cabe993c611222500bb025775ec8732', '6cb10db5c611222500bf34f43d2ff189', '6ccab11cc611222500e1549797d1c1e5', '827b692d0ad337021abb72d3737ff401', '8d6916edc611222501dbb12bd683e36f', 'a9c68505c6112276017ee7d52f43e7c6', 'b0c25d1bc0a800090168be1bfcdcd759', 'b0c3437ac0a8000900433b8a412966aa', 'b0c4030ac0a8000900152e7a4564ca36c', 'b0cb50c3c0a8000900893e69d3c5885e'];
  const groupOptions = ['Windows Admins', 'Analytics Settings Managers', 'Virtual Provisioning Cloud Users', 'Customer Service Support', 'AnalyticsGroup', 'Application Development', 'Problem Analyzers', 'Business Application Registration Approval Group', 'Nimsoft desk', 'Incident Management', 'US Presidents Group 2'];
  const groupIdOptions = ['0053cb6a87e30a903d140f64dabb354d', '019ad92ec7230010393d265c95c260dd', '020c561337653000f5bf1f23dfbe5da6', '0270c251c3200200be647bfaa2d3aea6', '087ed2bfdb8fce5027293313e29619d5', '0a52d3dcd7011200f2d224837e6103f2', '0c4e7b573b331300ad3cc9bb34efc461', '0c5e2a7ce4001410f877ce457cda6b98', '10e39a5673500010c2e7660c4cf6a7ef', '12a586cd0bb23200ecfd818393673a30', '1be289a1eb32010045e1a5115206fea1'];
  const cloudOptions = ['AWS', 'Azure', 'GCP'];
  const weekOptions = [
    { value: 1, label: "First" },
    { value: 2, label: "Second" },
    { value: 3, label: "Third" },
    { value: 4, label: "Fourth" },
    { value: 5, label: "Last" }
  ];
  const weekDayOptions = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!formData.groupName) newErrors.groupName = 'Group name is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.application) newErrors.application = 'Application is required';
    if (!formData.environment) newErrors.environment = 'Environment is required';
    if (!formData.os) newErrors.os = 'OS is required';
    if (!formData.server) newErrors.server = 'Server is required';
    if (!formData.changeRequestType) newErrors.changeRequestType = 'Change request type is required';
    if (!formData.service) newErrors.service = 'Service is required';
    if (!formData.changeOwner) newErrors.changeOwner = 'Change owner is required';
    if (!formData.assignmentGroup) newErrors.assignmentGroup = 'Assignment group is required';
    if (!formData.cloud) newErrors.cloud = 'Cloud is required';
    if (!formData.provider) newErrors.provider = 'Provider is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    if (errors[id as keyof Errors]) {
      setErrors({
        ...errors,
        [id]: ''
      });
    }
  };

  const handleSelectChange = (id: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [id]: value
    });
    if (errors[id as keyof Errors]) {
      setErrors({
        ...errors,
        [id]: ''
      });
    }
  }

  const formatDateWithTime = (date: Date): string => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date: Date): string => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const formatTime = (date: Date): string => {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitSuccess(false);
      setSubmitError('');
      try {
        const postData = {
          GroupName: formData.groupName,
          Cloud: formData.cloud,
          OS: formData.os,
          Application: formData.application,
          Environment: formData.environment,
          Servers: formData.server,
          Service: formData.service,
          RebootRequired: isApprovalReboot ? "Yes" : "No",
          CRType: formData.changeRequestType,
          Provider: formData.provider,
          Description: formData.description,
          ShortDescription: formData.description,
          AssignmentGroup: formData.assignmentGroup,
          CrStartDate: recurrenceEnabled ? "" : formatDateWithTime(crStartDate),
          CrEndDate: recurrenceEnabled ? "" : formatDateWithTime(crEndDate),
          AffectedCI: formData.serverId,
          PatchStartDate: recurrenceEnabled ? "" : formatDateWithTime(patchStartDate),
          PatchEndDate: recurrenceEnabled ? "" : formatDateWithTime(patchEndDate),
          Recurrence: recurrenceEnabled,
          RecurrenceStartTime: formatTime(patchStartDate),
          RecurrenceEndTime: formatTime(patchEndDate),
          RecurrenceStartDate: formatDate(patchStartDate),
          RecurrenceEndDate: recurrencePattern === "Weekly"
            ? (weeklyNoEndDate ? "" : formatDate(weeklyEndDate))
            : (monthlyNoEndDate ? "" : formatDate(monthlyEndDate)),
          NoEndDate: recurrencePattern === "Weekly" ? weeklyNoEndDate : monthlyNoEndDate,
          Pattern: !recurrenceEnabled ? "" : recurrencePattern,
          WeekDay: !recurrenceEnabled ? "" : recurrenceWeekDay,
          MonthlyType: !recurrenceEnabled ? "" : monthlyType,
          RecurrenceDate: !recurrenceEnabled ? 0 : (monthlyType === "the" ? 0 : parseInt(monthlyDay)),
          MonthlyWeek: monthlyWeek,
          MonthlyWeekDay: monthlyType === "day" ? "" : monthlyWeekDay,
          WeekNumber: monthlyWeek,
          RecurrenceMonth: ''
        };

        const response = await axios.post('http://ec2-3-97-232-96.ca-central-1.compute.amazonaws.com:8000/group', postData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setSubmitSuccess(true);
        setFormData({
          groupName: '',
          description: '',
          application: '',
          environment: '',
          os: '',
          server: '',
          serverId: '',
          changeRequestType: '',
          service: '',
          changeOwner: '',
          assignmentGroup: '',
          assignmentGroupId: '',
          cloud: 'AWS',
          provider: formData.provider,
        });
      } catch (error) {
        console.error('Submission error:', error);
        setSubmitError('Failed to submit form. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      groupName: '',
      description: '',
      application: '',
      environment: '',
      os: '',
      server: '',
      serverId: '',
      changeRequestType: '',
      service: '',
      changeOwner: '',
      assignmentGroup: '',
      assignmentGroupId: '',
      cloud: 'AWS',
      provider: 'Test',
    });
    setErrors({});
  };

  const ScheduleProfileLayout = ({ handleClose }: { handleClose: () => void }) => (
    <div style={formstyles.modalOverlay}>
      <div style={formstyles.modalContent}>
        <h3 style={formstyles.modalTitle}>Schedule Profile</h3>

        {/* Pattern Selection */}
        <div style={formstyles.formGroup}>
          <label style={formstyles.label}>Pattern</label>
          <div style={formstyles.radioGroup}>
            <label style={formstyles.radioOption}>
              <input
                type="radio"
                value="Weekly"
                checked={recurrencePattern === "Weekly"}
                onChange={(e) => setRecurrencePattern(e.target.value)}
                style={formstyles.radio}
              />
              Weekly
            </label>
            <label style={formstyles.radioOption}>
              <input
                type="radio"
                value="Monthly"
                checked={recurrencePattern === "Monthly"}
                onChange={(e) => setRecurrencePattern(e.target.value)}
                style={formstyles.radio}
              />
              Monthly
            </label>
          </div>
        </div>

        {/* Weekly Pattern Options */}
        {recurrencePattern === "Weekly" && (
          <>
            <div style={formstyles.formGroup}>
              <label style={formstyles.label}>Week Day</label>
              <select
                style={formstyles.select}
                value={recurrenceWeekDay}
                onChange={(e) => setRecurrenceWeekDay(e.target.value)}
              >
                {weekDayOptions.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>
            <div style={formstyles.formGroup}>
              <label style={formstyles.label}>End Options</label>
              <div style={formstyles.radioGroup}>
                <label style={formstyles.radioOption}>
                  <input
                    type="radio"
                    checked={!weeklyNoEndDate}
                    onChange={() => setWeeklyNoEndDate(false)}
                    style={formstyles.radio}
                  />
                  End Date
                </label>
                <label style={formstyles.radioOption}>
                  <input
                    type="radio"
                    checked={weeklyNoEndDate}
                    onChange={() => setWeeklyNoEndDate(true)}
                    style={formstyles.radio}
                  />
                  No End Date
                </label>
              </div>
              {!weeklyNoEndDate && (
                <DatePicker
                  selected={weeklyEndDate}
                  onChange={(date: Date) => setWeeklyEndDate(date)}
                  dateFormat="yyyy-MM-dd"
                  minDate={new Date()}
                  customInput={
                    <input
                      style={formstyles.input}
                    />
                  }
                />
              )}
            </div>
          </>
        )}

        {/* Monthly Pattern Options */}
        {recurrencePattern === "Monthly" && (
          <div style={formstyles.formGroup}>
            <div style={formstyles.monthlyOptions}>
              <div style={formstyles.radioGroup}>
                <label style={formstyles.radioOption}>
                  <input
                    type="radio"
                    checked={monthlyType === "day"}
                    onChange={() => setMonthlyType("day")}
                    style={formstyles.radio}
                  />
                  Day
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={monthlyDay}
                    onChange={(e) => setMonthlyDay(e.target.value)}
                    style={{ ...formstyles.input, width: '60px', marginLeft: '10px' }}
                  />
                  of every month
                </label>
              </div>

              <div style={formstyles.radioGroup}>
                <label style={formstyles.radioOption}>
                  <input
                    type="radio"
                    checked={monthlyType === "the"}
                    onChange={() => setMonthlyType("the")}
                    style={formstyles.radio}
                  />
                  The
                  <select
                    value={monthlyWeek}
                    onChange={(e) => setMonthlyWeek(parseInt(e.target.value))}
                    style={{ ...formstyles.select, width: '100px', margin: '0 10px' }}
                  >
                    {weekOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={monthlyWeekDay}
                    onChange={(e) => setMonthlyWeekDay(e.target.value)}
                    style={{ ...formstyles.select, width: '100px', margin: '0 10px' }}
                  >
                    {weekDayOptions.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                  of every month
                </label>
              </div>
            </div>

            <div style={formstyles.formGroup}>
              <label style={formstyles.label}>End Options</label>
              <div style={formstyles.radioGroup}>
                <label style={formstyles.radioOption}>
                  <input
                    type="radio"
                    checked={!monthlyNoEndDate}
                    onChange={() => setMonthlyNoEndDate(false)}
                    style={formstyles.radio}
                  />
                  End Date
                </label>
                <label style={formstyles.radioOption}>
                  <input
                    type="radio"
                    checked={monthlyNoEndDate}
                    onChange={() => setMonthlyNoEndDate(true)}
                    style={formstyles.radio}
                  />
                  No End Date
                </label>
              </div>
              {!monthlyNoEndDate && (
                <DatePicker
                  selected={monthlyEndDate}
                  onChange={(date: Date) => setMonthlyEndDate(date)}
                  dateFormat="yyyy-MM-dd"
                  minDate={new Date()}
                  customInput={
                    <input
                      style={formstyles.input}
                    />
                  }
                />
              )}
            </div>
          </div>
        )}

        <div style={formstyles.modalButtons}>
          <button
            onClick={handleClose}
            style={{ ...formstyles.button, ...formstyles.cancelButton }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setRecurrenceEnabled(true);
              handleClose();
            }}
            style={{ ...formstyles.button, ...formstyles.submitButton }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={formstyles.container}>
      <div style={formstyles.formContainer}>
        <div style={formstyles.header}>
          <h1 style={formstyles.headerTitle}>Implementation Group Form</h1>
        </div>

        {submitSuccess && (
          <div style={formstyles.successAlert}>
            <Check style={formstyles.alertIcon} size={20} />
            <span>Form submitted successfully!</span>
          </div>
        )}

        {submitError && (
          <div style={formstyles.errorAlert}>
            <AlertCircle style={formstyles.alertIcon} size={20} />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={formstyles.formBody}>
          <div style={formstyles.formGrid}>
            <div style={formstyles.formGroup}>
              <label htmlFor="groupName" style={formstyles.label}>
                Implementation Group <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                id="groupName"
                value={formData.groupName}
                onChange={handleInputChange}
                style={errors.groupName ? { ...formstyles.input, ...formstyles.inputError } : formstyles.input}
              />
              {errors.groupName && <p style={formstyles.errorText}>{errors.groupName}</p>}
            </div>

            <div style={formstyles.formGroup}>
              <label htmlFor="description" style={formstyles.label}>
                Description <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                style={errors.description ? { ...formstyles.input, ...formstyles.inputError } : formstyles.input}
              />
              {errors.description && <p style={formstyles.errorText}>{errors.description}</p>}
            </div>

            <div style={formstyles.formGroup}>
              <label htmlFor="cloud" style={formstyles.label}>
                Cloud <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <CustomSelect
                id="cloud"
                options={cloudOptions}
                value={formData.cloud}
                onChange={handleSelectChange}
                placeholder="Select Cloud"
                error={errors.cloud}
              />
              {errors.cloud && <p style={formstyles.errorText}>{errors.cloud}</p>}
            </div>

            <div style={formstyles.formGroup}>
              <label htmlFor="provider" style={formstyles.label}>
                Provider <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                id="provider"
                value={formData.provider}
                onChange={handleInputChange}
                style={errors.provider ? { ...formstyles.input, ...formstyles.inputError } : formstyles.input}
              />
              {errors.provider && <p style={formstyles.errorText}>{errors.provider}</p>}
            </div>

            <div style={formstyles.formGroup}>
              <label htmlFor="application" style={formstyles.label}>
                Application <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <CustomSelect
                id="application"
                options={applicationOptions}
                value={formData.application}
                onChange={handleSelectChange}
                placeholder="Select Application"
                error={errors.application}
              />
              {errors.application && <p style={formstyles.errorText}>{errors.application}</p>}
            </div>

            <div style={formstyles.formGroup}>
              <label htmlFor="environment" style={formstyles.label}>
                Environment <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <CustomSelect
                id="environment"
                options={environmentOptions}
                value={formData.environment}
                onChange={handleSelectChange}
                placeholder="Select Environment"
                error={errors.environment}
              />
              {errors.environment && <p style={formstyles.errorText}>{errors.environment}</p>}
            </div>

            <div style={formstyles.formGroup}>
              <label htmlFor="os" style={formstyles.label}>
                OS <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <CustomSelect
                id="os"
                options={osOptions}
                value={formData.os}
                onChange={handleSelectChange}
                placeholder="Select OS"
                error={errors.os}
              />
              {errors.os && <p style={formstyles.errorText}>{errors.os}</p>}
            </div>

            <div style={formstyles.formGroup}>
              <label style={formstyles.label}>
                Patch Schedule <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={formstyles.scheduleBox}>
                <DateTimeInput
                  label="Start Time"
                  value={patchStartDate}
                  onChange={setPatchStartDate}
                />
                <DateTimeInput
                  label="End Time"
                  value={patchEndDate}
                  onChange={setPatchEndDate}
                />
                <div style={{ marginTop: '0.5rem' }}>
                  <label style={formstyles.checkboxLabel}>
                    <input
                      type="checkbox"
                      id="recurring"
                      style={formstyles.checkbox}
                      checked={recurrenceEnabled}
                      onChange={() => setShowProfile(!showProfile)}
                    />
                    <span>Recurring</span>
                  </label>
                </div>
                {recurrenceEnabled && (
                  <div style={formstyles.recurrenceInfo}>
                    <p>Recurrence: {recurrencePattern}</p>
                    {recurrencePattern === "Weekly" && (
                      <>
                        <p>Day: {recurrenceWeekDay}</p>
                        {weeklyNoEndDate ? (
                          <p>No End Date</p>
                        ) : (
                          <p>End Date: {formatDate(weeklyEndDate)}</p>
                        )}
                      </>
                    )}
                    {recurrencePattern === "Monthly" && monthlyType === "day" && (
                      <>
                        <p>Day {monthlyDay} of every month</p>
                        {monthlyNoEndDate ? (
                          <p>No End Date</p>
                        ) : (
                          <p>End Date: {formatDate(monthlyEndDate)}</p>
                        )}
                      </>
                    )}
                    {recurrencePattern === "Monthly" && monthlyType === "the" && (
                      <>
                        <p>The {weekOptions.find(w => w.value === monthlyWeek)?.label} {monthlyWeekDay} of every month</p>
                        {monthlyNoEndDate ? (
                          <p>No End Date</p>
                        ) : (
                          <p>End Date: {formatDate(monthlyEndDate)}</p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div style={formstyles.formGroup}>
              <label style={formstyles.label}>
                CR Schedule <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={formstyles.scheduleBox}>
                <DateTimeInput
                  label="Start Time"
                  value={crStartDate}
                  onChange={setCrStartDate}
                />
                <DateTimeInput
                  label="End Time"
                  value={crEndDate}
                  onChange={setCrEndDate}
                />
              </div>
            </div>

            <div style={formstyles.formGroup}>
              <label style={formstyles.label}>
                Approval <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={formstyles.scheduleBox}>
                <RadioButtonGroup
                  label="Patching"
                  isChecked={isApprovalPatch}
                  onChange={setIsApprovalPatch}
                />
                <RadioButtonGroup
                  label="Reboot"
                  isChecked={isApprovalReboot}
                  onChange={setIsApprovalReboot}
                />
              </div>
            </div>

            <div style={formstyles.formGroup}>
              <label htmlFor="server" style={formstyles.label}>
                Server <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <CustomSelect
                id="server"
                options={serverOptions}
                value={formData.server}
                onChange={handleSelectChange}
                placeholder="Select Server"
                error={errors.server}
              />
              {errors.server && <p style={formstyles.errorText}>{errors.server}</p>}
            </div>

            <div style={formstyles.formGroup}>
              <label htmlFor="serverId" style={formstyles.label}>
                Server ID <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <CustomSelect
                id="serverId"
                options={serverIdOptions}
                value={formData.serverId || ''}
                onChange={handleSelectChange}
                placeholder="Select Server ID" />
            </div>

            <div style={formstyles.formGroup}>
              <label style={formstyles.label}>
                Manual <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={formstyles.scheduleBox}>
                <RadioButtonGroup
                  label="Patching"
                  isChecked={isManualPatch}
                  onChange={setIsManualPatch}
                />
                <RadioButtonGroup
                  label="Reboot"
                  isChecked={isManualReboot}
                  onChange={setIsManualReboot}
                />
              </div>
            </div>

            <div style={formstyles.formGroup}>
              <label style={formstyles.label}>
                Change Request Method <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={formstyles.scheduleBox}>
                <RadioButtonGroup
                  label=""
                  isChecked={isChangeRequest}
                  onChange={setIsChangeRequest}
                />
              </div>
            </div>

            <div style={formstyles.formGroup}>
              <label htmlFor="changeRequestType" style={formstyles.label}>
                Change Request Type <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <CustomSelect
                id="changeRequestType"
                options={changeRequestTypeOptions}
                value={formData.changeRequestType}
                onChange={handleSelectChange}
                placeholder="Select Request Type"
                error={errors.changeRequestType}
              />
              {errors.changeRequestType && <p style={formstyles.errorText}>{errors.changeRequestType}</p>}
            </div>

            <div style={formstyles.formGroup}>
              <label htmlFor="service" style={formstyles.label}>
                Service <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <CustomSelect
                id="service"
                options={serviceOptions}
                value={formData.service}
                onChange={handleSelectChange}
                placeholder="Select Service"
                error={errors.service}
              />
              {errors.service && <p style={formstyles.errorText}>{errors.service}</p>}
            </div>

            <div style={formstyles.formGroup}>
              <label htmlFor="changeOwner" style={formstyles.label}>
                Change Owner <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                id="changeOwner"
                value={formData.changeOwner}
                onChange={handleInputChange}
                style={errors.changeOwner ? { ...formstyles.input, ...formstyles.inputError } : formstyles.input}
              />
              {errors.changeOwner && <p style={formstyles.errorText}>{errors.changeOwner}</p>}
            </div>

            <div style={formstyles.formGroup}>
              <label htmlFor="assignmentGroup" style={formstyles.label}>
                Assignment Group <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <CustomSelect
                id="assignmentGroup"
                options={groupOptions}
                value={formData.assignmentGroup}
                onChange={handleSelectChange}
                placeholder="Select Assignment Group"
                error={errors.assignmentGroup}
              />
              {errors.assignmentGroup && <p style={formstyles.errorText}>{errors.assignmentGroup}</p>}
            </div>

            <div style={formstyles.formGroup}>
              <label htmlFor="assignmentGroupId" style={formstyles.label}>
                Assignment Group ID <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <CustomSelect
                id="assignmentGroupId"
                options={groupIdOptions}
                value={formData.assignmentGroupId || ''}
                onChange={handleSelectChange}
                placeholder="Select Assignment Group ID"
              />
            </div>
          </div>

          <div style={formstyles.buttonGroup}>
            <button
              type="button"
              onClick={handleCancel}
              style={{ ...formstyles.button, ...formstyles.cancelButton }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...formstyles.button,
                ...formstyles.submitButton,
                ...(isSubmitting ? formstyles.disabledButton : {})
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>

      {showProfile && <ScheduleProfileLayout handleClose={() => setShowProfile(false)} />}
    </div>
  );
}
export default ImplementationGroupForm;