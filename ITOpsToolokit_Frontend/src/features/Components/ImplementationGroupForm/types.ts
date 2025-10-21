export interface FormData {
    groupName: string;
    description: string;
    application: string;
    environment: string;
    os: string;
    server: string;
    changeRequestType: string;
    service: string;
    changeOwner: string;
    assignmentGroup: string;
    cloud: string;
    provider: string;
    serverId?: string;
    assignmentGroupId?: string;
  }
  
  export interface Errors {
    groupName?: string;
    description?: string;
    application?: string;
    environment?: string;
    os?: string;
    server?: string;
    changeRequestType?: string;
    service?: string;
    changeOwner?: string;
    assignmentGroup?: string;
    cloud?: string;
    provider?: string;
    assignmentGroupId?: string;
  }
  
  export interface WeekOption {
    value: number;
    label: string;
  }
  
  export interface ScheduleProfileLayoutProps {
    handleClose: () => void;
  }