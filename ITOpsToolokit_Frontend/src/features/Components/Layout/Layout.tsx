import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Header from "../Header/Header";
import VerticalNavigation from "../Verticalmenu/VerticalNavigation";
import Cloudtable from "../Cloudtable/Cloudtable";
import AgingTable from "../AgingTable/AgingTable";
import TaggingPage from "../TaggingPage/TaggingPage";
import OrphanPage from "../OrphanPage/OrphanPage";
import ManageTaggingPolicy from "../ManageTaggingPolicy/ManageTaggingPolicy";
import { resetCloud } from "../Cloudtoggle/CloudToggleSlice";
import AzureMigrationForm from "../AzureMigrationForm/AzureMigrationForm";
import DynamicForms from "../DynamicForms/DynamicForms";
import LaunchStackDetails from "../LaunchStackDetails/LaunchStackDetails";
import SubscriptionForm from "../SubscriptionOnBoarding/SubscriptionForm";
import UserForm from "../UserOnBoarding/UserForm";
import RoleForm from "../RolesOnBoarding/RoleForm";
import ProjectForm from "../ProjectOnBoarding/ProjectForm";
import "../../../fonts/Gellix-Regular.ttf";
import Footer from "../Footer/Footer";
import OrphanTable from "../OrphanTable/OrphanTable";
import OrphanAgingTable from "../OrphanAgingTable/OrphanAgingTable";
import ScrollTop from "../ScrollTop/ScrollTop";
import StackOnoarding from "../StackOnboaring/StackOnoarding";
import CloudAdvisoryPage from "../CloudAdvisoryPage/CloudAdvisoryPage";
import CloudAdvisoryTable from "../CloudAdvisoryTable/CloudAdvisoryTable";
import AdvisoryAgingTable from "../AdvisoryAgingTable/AdvisoryAgingTable";
import VmWarePage from "../VmWarePage/VmWarePage";
import LoginPage from "../LoginPage/LoginPage";
import {
  resetChartDataSet,
  selectCommonConfig,
} from "../CommonConfig/commonConfigSlice";
import MyRequest from "../MyRequest/MyRequest";
import CloudOperationsPage from "../CloudOperationsPage/CloudOperationsPage";
import RoleAutomationPage from "../RoleBasedAutomation/RoleAutomationPage";
import KubernetesClusterManage from "../KubernetesClusterManage/KubernetesClusterManage";
import { ResizeVM } from "../ResizeVM/ResizeVM";
import { Windows } from "../Windows/Windows";
import KVersionUpgrade from "../CloudOperationsCards/KVersionUpgrade";
import FinOpsPage from "../FinOpsPage/FinOpsPage";
import AddAdvisoryPage from "../AddAdvisoryPage/AddAdvisoryPage";
import KanbanBoard from "../KanbanBoard/KanbanBoard";
import BUOnboarding from "../BUOnBoarding/BUOnboarding";
import ApplicationOnboarding from "../ApplicationOnboarding/ApplicationOnboarding";
import CostCodeOnboarding from "../CostCodeOnboarding/CostCodeOnboarding";
import UpdateOnboardingPage from "../UpdateOnboardingPage/UpdateOnboardingPage";
import OnboardingFormCards from "../OnboardingFormCards/OnboardingFormCards";
import LandingPage from "../LandingPage/LandingPage";
import ComplaincePage from "../ComplaincePage/ComplaincePage";
import ComplainceTable from "../ComplainceTable/ComplainceTable";
import ComplainceAgingTable from "../ComplainceAging/ComplainceAgingTable";
import PasswordPage from "../PaswordPage/PasswordPage";
import StackOnboardingForm from "../StackOnboardingForm/StackOnboardingForm";
import PatchForm from "../PatchOnboarding/PatchForm";
import ChatBot from "../Chatbot/Chatbot";
import Chatbot_Genai from "../Chatbot_Genai/Chatbot";
import { Linux } from "../Linux/Linux";
import { NotFound } from "../NotFound/NotFound";
import { Unauthorized } from "../UnauthorizedPage/Unauthorized";
import SubLandingPage from "../SubLandingPage/SubLandingPage";
import LandingIACHeader from "../Chatbot/LandingIACHeader";
import PatchDetails from "../PatchingDetails/PatchingDetails";
import OverDueData from "../OverdueStatus/OverDueData";
import ImplementationGroupForm from "../ImplementationGroupForm";
import PatchGroupsCreation from "../PatchGroupsCreation/PatchGroupsCreation";
import PatchDashboardPage from "../PatchDashboardPage/PatchDashboardPage";
import ImageChatbot from "../Chatbot_Genai/ImageChatbot";
import { NewWsComponent } from "../WsComponent/NewWsComponent";
import SocketChat from "../socketChat/SocketChat";
import AzureMigrate from "../Chatbot/AzureMigrate";
import MainLayout from "../ISTM/MainLayout";
import Dashboard from "../Analytics AI/Dashboard";
import { WsComponent } from "../WsComponent/WsComponent";
import AksClusterDashboard from "../AksCluster/AksClusterDashboard";
import AWSMigrationForm from "../AWSMigrationTool/AWSMigrationForm";
import IACLayout from "../IAC/IACLayout";
import GcpMigrationForm from "../GCP Migration Tool/GcpMigrationForm";
import AzureUpload from "../AzureUpload/AzureUpload";
import DarkLandingPage from "../LandingPage/DarkLandingPage";
import DashboardPage from "../LandingPage/DashboardPage";
import ChangeAssist from "../ChangeAssist/ChangeAssist";
import MigrationDashboard from "../CloudMigration/MigrationDashboard";
import AssessmentReport from "../CloudMigration/AssessmentReport";
import CloudAssessmentReport from "../CloudMigration/CloudAssessmentReport";
import MigrationPlan from "../CloudMigration/MigrationPlan";
import ProblemAssist from "../ProblemAssist/ProblemAssist";
import KnowledgeAssistLanding from "../KnowledgeAssist/KnowledgeAssistLanding";
import ChangeLandingPage from "../Autonomous ITOps/ChangeLandingPage";
import ITOps from "../Autonomous ITOps/ITOps";
import DevOps_IAC from "../Autonomous ITOps/Compliance_AI";
import WorkNext from "../Autonomous ITOps/Transition_AI";
import Analytics from "../Autonomous ITOps/Analytics";
import Compliance_AI from "../Autonomous ITOps/Compliance_AI";
import Transition_AI from "../Autonomous ITOps/Transition_AI";
import TrainAssist from "../Train Assist/TrainAssist";
import { AuthProvider } from "../../../contexts/AuthContext";

const Layout: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useAppDispatch();
  const storeData = useAppSelector(selectCommonConfig);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(resetCloud());
    dispatch(resetChartDataSet());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    if (window.location.pathname === "/") {
      navigate("/home");
    }
  }, [navigate]);

  return pathname.includes("/NotFound") ? <NotFound /> : storeData.loginDetails?.validation ? (
    <div className="h-100 text-primary Itsm_bg_image font-container">
      <Header />
      <div className="h-100">
        <div className="main-content row m-0">
          {/* <div className="col-1 h-100 gx-0">
            <div className="glass-vertical-nav ">
              <VerticalNavigation />
            </div>
          </div> */}
          <div className={`col overflow-auto gx-0 glass-content-area  ${(pathname.includes("/change-assist-land") || pathname.includes("/itops") || pathname.includes("/workNext") || pathname.includes("/devOps_IAC")) ? 'landing_scorll' : ''} `}>
            <ScrollTop />
            <AuthProvider>
              <Routes>
                {/* <Route path="/newLogin" element={<Login />} /> */}
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </AuthProvider>
            <Routes>
              <Route path="/home" element={<ChangeLandingPage />} />
              <Route path="/DarkLandingPage" element={<DarkLandingPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/welcome" element={<SubLandingPage />} />
              <Route path="/tagging-policy" element={<TaggingPage />} />
              <Route path="/orphan-objects" element={<OrphanPage />} />
              <Route path="/complaince-policy" element={<ComplaincePage />} />

              <Route
                path="/complaince-aging"
                element={<ComplainceAgingTable />}
              />
              <Route path="/objectaging" element={<AgingTable />} />
              <Route path="/orphanaging" element={<OrphanAgingTable />} />
              <Route path="/advisory-Aging" element={<AdvisoryAgingTable />} />
              <Route path="/add-advisory" element={<AddAdvisoryPage />} />
              <Route path="/details" element={<Cloudtable />} />
              <Route path="/orphan-details" element={<OrphanTable />} />
              <Route path="/complaince-details" element={<ComplainceTable />} />
              <Route
                path="/advisory-details"
                element={<CloudAdvisoryTable />}
              />
              <Route
                path="/manage-tagging-policy"
                element={<ManageTaggingPolicy />}
              />
              <Route path="/forms" element={<DynamicForms />} />
              <Route
                path="launch-stack/:Cloud/:launchStack"
                element={<LaunchStackDetails />}
              />
              <Route path="/BU-onboarding/" element={<BUOnboarding />} />
              <Route path="/onboarding/Patch-onboarding" element={<ImplementationGroupForm />} />
              <Route path="/BU-onboarding/:id" element={<BUOnboarding />} />
              <Route path="/project-onboarding" element={<ProjectForm />} />
              <Route path="/project-onboarding/:id" element={<ProjectForm />} />
              <Route
                path="/subscription-onboarding"
                element={<SubscriptionForm />}
              />
              <Route
                path="/subscription-onboarding/:id"
                element={<SubscriptionForm />}
              />
              <Route path="/user-onboarding" element={<UserForm />} />
              <Route path="/user-onboarding/:id" element={<UserForm />} />
              <Route path="/role-onboarding" element={<RoleForm />} />
              <Route path="/role-onboarding/:id" element={<RoleForm />} />
              <Route
                path="/costcode-onboarding"
                element={<CostCodeOnboarding />}
              />
              <Route
                path="/costcode-onboarding/:id"
                element={<CostCodeOnboarding />}
              />
              <Route
                path="/application-onboarding"
                element={<ApplicationOnboarding />}
              />
              <Route
                path="/application-onboarding/:id"
                element={<ApplicationOnboarding />}
              />
              <Route path="/onboarding" element={<UpdateOnboardingPage />} />
              <Route
                path="/onboarding/BU-onboarding-details"
                element={<OnboardingFormCards />}
              />
              <Route
                path="/onboarding/project-onboarding-details"
                element={<OnboardingFormCards />}
              />
              <Route
                path="/onboarding/subscription-onboarding-details"
                element={<OnboardingFormCards />}
              />
              <Route
                path="/onboarding/user-onboarding-details"
                element={<OnboardingFormCards />}
              />
              <Route
                path="/onboarding/role-onboarding-details"
                element={<OnboardingFormCards />}
              />
              <Route
                path="/onboarding/costcode-onboarding-details"
                element={<OnboardingFormCards />}
              />
              <Route
                path="/onboarding/application-onboarding-details"
                element={<OnboardingFormCards />}
              />
              <Route path="/stack-onboarding" element={<StackOnoarding />} />
              <Route path="/VmWare" element={<VmWarePage />} />
              <Route path="/cloud-advisory" element={<CloudAdvisoryPage />} />
              <Route path="/kanban-board" element={<KanbanBoard />} />
              {/* <Route path="/login" element={<LoginPage />} /> */}
              <Route path="/myRequest" element={<MyRequest />} />
              <Route path="tagging-policy/myRequest" element={<MyRequest />} />
              <Route path="orphan-objects/myRequest" element={<MyRequest />} />
              <Route path="/password-reset" element={<PasswordPage />} />

              <Route
                path="/Cloud-operations/Kubernetes-cluster-manager/version-upgrade"
                element={<KVersionUpgrade />}
              />
              <Route
                path="/Cloud-operations/Kubernetes-cluster-manager/node-manager"
                element={<KVersionUpgrade />}
              />
              <Route
                path="/Cloud-operations/Kubernetes-cluster-manager/ingress-egress"
                element={<KVersionUpgrade />}
              />
              <Route
                path="/Cloud-operations/Kubernetes-cluster-manager/container-deployment"
                element={<KVersionUpgrade />}
              />
              <Route
                path="/Cloud-operations"
                element={<CloudOperationsPage />}
              />
              <Route path="/Cloud-operations/Kubernetes-cluster-manager">
                <Route index={true} element={<KubernetesClusterManage />} />
              </Route>
              <Route
                path="/Cloud-operations/Resize-vm"
                element={<ResizeVM />}
              />
              <Route
                path="/Cloud-operations/Vm-status-manager"
                element={<ResizeVM />}
              />
              <Route path="/FinopsDashboard" element={<FinOpsPage />} />
              <Route path="/stack" element={<StackOnboardingForm />} />
              <Route path="/BuildAutomate" element={<Chatbot_Genai />} />
              <Route path="/chatbot" element={<ChatBot />} />
              <Route path="/LandingIAC" element={<LandingIACHeader />} />

              <Route
                path="/stack"
                element={<StackOnboardingForm />}
              />

              <Route
                path="/Role-Based-Automation"
                element={<RoleAutomationPage />}
              />
              <Route
                path="/Role-Based-Automation/Windows"
                element={<Windows />}
              />
              <Route
                path="/Role-Based-Automation/Linux"
                element={<Linux />}
              />
              <Route path="/Patch-Dashboard" element={<PatchDashboardPage />} />
              <Route path="/PatchGroupsCreation" element={<PatchGroupsCreation />} />
              <Route path="/patch-form" element={<ImplementationGroupForm />} />
              <Route path="/patchingstatus-details" element={<PatchDetails />} />
              <Route path="/overdue-data" element={<OverDueData />} />
              <Route path="/azure-upload" element={<AzureUpload />} />

              <Route
                path="/AzureMigrationForm"
                element={<AzureMigrationForm />}
              />
              <Route
                path="/AksClusterDashboard"
                element={<AksClusterDashboard />}
              />

              <Route
                path="/AWSMigrationForm"
                element={<AWSMigrationForm />}
              />
              <Route
                path="/GCPMigrationForm"
                element={<GcpMigrationForm />}
              />
              <Route path="/Unauthorized" element={<Unauthorized />} />
              <Route path="/image-chatbot" element={<ImageChatbot />} />
              {/* <Route path="/log-analytics" element={<ErrorAnalysis />} /> */}
              <Route path="/ws" element={<WsComponent />} />
              <Route path="/wsNew" element={<NewWsComponent />} />
              <Route path="/azureMigrate" element={<AzureMigrate />} />
              <Route path="/socket" element={<SocketChat />} />
              <Route path="/itsm" element={<MainLayout />} />
              <Route path="/Analytics_AI" element={<Dashboard />} />
              <Route path="/Analytics_AI/:cardTitle" element={<Dashboard />} />
              <Route path="/Iac" element={<IACLayout />} />
              <Route path="/knowledge-assist" element={<KnowledgeAssistLanding />} />
              <Route path="/change-assist" element={<ChangeAssist />} />
              <Route path="/MigrationDashboard" element={<MigrationDashboard />} />
              <Route path="/AssessmentReport" element={<AssessmentReport />} />
              <Route path="/CloudAssessmentReport" element={<CloudAssessmentReport />} />
              <Route path="/MigrationPlan" element={<MigrationPlan />} />
              <Route path="/ProblemAssist" element={<ProblemAssist />} />
              <Route path="/change-assist-land" element={<ChangeLandingPage />} />
              <Route path="/itops" element={<ITOps />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/Compliance_AI" element={<Compliance_AI />} />
              <Route path="/Transition_AI" element={<Transition_AI />} />
              <Route path="/TrainAssist" element={< TrainAssist />} />
            </Routes>

          </div>
        </div>
      </div>
      <Footer />

    </div>
  ) : (
    <AuthProvider>
      <LoginPage />
    </AuthProvider>
  );
};
export default Layout;
