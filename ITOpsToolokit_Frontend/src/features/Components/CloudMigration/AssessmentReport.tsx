import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HeaderBar from '../AksCluster/TitleHeader';
import SendIcon from "../../../assets/Send.png";
import { Tabs, Tab } from '@mui/material';
// Removed Redux orderId usage
import { Api } from '../../Utilities/api';
import { Snackbar, Alert } from '@mui/material';
import { useAppSelector } from '../../../app/hooks';
import { selectCommonConfig } from '../CommonConfig/commonConfigSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

// Build a user-friendly narrative from the returned JSON summary
function buildReadableSummary(raw: string): string {
  try {
    const data = JSON.parse(raw || '{}');
    const lines: string[] = [];

    const sum = data?.summary || {};
    const windows = sum?.windows_count ?? 0;
    const linux = sum?.linux_count ?? 0;
    const others = sum?.Others ?? 0;
    lines.push(`Environment overview:`);
    lines.push(`- Windows: ${windows}, Linux: ${linux}, Others: ${others}`);

    const osFlavors = sum?.os_flavors || {};
    const topFlavors = Object.entries(osFlavors)
      .map(([k, v]) => ({ name: k, count: Number(v as any) || 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((f) => `${f.name}: ${f.count}`);
    if (topFlavors.length > 0) {
      lines.push(`Top OS flavors:`);
      lines.push(`- ${topFlavors.join(', ')}`);
    }

    const readiness = data?.assessment_readiness_summary || {};
    if (Object.keys(readiness).length > 0) {
      lines.push(`Readiness summary:`);
      lines.push(`- Ready: ${readiness['Ready'] ?? 0}`);
      lines.push(`- Ready with condition: ${readiness['Ready with condition'] ?? 0}`);
      lines.push(`- Not Ready: ${readiness['Not Ready'] ?? 0}`);
      lines.push(`- Unknown: ${readiness['Readiness_Unknown'] ?? 0}`);
    }

    const sixr = Array.isArray(data?.sixr_strategy) ? data.sixr_strategy : [];
    if (sixr.length > 0) {
      lines.push(`6R recommendations:`);
      sixr.forEach((item: any) => {
        const strategy = String(item?.strategy ?? '').toUpperCase();
        const count = item?.count ?? 0;
        const justification = item?.justification ? ` — ${item.justification}` : '';
        lines.push(`- ${strategy}: ${count}${justification}`);
      });
    }

    const assess = data?.assessment_summary || {};
    if (Object.keys(assess).length > 0) {
      const total = assess['Total machines assessed'];
      const ready = assess['Machines ready for Azure'];
      const readyCond = assess['Machines ready with conditions'];
      const notReady = assess['Machines not ready for Azure'];
      const monthly = assess['Total monthly cost estimate'];
      lines.push(`Assessment highlights:`);
      if (total != null) lines.push(`- Total machines assessed: ${total}`);
      if (ready != null) lines.push(`- Ready for Azure: ${ready}`);
      if (readyCond != null) lines.push(`- Ready with conditions: ${readyCond}`);
      if (notReady != null) lines.push(`- Not ready for Azure: ${notReady}`);
      if (monthly != null) lines.push(`- Total monthly cost estimate: ${monthly}`);
    }

    const storage = data?.storage_summary || {};
    const storageItems = Array.isArray(storage?.StorageSummary) ? storage.StorageSummary : [];
    if (storageItems.length > 0) {
      const top = storageItems.slice(0, 3).map((s: any) => `${s?.SizeCategory}: ${s?.ServerCount}`);
      lines.push(`Storage overview (top):`);
      lines.push(`- ${top.join(', ')}`);
    }

    return lines.join('\n');
  } catch {
    return raw;
  }
}

const AssessmentReport: React.FC = () => {
  const navigate = useNavigate();
  const CHAT_STORAGE_KEY = "chatbot_history";
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('Cloud D & A Report');
  const [projectName, setProjectName] = useState<string>('');
  const [cloud, setCloud] = useState<string>('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadSqlFile, setUploadSqlFile] = useState<File | null>(null);
  const [orderId, setOrderId] = useState<string>('');
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'info' | 'error'>('success');
  const commonStore = useAppSelector(selectCommonConfig);
  const loggedInEmail: string = commonStore?.loginDetails?.currentUser ?? '';
  const [summaryText, setSummaryText] = useState<string>('');
  const [pptLink, setPptLink] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileSQLInputRef = useRef<HTMLInputElement>(null);
  const tabs = [
    'Cloud D & A Report',
    'Application Intake Form Report',
    'Migartion Plan Document',
    'Cloud Migration'
  ];


  const [chatHistory, setChatHistory] = useState(() => {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const sendMessage = async (message: string) => {
    const userMsg = { sender: "user", text: message, timestamp: Date.now() };
    setChatHistory((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      // This fetch call will now be intercepted by your mockFetch function
      const response = await fetch("https://api-endpoint.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      const botMsg = { sender: "bot", text: data.message, timestamp: Date.now() };
      setChatHistory((prev) => [...prev, botMsg]);
    } catch (error) {

      const errorMsg = {
        sender: "bot",
        text: "Something went wrong!",
        timestamp: Date.now(),
      };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };
  const handleGenerateDescription = async (): Promise<void> => {
    
    try {
      if (!uploadFile || !projectName || !cloud) {
        setToastMsg('Project name, cloud and upload assessment report is required to generate the report.');
        setToastSeverity('error');
        setToastOpen(true);
        return;
      }
      // displaying toast while processing request
      setToastMsg('Generating PPT, please wait…');
      setToastSeverity('info');
      setToastOpen(true);
      const currentOrderId = orderId || String(Date.now());
      console.log('projectorderId', String(currentOrderId));
      if (!orderId) setOrderId(currentOrderId);
      const form = new FormData();
      form.append('vm_excel', uploadFile);
      if (uploadSqlFile) {
        form.append('sql_excel', uploadSqlFile);
      }
      const cloudLabel = cloud === 'aws' ? 'AWS' : cloud === 'azure' ? 'Azure' : cloud === 'gcp' ? 'GCP' : '';
      const url = 'http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/azure_migration_assessment/upload-excel/';
      // http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/gcp_migration_assessment/upload-excel/
      // const url = cloud === 'aws' ? 'http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/aws_migration_assessment/upload-excel/'
      //           : cloud === 'azure' ? 'http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/azure_migration_assessment/upload-excel/'
      //           : '';    
      const escapedProjectName = String(projectName || '').replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      const unitPayload = `{"OrderID": "${String(currentOrderId)}", "Project": "${escapedProjectName}", "Cloud": "${cloudLabel}"}`;
      form.append('unit', unitPayload);
      console.log('[Assessment Upload] unit string:', unitPayload);
      setIsUploading(true);
      // Clear any prior results to avoid showing stale content while loading
      setSummaryText('');
      setPptLink('');
      const res = await Api.postImage(url, form);
      console.log('[Assessment Upload] response:', res?.data);
      console.log("testform",form)
      // Handle response: set summary and ppt link if present
      try {
        const data = res?.data.data || {};
        const ppt = data?.az_ppt_path || '';
        const jsonContent = data?.json_content || '';
        if (ppt) setPptLink(String(ppt));
        if (jsonContent) {
          const readable = buildReadableSummary(String(jsonContent));
          setSummaryText(readable);
        }
      } catch (e) {
        console.warn('[Assessment Upload] parse response warning:', e);
      }
      // Create/ensure project appears in MigrationDashboard listing
      try {
        const createProjectUrl = 'http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/azure_migrate_session_details/';
        const projectId = `proj_${Date.now()}`;
        await Api.postData(createProjectUrl, {
          Project: projectName || '',
          Cloud: cloudLabel,
          UserID: loggedInEmail,
          Applications: [],
          project_id: projectId,
        });
      } catch (e) {
        console.warn('[Assessment Upload] project create warning:', e);
      }
      // Reset form fields on success
      setProjectName('');
      setCloud('');
      setUploadFile(null);
      setUploadSqlFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (fileSQLInputRef.current) fileSQLInputRef.current.value = '';
      setToastMsg('The PPT has been created based on the assessment report. You may need to make further changes as per your requirements.');
      setToastSeverity('success');
      setToastOpen(true);
    } catch (err) {
      console.error('[Assessment Upload] error:', err);
      setToastMsg('Failed to upload assessment Excel.');
      setToastSeverity('error');
      setToastOpen(true);
    }
    finally {
      setIsUploading(false);
    }
  };

  const handleProceedClick = () => {
    const cloudLabel = cloud === 'aws' ? 'AWS' : cloud === 'azure' ? 'Azure' : cloud === 'gcp' ? 'GCP' : '';
    const escapedProjectName = String(projectName || '').replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const currentOrderId = orderId || String(Date.now());
    const unitPayload = { OrderID: String(currentOrderId), Project: escapedProjectName, Cloud: cloudLabel };
    navigate('/CloudAssessmentReport', { state: { unitPayload } });
  };

  const handleSaveClick = () => {
    console.log('Save clicked');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: string): void => {
    setActiveTab(newValue);
    const routeMap: Record<string, string> = {
      'Cloud D & A Report': '/AssessmentReport',
      'Application Intake Form Report': '/CloudAssessmentReport',
      'Migartion Plan Document': '/MigrationPlan',
      'Cloud Migration': '/MigrationPlan'
    };
    const target = routeMap[newValue];
    if (target) navigate(target);
  };

  // Determine icon path by selected cloud (AWS -> awsIcon, Azure -> AzureIcon, GCP -> AzureIcon as requested)
  const cloudIconSrc = cloud === 'aws' ? '/awsIcon.png' : cloud === 'azure' ? '/azureIcon.png' : cloud === 'gcp' ? '/azureIcon.png' : '';

  const handleDownloadPpt = () => {
    if (pptLink) {
      window.open(pptLink, '_blank');
    } else {
      setToastMsg('Report link not available yet.');
      setToastSeverity('info');
      setToastOpen(true);
    }
  };



  return (
    <div className="container-fluid" style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '2px', paddingBottom: '40px' }}>

      <HeaderBar content="Cloud Discovery Report" position="center" />
      <Snackbar
        open={toastOpen}
        autoHideDuration={isUploading ? null : 4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        style={{ zIndex: 3000 }} // Ensure Snackbar is above loading screen
      >
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} variant="filled" sx={{ width: '100%' }}>
          {toastMsg}
        </Alert>
      </Snackbar>

      <div className="row">
        <div className="col-md-4">
          <div className="p-4 shadow-sm">
            <h5 className="mb-4 fs-6">Fill the details to generate the deck:</h5>
            <div className="mb-3">
              <input
                type="text"
                className="form-control form-control-sm f-size"
                id="projectName"
                placeholder="Enter Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <select className="form-select f-size form-control form-control-sm" id="cloud" value={cloud} onChange={(e) => setCloud(e.target.value)}>
                <option className='f-size' value="">Select Cloud</option>
                <option className='f-size' value="aws">AWS</option>
                <option className='f-size' value="azure">Azure</option>
                <option className='f-size' value="gcp">GCP</option>
              </select>
              {/* {cloud ? (
                <div className="mt-2 d-flex align-items-center">
                  {cloudIconSrc ? (
                    <img src={cloudIconSrc} alt={`${cloud.toUpperCase()} icon`} style={{ width: '24px', height: '24px' }} />
                  ) : null}
                  <span className="ms-2 f-size text-capitalize">{cloud}</span>
                </div>
              ) : null} */}
            </div>

            {/* Resolver code and Subnet ID temporarily hidden */}
            {/*
            <div className="row mb-3">
              <div className="col">
                <select className="form-select form-control form-control-sm f-size" id="resolverCode">
                  <option className='f-size'>Resolver code</option>
                  {/* Add more options here */}
            {/*
                </select>
              </div>
              <div className="col">
                <select className="form-select form-control form-control-sm f-size" id="clientName">
                  <option className='f-size'>Subnet ID</option>
                  {/* Add more options here */}
            {/*
                </select>
              </div>
            </div>
            */}
            {/* <div className="text-center my-4">
              OR
            </div> */}
              {uploadFile && (
                <div className="mt-2 f-size text-truncate" title={uploadFile.name}>
                  Selected: {uploadFile.name}
                </div>
              ) }
            <div className="mb-3">
              <label htmlFor="uploadExcel" className="form-label btn btn-outline-primary w-100">
              Upload Assessment Report <i className="bi bi-upload"></i>
              </label>
              <input
                type="file"
                className="form-control d-none"
                id="uploadExcel"
                onChange={(e) => setUploadFile(e.target.files?.[0] ?? null)}
                ref={fileInputRef}
              />
            
            </div>
            {/* upload sql file */}
            {uploadSqlFile && (
                <div className="mt-2 f-size text-truncate" title={uploadSqlFile.name}>
                  Selected: {uploadSqlFile.name}
                </div>
              ) }
            <div className="mb-3">
              <label htmlFor="uploadSQLExcel" className="form-label btn btn-outline-primary w-100">
                Upload SQL Report <i className="bi bi-upload"></i>
              </label>
              <input
                type="file"
                className="form-control d-none"
                id="uploadSQLExcel"
                onChange={(e) => setUploadSqlFile(e.target.files?.[0] ?? null)}
                ref={fileSQLInputRef}
              />
            
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={handleGenerateDescription}
              disabled={isUploading}
            >
              Generate Assessment Report
            </button>
          </div>
        </div>
        <div className="col-md-8 bg_color">
          <div className="px-4 py-1">
            <div className=" d-flex pt-2 justify-content-center align-items-center" style={{ backgroundColor: "#2d2d8f", padding: "5px", color: "white" }}>
              <label className="f-size">Summary</label>
              <button type="button" className="btn btn-link text-white p-0 ms-2" title="Download report" onClick={handleDownloadPpt} disabled={!pptLink}>
                <i className="bi bi-download"></i>
              </button>
            </div>
            <textarea className="form-control f-size" style={{ whiteSpace: 'pre-wrap' }} rows={15} readOnly value={summaryText} placeholder="Summary will appear here after upload"></textarea>

            <div className="d-flex flex-row-reverse py-2">
              <button className="btn btn-success" onClick={handleDownloadPpt} disabled={!pptLink}>Download Assessment Deck  <FontAwesomeIcon icon={faDownload}  /></button>
              {/* {pptLink ? <span className='px-3'>Assessment deck generated</span> : null} */}
            </div>
          </div>
          {/* <div className='px-4 '>
            <div className='d-flex pt-2'>
              <div className=" d-flex rounded-top" style={{ backgroundColor: "#2d2d8f", padding: "5px", color: "white" }}>
                <span className='f-size px-3'>Was the deck accurate?</span>
              </div>
            </div>
            <div className="px-4 py-1 border bg-white shadow-sm">
              <div className="d-flex">
                <div className="form-check me-3">
                  <input className="form-check-input" type="radio" name="deckAccuracy" id="accurateYes" value="yes" />
                  <label className="form-check-label f-size" htmlFor="accurateYes">
                    Yes. Generate report based on this deck
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="deckAccuracy" id="accurateNo" value="no" />
                  <label className="form-check-label f-size" htmlFor="accurateNo">
                    No. deck needs changes
                  </label>
                </div>
              </div>
              <div>
                <textarea className="form-control f-size" rows={2} defaultValue="" />
              </div>
              <div className="mt-1 bg-white rounded-bottom">
                <div className="chat-input-wrapper position-relative w-100">
                  <textarea
                    className="form-control rounded-3 shadow border-0 no-resize f-size"
                    placeholder="Type a message..."
                    rows={1}
                  ></textarea>
                  <button
                    className="send-button position-absolute border-0 p-0 top-50 translate-middle-y "
                  >
                    <img
                      alt="Send"
                      src={SendIcon}
                      title="Send"
                      style={{ width: "30px", height: "30px", cursor: "pointer" }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      <div className="shadow-sm mb-3 py-3 fixed-bottom w-70" style={{ zIndex: 1030 }}>
        <div className="row align-items-center">
          <div className='col-2 d-flex justify-content-end align-items-center gap-2'>
            {/* Save button removed as requested */}
          </div>
          <div className="col-8 d-flex Analytics_Ai justify-content-center">
            <div className="genai-tabs  py-2">
              <Tabs
                sx={{ minHeight: "32px" }}
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                indicatorColor="primary"
                className="genai-tabs-wrapper tab_bg text-primary"
              >
                {tabs.map((label, index) => (
                  <Tab key={index} label={label} value={label} />
                ))}
              </Tabs>
            </div>
          </div>
          <div className='col-2 d-flex justify-content-center align-items-center gap-2'>
            <button
              className="btn cloud-cta-btn px-4"
              onClick={handleProceedClick}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>

      {isUploading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: 'rgba(255,255,255,0.6)', zIndex: 2000 }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

    </div>

  );
};

export default AssessmentReport;