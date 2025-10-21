import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { useLocation } from 'react-router-dom';
import { selectCommonConfig } from '../CommonConfig/commonConfigSlice';
// removed useLocation; routing no longer controls pending/new
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faArrowLeft, faUpload, faDownload } from "@fortawesome/free-solid-svg-icons";
import HeaderBar from '../AksCluster/TitleHeader';
// import fetchChatApiData from '../Analytics AI/FetchChatApiData';
import ChatWindow from '../../Utilities/ChatWindow';
import TeachAssistInput from '../../Utilities/TeachAssistInput';
import TypingDotsStyle from '../../Utilities/TypingDotsStyle';
import { Tabs, Tab } from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
// removed Dialog for upload flow; using existing download icon
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Api } from '../../Utilities/api';
import testapi from "../../../api/testapi.json";
import { Loader } from '../../Utilities/Loader';
import Tooltip from '@mui/material/Tooltip';

// Removed localStorage usage per request
const CHAT_STORAGE_KEY = "CloudAssessmentReport_history_DISABLED";
const SESSION_ID_KEY = "CloudAssessment_order_id_DISABLED";
const API_BASE = "http://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006";

interface MetricPoint {
  Date: string;
  Value: number;
  Unit: string;
}

interface MetricsData {
  [metricName: string]: MetricPoint[];
}

interface TableData {
  [key: string]: string | number;
}

interface BotMessage {
  sender: "user" | "bot";
  text: string;
  chartData?: MetricsData | null;
  tableData?: TableData[] | null;
  timestamp: number;
}
const CloudAssessmentReport: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [chatMessage, setChatMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('Application Intake Form Report');

  const [chatHistory, setChatHistory] = useState<BotMessage[]>([]);

  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const commonStore = useAppSelector(selectCommonConfig);
  const loggedInEmail: string = commonStore?.loginDetails?.currentUser ?? '';
  const exitTimerRef = useRef<number | null>(null);
  const [generatedSummary, setGeneratedSummary] = useState<any>(null);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [statusChecked, setStatusChecked] = useState<boolean>(false);
  const hasFetchedSummaryRef = useRef<boolean>(false);
  const [isSummaryLoading, setIsSummaryLoading] = useState<boolean>(false);
  const hasPostedAppRef = useRef<boolean>(false);
  const [toastSeverity, setToastSeverity] = useState<'success' | 'info' | 'error'>("success");
  const [expectedAppName, setExpectedAppName] = useState<string>("");
  const [hidden, setHidden] = useState<boolean>(false); // hiding input when processing

  // WebSocket: use provided endpoint with a stable session/order_id
  const [orderId] = useState<string>(() => String((location?.state?.orderId) ?? Date.now()));
  const selectedProjectId = location?.state?.projectId ?? null;
  console.log('selectedProjectId:', selectedProjectId);

  console.log('ApporderId', orderId);
  const wsPath = isPending ? 'pending' : 'new';
  const wsBase = `ws://ec2-16-52-107-209.ca-central-1.compute.amazonaws.com:8006/azure_migrate_session_wrapper`;
  const [socketUrl, setSocketUrl] = useState<string | null>(null);
  const { sendMessage: sendWsMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    onOpen: () => console.log('[WS] Opened:', socketUrl),
    onClose: async (event) => {
      console.log('[WS] Closed:', event.code, event.reason);
      // Fetch summary after disconnect
      try {
        if (hasFetchedSummaryRef.current) return;
        hasFetchedSummaryRef.current = true;
        setIsSummaryLoading(true);
        const res = await Api.postData(testapi.GeneratedResponse, {});
        const payload: any = res?.data;
        const list = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : []);
        const match = list.find((r: any) => String(r?.OrderID ?? r?.order_id) === String(orderId));
        const chatSummary = match?.ChatSummary ?? match?.chat_summary;
        const statusVal = match?.Status ?? match?.status;
        const blob = match?.BlobLink ?? match?.blob_link ?? null;
        const isPartial = String(statusVal ?? '').toLowerCase() === 'partially completed';
        if (isPartial && blob) {
          setDownloadLink(String(blob));
        } else {
          setDownloadLink(null);
        }

        // Capture metadata for Proceed and enable when partial
        if (match) {
          let appName = '';
          if (Array.isArray(match?.Applications) && match.Applications.length > 0) {
            appName = String(match.Applications[0]?.ApplicationName ?? '');
          } else if (Array.isArray(match?.ApplicationName) && match.ApplicationName.length > 0) {
            appName = String(match.ApplicationName[0] ?? '');
          } else if (match?.ApplicationName) {
            appName = String(match.ApplicationName);
          }
          setProceedAppName(appName);
          setProceedCloud(String(match?.Cloud ?? match?.cloud ?? ''));
          setProceedProject(String(match?.Project ?? match?.project ?? ''));
          setCanProceed(isPartial);
          setExpectedAppName((appName || '').trim().toLowerCase());
        }

        // One-time: create/update application under the matched project using values from GeneratedResponse
        try {
          if (!hasPostedAppRef.current && match && selectedProjectId) {
            const projectName = match?.Project ?? match?.project ?? '';
            const cloud = match?.Cloud ?? match?.cloud ?? '';
            const userId = match?.UserID ?? match?.user_id ?? '';
            let appNames: string[] = [];
            if (Array.isArray(match?.Applications)) {
              appNames = match.Applications.map((a: any) => String(a?.ApplicationName ?? '')).filter(Boolean);
            } else if (Array.isArray(match?.ApplicationName)) {
              appNames = match.ApplicationName.map((n: any) => String(n ?? '')).filter(Boolean);
            } else if (match?.ApplicationName) {
              appNames = [String(match.ApplicationName)];
            }
            const newApplications = appNames.length > 0
              ? appNames.map((name) => ({ OrderID: String(orderId), ApplicationName: name }))
              : [{ OrderID: String(orderId), ApplicationName: String(match?.ApplicationName ?? '') }].filter(a => a.ApplicationName);
            if (newApplications.length > 0) {
              // Fetch existing Applications for the selected project and append
              let mergedApplications: any[] = [];
              try {
                const detailsRes = await Api.postData(`${API_BASE}/azure_migrate_session_details/all`, {});
                const detailsPayload: any = detailsRes?.data;
                const detailsList = Array.isArray(detailsPayload)
                  ? detailsPayload
                  : (Array.isArray(detailsPayload?.data) ? detailsPayload.data : []);
                const selected = detailsList.find((p: any) => String(p?.id ?? p?._id ?? p?.Id ?? p?.project_id) === String(selectedProjectId));
                const existingApps: any[] = Array.isArray(selected?.Applications)
                  ? selected.Applications.map((a: any) => ({ OrderID: String(a?.OrderID), ApplicationName: String(a?.ApplicationName) }))
                  : [];
                const appByOrder = new Map<string, any>();
                existingApps.forEach(a => { if (a?.OrderID) appByOrder.set(a.OrderID, a); });
                newApplications.forEach(a => { if (a?.OrderID && !appByOrder.has(a.OrderID)) appByOrder.set(a.OrderID, a); });
                mergedApplications = Array.from(appByOrder.values());
              } catch (mergeErr) {
                console.warn('[PUT Details] Failed to read existing applications; falling back to new only:', mergeErr);
                mergedApplications = newApplications;
              }

              const putUrl = `${API_BASE}/azure_migrate_session_details/`;
              await Api.putData(putUrl, {
                Project: projectName,
                Cloud: cloud,
                UserID: userId,
                Applications: mergedApplications,
                Status: statusVal,
                project_id: selectedProjectId,
              }, selectedProjectId);
              hasPostedAppRef.current = true;
            }
          }
        } catch (postErr) {
          console.error('[POST Details] Save application error:', postErr);
        }

        if (chatSummary) {
          // Try to keep as object if possible for nicer rendering
          if (typeof chatSummary === 'string') {
            try {
              const parsed = JSON.parse(chatSummary);
              setGeneratedSummary(parsed);
            } catch {
              setGeneratedSummary(chatSummary);
            }
          } else {
            setGeneratedSummary(chatSummary);
          }
        }
      } catch (e) {
        console.error('[POST Close] Fetch summary error:', e);
      } finally {
        setIsSummaryLoading(false);
      }
    },
    onError: (event) => console.error('[WS] Error:', event),
    shouldReconnect: () => false,
    reconnectAttempts: 0,
    reconnectInterval: 0,
  });
  const isWsOpen = readyState === ReadyState.OPEN;
  const hasBotResponse = chatHistory.some((m) => m.sender === 'bot');
  const isLoading = !hasBotResponse || isSummaryLoading;
  const [canProceed, setCanProceed] = useState<boolean>(false);
  const [proceedAppName, setProceedAppName] = useState<string>("");
  const [proceedCloud, setProceedCloud] = useState<string>("");
  const [proceedProject, setProceedProject] = useState<string>("");
  const [partialResume, setPartialResume] = useState<boolean>(false);
  const exitSentRef = useRef<boolean>(false);

  // Toast when download becomes available
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>("");
  useEffect(() => {
    if (downloadLink) {
      setToastMsg('Excel file generated. You can download now.');
      setToastSeverity('success');
      setToastOpen(true);
    }
  }, [downloadLink]);

  // First, check server status for this order to decide pending vs new
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await Api.postData(testapi.GeneratedResponse, {});
        const payload: any = res?.data;
        const list = Array.isArray(payload) ? payload : (Array.isArray(payload?.data) ? payload.data : []);
        const match = list.find((r: any) => String(r?.OrderID ?? r?.order_id) === String(orderId));
        const statusVal = match?.Status ?? match?.status;
        setIsPending(statusVal === 'Pending');

        // If user selected a partially completed application, preload summary and orient the user
        const isPartial = String(statusVal ?? '').toLowerCase() === 'partially completed';
        if (isPartial && match) {
          setPartialResume(true);
          const chatSummary = match?.ChatSummary ?? match?.chat_summary;
          // Try to extract a clear "last message" for orientation
          let lastMsgText: string | null = null;
          if (typeof match?.LastMessage === 'string') lastMsgText = match.LastMessage;
          else if (typeof match?.last_message === 'string') lastMsgText = match.last_message;
          else if (typeof match?.LastBotMessage === 'string') lastMsgText = match.LastBotMessage;
          else if (Array.isArray(match?.messages) && match.messages.length > 0) {
            const last = match.messages[match.messages.length - 1];
            lastMsgText = (typeof last === 'string') ? last : (last?.text ?? null);
          }
          if (chatSummary) {
            if (typeof chatSummary === 'string') {
              try {
                const parsed = JSON.parse(chatSummary);
                setGeneratedSummary(parsed);
              } catch {
                setGeneratedSummary(chatSummary);
              }
              // choose explicit last message if present; otherwise fallback to last non-empty line of summary
              if (!lastMsgText) {
                const lines = String(chatSummary).split(/\r?\n/).map(l => l.trim()).filter(Boolean);
                lastMsgText = lines.length > 0 ? lines[lines.length - 1] : null;
              }
              const botMsg: BotMessage = { sender: 'bot', text: lastMsgText ?? 'Resuming previous session.', timestamp: Date.now() };
              setChatHistory((prev) => [...prev, botMsg]);
            } else {
              setGeneratedSummary(chatSummary);
              const botMsg: BotMessage = { sender: 'bot', text: lastMsgText ?? 'Resuming previous session. Summary loaded.', timestamp: Date.now() };
              setChatHistory((prev) => [...prev, botMsg]);
            }
          }
          setToastMsg('Resumed partially completed session. Summary loaded.');
          setToastSeverity('info');
          setToastOpen(true);
        }
      } catch (e) {
        console.error('[Status Check] error:', e);
        setIsPending(false);
      } finally {
        setStatusChecked(true);
      }
    };
    if (orderId) checkStatus();
  }, [orderId]);

  // Initialize session via POST for new sessions; for pending, directly open pending WS
  useEffect(() => {
    const openSocket = () => {
      if (!orderId) return;
      const url = `${wsBase}/${wsPath}/${orderId}`;
      setSocketUrl(url);
    };
    const initNew = async () => {
      try {
        console.log('[INIT] POST start');
        const res = await Api.postData(testapi.CloudAssessmentReport, {
          OrderID: orderId,
          UserID: loggedInEmail,
          ApplicationName: "",
          Cloud: "Azure",
          CompletedQuestion: {},
          BlobLink: "",
          Status: "",
          Project: "",
          ChatSummary: {}
        });
        console.log('[INIT] POST response:', res.status);
        openSocket();
      } catch (err) {
        console.error('[INIT] POST error:', err);
        const errorMsg: BotMessage = {
          sender: 'bot',
          text: 'Failed to initialize session. Please retry later.',
          timestamp: Date.now(),
        };
        setChatHistory((prev) => [...prev, errorMsg]);
      }
    };
    if (!orderId || !statusChecked) return;
    if (partialResume) return; // already loaded summary for partial completion
    if (isPending) openSocket(); else initNew();
  }, [orderId, loggedInEmail, isPending, statusChecked, partialResume]);

  // Log readyState changes for quick diagnostics
  useEffect(() => {
    const connectionStatus = {
      [ReadyState.CONNECTING]: 'CONNECTING',
      [ReadyState.OPEN]: 'OPEN',
      [ReadyState.CLOSING]: 'CLOSING',
      [ReadyState.CLOSED]: 'CLOSED',
      [ReadyState.UNINSTANTIATED]: 'UNINSTANTIATED',
    }[readyState];
    console.log('[WS] ReadyState:', connectionStatus, `(${readyState})`);
  }, [readyState]);

  useEffect(() => {
    if (lastMessage) {
      console.log('[WS] Received:', lastMessage.data);
      const text = typeof lastMessage.data === 'string' ? lastMessage.data : JSON.stringify(lastMessage.data);

      // If final summary arrived, send 'exit' silently
      if (text.includes('### Summary of Questions and Answers Across All Sheets ###') && !exitSentRef.current) {
        exitSentRef.current = true;
        setHidden(true);
        sendSilent('exit');
        setToastMsg('Processing please wait..');
        setToastSeverity('info');
        setToastOpen(true);
      }

      // Suppress any echoed 'exit' message from being added to the chat
      if (exitSentRef.current && text.trim().toLowerCase() === 'exit') {
        setIsTyping(false);
        return;
      }

      const botMsg: BotMessage = {
        sender: 'bot',
        text,
        timestamp: Date.now(),
      };
      setChatHistory((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }
  }, [lastMessage]);

  // Helper to send messages silently over WS with simple retry
  const sendSilent = (payload: string, retries: number = 10): void => {
    if (readyState === ReadyState.OPEN) {
      console.log('[WS] Silent send:', payload);
      sendWsMessage(payload);
      return;
    }
    if (retries > 0) {
      console.warn('[WS] Silent send queued. Socket not OPEN. Retries left:', retries);
      window.setTimeout(() => sendSilent(payload, retries - 1), 1500);
    } else {
      console.error('[WS] Silent send failed after retries:', payload);
    }
  };

  const sendMessage = async (message: string) => {
    const userMsg: BotMessage = {
      sender: "user",
      text: message,
      timestamp: Date.now(),
    };
    setChatHistory((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // WebSocket only
    if (readyState === ReadyState.OPEN) {
      console.log('[WS] Sending:', message);
      sendWsMessage(message);
      return;
    }

    // If socket isn't open, show an error and stop typing
    const errorMsg: BotMessage = {
      sender: 'bot',
      text: 'Connection not ready. Please try again once connected.',
      timestamp: Date.now(),
    };
    console.warn('[WS] Send blocked. Socket not OPEN.');
    setChatHistory((prev) => [...prev, errorMsg]);
    setIsTyping(false);
  };
  const tabs = [
    'Cloud D & A Report',
    'Application Intake Form Report',
    'Migartion Plan Document',
    'Cloud Migration'
  ];

  const handleSave = (): void => {
    setToastMsg('Processing, please wait…');
    setToastSeverity('info');
    setToastOpen(false);
    console.log('Save clicked');
    // 1) Send silent save-draft
    sendSilent('save draft');
    // 2) Schedule silent exit after 30 seconds
    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    exitTimerRef.current = window.setTimeout(() => {
      sendSilent('exit');
      exitTimerRef.current = null;
    }, 15000);
  };

  const handleProceed = (): void => {
    // TODO: Implement actual proceed/navigation logic
    navigate('/MigrationPlan', { state: { orderId, projectId: selectedProjectId } });
    console.log('Proceed clicked');
    if (!canProceed) return;
    (async () => {
      try {
        const allUrl = `${API_BASE}/azure_migrate_3rd_bot_details/all`;
        const res = await Api.postData(allUrl, {});
        const payload: any = res?.data;
        const list = Array.isArray(payload)
          ? payload
          : (Array.isArray(payload?.data) ? payload.data : []);
        const exists = list?.some((r: any) => String(r?.OrderID ?? r?.order_id) === String(orderId));
        if (!exists) {
          const createUrl = `${API_BASE}/azure_migrate_3rd_bot_details/`;
          await Api.postData(createUrl, {
            OrderID: String(orderId),
            ApplicationName: proceedAppName,
            Cloud: proceedCloud,
            Project: proceedProject,
            Data: [],
          });
        }
      } catch (e) {
        console.error('[Proceed] Ensure 3rd bot details error:', e);
      } finally {
        navigate('/MigrationPlan', { state: { orderId, projectId: selectedProjectId } });
      }
    })();
  };

  const handleUploadClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      (async () => {
        try {
          // Directly upload to check API and BlobLink
          const form = new FormData();
          form.append("excel_files", file);
          const uploadUrl = `${API_BASE}/azure_migration_chatbot/upload-excel/`;
          const res = await Api.postImage(uploadUrl, form);
          const files = Array.isArray(res?.data?.files) ? res.data.files : [];
          const first = files.length > 0 ? files[0] : null;
          const blobPath = first?.BlobPath ?? first?.blobPath ?? null;
          // const fullLink = blobPath ? `${API_BASE}/${String(blobPath).replace(/^\//, '')}` : null;
          if (blobPath) {
            setDownloadLink(blobPath);
            setToastMsg('Excel uploaded. You can download now.');
            setToastSeverity('success');
            setToastOpen(true);
          } else {
            setToastMsg('Upload completed but no download link returned');
            setToastSeverity('info');
            setToastOpen(true);
          }
        } catch (err) {
          console.error('[Upload Excel] error:', err);
          setToastMsg('Failed to upload the file');
          setToastSeverity('error');
          setToastOpen(true);
        } finally {
          e.target.value = '';
        }
      })();
    }
  };

  const handleDownloadClick = (): void => {
    if (downloadLink) {
      window.open(downloadLink, '_blank');
    }
  };
  // removed upload dialog download; use main download icon

  const handleTabChange = (event: React.SyntheticEvent, newValue: string): void => {
    setActiveTab(newValue);
    const routeMap: Record<string, string> = {
      'Cloud D & A Report': '/AssessmentReport',
      'Application Intake Form Report': '/CloudAssessmentReport',
      'Migartion Plan Document': '/MigrationPlan',
      'Cloud Migration': '/MigrationPlan'
    };
    const target = routeMap[newValue];
    if (target) navigate(target, { state: { orderId } });
  };

  const handleEdit = (): void => {
    console.log('Edit clicked');
  };

  const handleApprove = (): void => {
    console.log('Approve clicked');
  };

  const formatLabel = (key: string): string =>
    key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (s) => s.toUpperCase())
      .trim();

  const isQAItem = (item: any): boolean => {
    if (!item || typeof item !== 'object') return false;
    const keys = Object.keys(item).map((k) => k.toLowerCase());
    return keys.includes('question') && keys.includes('answer');
  };

  const renderArrayOfObjects = (rows: any[]) => {
    return (
      <div className="px-3 pb-3">
        {rows.map((row, idx) => (
          <div key={idx} className="mb-3 p-3 border rounded bg-white">
            {isQAItem(row) ? (
              <div>
                <div className="fw-bold mb-1">{row.Question ?? row.question}</div>
                <div>{row.Answer ?? row.answer}</div>
              </div>
            ) : (
              <div>
                {Object.entries(row || {}).map(([k, v]) => (
                  <div key={k} className="mb-1">
                    <span className="fw-semibold me-2">{formatLabel(k)}:</span>
                    <span>{typeof v === 'object' ? JSON.stringify(v) : String(v ?? '')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSummary = (data: any) => {
    if (data == null) return null;
    if (typeof data === 'string' || typeof data === 'number' || typeof data === 'boolean') {
      return <p className="p-3 card_p">{String(data)}</p>;
    }
    if (Array.isArray(data)) {
      if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
        return renderArrayOfObjects(data as any[]);
      }
      return (
        <ul className="mb-3 px-4">
          {(data as any[]).map((item, idx) => (
            <li key={idx}>{typeof item === 'object' ? JSON.stringify(item) : String(item)}</li>
          ))}
        </ul>
      );
    }
    if (typeof data === 'object') {
      const entries = Object.entries(data as Record<string, any>);
      return (
        <div className="px-3 pb-3">
          {entries.map(([key, value]) => (
            <div key={key} className="mb-3">
              <div className="fw-bold mb-2 fs-6">{formatLabel(key)}</div>
              <div className="ms-1">
                {typeof value === 'object' ? renderSummary(value) : <p className="mb-2">{String(value ?? '')}</p>}
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // --- Add: Handle unitPayload from navigation state and create application in project ---
  useEffect(() => {
    const unitPayload = location?.state?.unitPayload;
    if (!unitPayload) return;
    // Fetch all projects, find the matching one, and add the application if not present
    (async () => {
      try {
        // Get all projects
        const detailsRes = await Api.postData(`${API_BASE}/azure_migrate_session_details/all`, {});
        const detailsPayload: any = detailsRes?.data;
        const detailsList = Array.isArray(detailsPayload)
          ? detailsPayload
          : (Array.isArray(detailsPayload?.data) ? detailsPayload.data : []);
        // Find the project by name
        const selected = detailsList.find((p: any) => String(p?.Project ?? p?.project) === String(unitPayload.Project));
        if (!selected) return;
        const selectedProjectId = selected?.id ?? selected?._id ?? selected?.Id ?? selected?.project_id;
        // Get existing applications
        const existingApps: any[] = Array.isArray(selected?.Applications)
          ? selected.Applications.map((a: any) => ({ OrderID: String(a?.OrderID), ApplicationName: String(a?.ApplicationName) }))
          : [];
        // Add the new application if not present
        const appExists = existingApps.some(a => a.OrderID === unitPayload.OrderID && a.ApplicationName === unitPayload.Project);
        if (!appExists) {
          existingApps.push({ OrderID: unitPayload.OrderID, ApplicationName: unitPayload.Project });
          // Update project with new application
          await Api.putData(`${API_BASE}/azure_migrate_session_details/`, {
            Project: unitPayload.Project,
            Cloud: unitPayload.Cloud,
            UserID: loggedInEmail,
            Applications: existingApps,
            Status: selected.Status,
            project_id: selectedProjectId,
          }, selectedProjectId);
        }
        // Show all applications in this project (set to state for rendering)
        setAllApplications(existingApps);
      } catch (err) {
        console.error('[unitPayload Application Add] error:', err);
      }
    })();
  }, [location?.state?.unitPayload, loggedInEmail]);
  const [allApplications, setAllApplications] = useState<any[]>([]);

  return (
    <div className="container-fluid" style={{ backgroundColor: 'rgb(189 203 224)', padding: '2px' }}>
      <Loader isLoading={isLoading} load={null} />

      <HeaderBar content="Cloud Assessment Report" position="center" />
      <Snackbar
        open={toastOpen}
        autoHideDuration={toastMsg === "Processing please wait.."?null: 4000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        style={{ zIndex: 3000 }} // Ensure Snackbar is above loading screen
      >
        <Alert onClose={() => setToastOpen(false)} severity={toastSeverity} variant="filled" sx={{ width: '100%' }}>
          {toastMsg}
        </Alert>
      </Snackbar>
      {/* Upload dialog removed; download handled by main download icon */}
      <div className='row'>
        <div className='col-5' style={{ backgroundColor: 'rgba(225, 225, 225, 0.38)' }}>

          <div className='p-3'>
            <HeaderBar content="Chat Assist" position="center" />
            <div
              className="mt-1 rounded-bottom d-flex flex-column"
              style={{ minHeight: "63vh" }}
            >

              <ChatWindow chatHistory={chatHistory} isTyping={isTyping} />
              {/* {chatHistory.some((m) => m.sender === 'bot') && (
          <div className="px-3 pt-3">
            <div className="text-muted mb-2" style={{ fontSize: '14px' }}>
              Review the generated results. What actions would you like to take?
            </div>
            <div className="d-flex justify-content-center gap-3">
              <button type="button" className="btn cloud-cta-btn" onClick={handleEdit}>Edit</button>
              <button type="button" className="btn cloud-cta-btn" onClick={handleApprove}>Approve</button>
            </div>
          </div>
        )} */}

              <TypingDotsStyle />
              <div style={{ display: hidden ? "none" : " " }}>
                <TeachAssistInput onSend={sendMessage} placeholder="Type your prompt" />
              </div>

            </div>
          </div>

        </div>
        <div className='col-7'>

          <div className='p-3'>
            <HeaderBar content="Generated Response" position="center" />
            <div
              className="mt-1 rounded-bottom d-flex flex-column"
              style={{ maxHeight: "63vh", overflowY: "auto", backgroundColor: " rgba(251, 253, 255, 1)" }}
            >
              {isSummaryLoading ? (
                <div className="d-flex align-items-center justify-content-center p-4">
                  <span className="spinner-border me-2" role="status" aria-hidden="true"></span>
                  <span>Loading generated response...</span>
                </div>
              ) : generatedSummary ? (
                renderSummary(generatedSummary)
              ) : (
                <p className="p-3 card_p">Generated response will appear here once available.</p>
              )}
            </div>
          </div>

        </div>
        <div className="">
          <div className="row align-items-center">
            <div className='col-2 d-flex justify-content-end align-items-center gap-2'>
              <button type="button" className="btn cloud-cta-btn px-4" onClick={handleSave}>Save</button>
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
            <div className='col-2 d-flex justify-content-start align-items-center gap-2'>
              {/* <button type="button" className="btn btn-outline-primary d-flex align-items-center justify-content-center" style={{ width: "28px", height: "28px" }} onClick={handleUploadClick}> */}
              <Tooltip title="Upload filled Intake form" placement="top">
                <button type="button" className="btn btn-outline-primary d-flex align-items-center justify-content-center" style={{ width: "28px", height: "28px" }} onClick={handleUploadClick}>
                  <FontAwesomeIcon icon={faUpload} />
                </button>
              </Tooltip>
              {downloadLink && (
                <Tooltip title="Download Intake form" placement="top">
                  <button type="button" className="btn btn-outline-primary d-flex align-items-center justify-content-center" style={{ width: "28px", height: "28px" }} onClick={handleDownloadClick}>
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                </Tooltip>
              )}
              <button
                type="button"
                className="btn cloud-cta-btn px-4"
                onClick={handleProceed}
                // disabled={!canProceed}
                title={!canProceed ? 'Proceed will be enabled after partial completion' : ''}
              >
                Proceed
              </button>
              <input ref={fileInputRef} type="file" className="d-none" onChange={handleFileChange} />
            </div>
          </div>
        </div>
      </div>

      {/* Show all applications for the project if available */}
      {allApplications.length > 0 && (
        <div className="mb-3">
          <h5>Applications in this Project:</h5>
          <ul>
            {allApplications.map((app, idx) => (
              <li key={idx}>{app.ApplicationName} (OrderID: {app.OrderID})</li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
};

export default CloudAssessmentReport;


