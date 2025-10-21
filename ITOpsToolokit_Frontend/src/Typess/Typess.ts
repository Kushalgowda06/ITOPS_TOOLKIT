export interface Server {

    name: string;
  
  }
   
  export interface FormData {
  
    implementationGroup: string;
  
    description: string;
  
    applicationName: string;
  
    environment: string;
  
    servers: Server[];
  
    patchSchedule: {
  
      startTime: string;
  
      endTime: string;
  
      recurring: boolean;
  
    };
  
    approvalRequired: {
  
      patching: boolean;
  
      reboot: boolean;
  
    };
  
    manualTrigger: {
  
      patching: boolean;
  
      reboot: boolean;
  
    };
  
    changeRequestType: string;
  
    changeOwner: string;
  
    service: string;
  
    assignmentGroup: string;
  
    changeRequestRequired: boolean;
  
  }
   
  export interface HeaderProps {
  
    onTabChange: (tab: string) => void;
  
    activeTab: string;
  
  }
  export interface PatchStatusDataItem {
    _id: string;
    GroupName: string;
    Cloud: string;
    OS: string;
    ServerName: string;
    ServerIP: string;
    LastPatch: string;
    LastPatchBy: string;
    NewAvailable: string;
    AvailablePatches: { Size: string; Title: string }[];
    PatchDate: string;
  }
  
  
  
   
  export interface DashboardTileProps {
  
    title: string;
  
    value: string;
  
    showChart: boolean;
  
    chartType: 'doughnut' | 'overdue' | 'patch-details' | 'status-bars' | 'horizontal-bar' | 'table' | 'patch-status-table';
  
  }
   
  export interface TableDataItem {
  
    id: string;
  
    date: string;
  
    owner: string;
  
    title: string;
  
    resources: string;
  
  }
   
  export interface PatchStatusDataItem {
  
    provider: string;
  
    os: string;
  
    resourceName: string;
  
    patchGroup: string;
  
    status: string;
  
    startDate: string;
  
    endDate: string;
  
    change: string;
  
    environment: string;
  
    scanDate: string;
  
  }
   
  export interface AvailablePatch {
  
    Size: string;
  
    Title: string;
  
  }
   
  export interface PatchDashboardData {
    PatchStartDate: Date;
    Provider(Provider: any): unknown;
    Os: any;
    ShortDescription: String;
    Description: String;
    ResourceName: any;
    Application: any;
    CRStatus:any;
    
    _id: string;
  
    GroupName: string;
  
    Cloud: string;
  
    OS: string;
  
    ServerName: string;
  
    ServerIP: string;
  
    LastPatch: string;
  
    LastPatchBy: string;
  
    NewAvailable: string;
  
    AvailablePatches: AvailablePatch[];
  
    PatchDate: string;
  
  }
   
  export interface ApiResponse {
    filter(arg0: (item: any) => any): unknown;
    map(arg0: (item: any) => any): unknown;
  
    data: PatchDashboardData[];
  
    code: number;
  
    message: string;
  
  }
   