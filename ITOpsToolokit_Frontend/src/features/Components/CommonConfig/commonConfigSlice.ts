import { createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../../app/store";

export interface CommonConfigSlice {
  //   value: number;
  cloudData: Array<any>;
  filteredTaggingData: Array<any>;
  filterArray: Array<any>;
  orphanData: Array<any>;
  complianceData: Array<any>;
  launchStackData: Array<any>;
  advisoryData: Array<any>;
  loginDetails: any;
  hasKcLogout:any;
  usersApiData: Array<any>;
  userRolesApiData: Array<any>;
  filteredOrphanData: Array<any>;
  filterOrphanArray: Array<any>;
  filteredAdvisoryData: Array<any>;
  filterAdvisoryArray: Array<any>;
  filteredComplainceData: Array<any>;
  filterComplainceArray: Array<any>;
  activeUserDetails: any;
  appBarDataset: any;
  barChartDataset: any;
  complaincebarChartDataset: any;
  ticketDetailsData: Array<any>;
  awsVmData: Array<any>;
  azureVmData: Array<any>;
  gcpVmData: Array<any>;
  allVmData: Array<any>;
  k8sData: Array<any>;
  activeOnboarding: string;
  usersLocalStorage: any;
  dropdownsApiData: any;
  tagsFilterData: any;
  AzureLocation: Array<any>;
  GcpRegion: Array<any>;
  GcpDbName: Array<any>;
  GcpImage: Array<any>;
  AzureVmlist: Array<any>;
  AzureSize: Array<any>;
  AwsSize: Array<any>;
  AwsRegion: Array<any>;
  AwsDropdowndata: Array<any>;
  AwsPassDb: Array<any>;
  Cluster: Array<any>;
  Container: Array<any>;

  GcpVm: Array<any>;
  GcpCluster: Array<any>;
  GcpNetwork: Array<any>;
  OrphanDeletedCost: any;
  AdvisoryCost: any;
  orderId?: string | null;
}

const initialState: CommonConfigSlice = {
  //   value: 0,
  cloudData: [],
  filteredTaggingData: [],
  filterArray: [],
  orphanData: [],
  complianceData: [],
  filteredOrphanData: [],
  filterOrphanArray: [],
  filteredAdvisoryData: [],
  filterAdvisoryArray: [],
  filteredComplainceData: [],
  filterComplainceArray: [],
  launchStackData: [],
  advisoryData: [],
  loginDetails: { validation: false },
  hasKcLogout: false,
  // loginDetails: { 'validation': false, 'currentUser': null },
  usersApiData: [],
  appBarDataset: null,
  activeUserDetails: {},
  userRolesApiData: [],
  barChartDataset: null,
  complaincebarChartDataset: null,
  ticketDetailsData: [],
  awsVmData: [],
  azureVmData: [],
  gcpVmData: [],
  allVmData: [],
  k8sData: [],
  activeOnboarding: "",
  usersLocalStorage: {},
  dropdownsApiData: [],
  tagsFilterData: [],
  AzureLocation: [],
  GcpRegion: [],
  GcpDbName: [],
  GcpImage: [],
  AzureVmlist: [],
  AzureSize: [],
  AwsSize: [],
  AwsRegion:[],
  AwsDropdowndata: [],
  AwsPassDb: [],
  Cluster: [],
  Container: [],

  GcpVm: [],
  GcpCluster: [],
  GcpNetwork: [],
  OrphanDeletedCost: "",
  AdvisoryCost: "",
  orderId: null,
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
// export const incrementAsync = createAsyncThunk(
//   'counter/fetchCount',
//   async (amount: number) => {
//     const response = await fetchCount(amount);
//     // The value we return becomes the `fulfilled` action payload
//     return response.data;
//   }
// );

const filterDataFunc = (data, filters) => {
  return data.filter((item: any) => {
    return filters.every((filter: any) => {
      const { key, values } = filter;
      return values.includes(item[key]);
    });
  });
};

export const updateTaggingFilterData =
  (): AppThunk => async (dispatch, getState) => {
    let cloudData = selectCommonConfig(getState());
    if (cloudData.filterArray.length >= 1) {
      let tempFilterData = await filterDataFunc(
        cloudData.cloudData,
        cloudData.filterArray
      );
      dispatch(setFilteredTaggingData(tempFilterData));
    } else {
      dispatch(setFilteredTaggingData(cloudData.cloudData));
    }
  };

export const updatetaggingFilterArray =
  (value: any): AppThunk =>
  (dispatch, getState) => {
    let cloudData = selectCommonConfig(getState());
    // var tempstore = [... cloudData]
    let tempstore = [...cloudData.filterArray];
    const index = tempstore.findIndex((item: any) => item.key === value.key);
    if (index !== -1) {
      tempstore.splice(index, 1);
    } else {
      tempstore.push(value);
    }
    dispatch(setFilterArray(tempstore));
    // updateTaggingFilterData()
  };
// orphanfilter
export const updateOrphanFilterData =
  (): AppThunk => async (dispatch, getState) => {
    let cloudData = selectCommonConfig(getState());
    if (cloudData.filterOrphanArray.length >= 1) {
      let tempFilterData = await filterDataFunc(
        cloudData.orphanData,
        cloudData.filterOrphanArray
      );
      dispatch(setFilteredOrphanData(tempFilterData));
    } else {
      dispatch(setFilteredOrphanData(cloudData.orphanData));
    }
  };

export const updateorphanFilterArray =
  (value: any): AppThunk =>
  (dispatch, getState) => {
    let cloudData = selectCommonConfig(getState());
    // var tempstore = [... cloudData]
    let tempstore = [...cloudData.filterOrphanArray];
    const index = tempstore.findIndex((item: any) => item.key === value.key);
    if (index !== -1) {
      tempstore.splice(index, 1);
    } else {
      tempstore.push(value);
    }
    dispatch(setFilterOrphanArray(tempstore));
    // updateOrphanFilterData()
  };
//advisory filter

export const updateAdvisoryFilterData =
  (): AppThunk => async (dispatch, getState) => {
    let cloudData = selectCommonConfig(getState());
    if (cloudData.filterAdvisoryArray.length >= 1) {
      let tempFilterData = await filterDataFunc(
        cloudData.advisoryData,
        cloudData.filterAdvisoryArray
      );
      dispatch(setFilteredAdvisoryData(tempFilterData));
    } else {
      dispatch(setFilteredAdvisoryData(cloudData.advisoryData));
    }
  };

export const updateadvisoryFilterArray =
  (value: any): AppThunk =>
  (dispatch, getState) => {
    let cloudData = selectCommonConfig(getState());
    // var tempstore = [... cloudData]
    let tempstore = [...cloudData.filterAdvisoryArray];
    const index = tempstore.findIndex((item: any) => item.key === value.key);
    if (index !== -1) {
      tempstore.splice(index, 1);
    } else {
      tempstore.push(value);
    }
    dispatch(setFilterAdvisoryArray(tempstore));
    // updateAdvisoryFilterData()
  };
//complaince
export const updateComplainceFilterData =
  (): AppThunk => async (dispatch, getState) => {
    let cloudData = selectCommonConfig(getState());
    if (cloudData?.filterComplainceArray?.length >= 1) {
      let tempFilterData = await filterDataFunc(
        cloudData?.complianceData,
        cloudData?.filterComplainceArray
      );
      dispatch(setFilteredComplainceData(tempFilterData));
    } else {
      dispatch(setFilteredComplainceData(cloudData?.complianceData));
    }
  };

export const updatecomplainceFilterArray =
  (value: any): AppThunk =>
  (dispatch, getState) => {
    let cloudData = selectCommonConfig(getState());
    // var tempstore = [... cloudData]
    let tempstore = [...cloudData?.filterComplainceArray];
    const index = tempstore?.findIndex((item: any) => item.key === value.key);
    if (index !== -1) {
      tempstore.splice(index, 1);
    } else {
      tempstore.push(value);
    }
    dispatch(setFilterComplainceArray(tempstore));
    // updateOrphanFilterData()
  };
export const updateTaggingDropdownFilterArray =
  (value: any): AppThunk =>
  (dispatch) => {
    dispatch(setFilterArray([value]));
    dispatch(setFilterOrphanArray([value]));
    dispatch(setFilterAdvisoryArray([value]));
    dispatch(setFilterComplainceArray([value]));
  };

export function fetchCount(amount = 1) {
  return new Promise<{ data: number }>((resolve) =>
    setTimeout(() => resolve({ data: amount }), 500)
  );
}

export const commonConfligSlice = createSlice({
  name: "commonConfligSlice",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setCloudData: (state, action) => {
      state.cloudData = action.payload;
    },
    setOrderId: (state, action) => {
      state.orderId = action.payload;
    },
    setFilteredTaggingData: (state, action) => {
      state.filteredTaggingData = action.payload;
    },
    setFilterArray: (state, action) => {
      state.filterArray = action.payload;
    },
    setFilteredOrphanData: (state, action) => {
      state.filteredOrphanData = action.payload;
    },
    setFilterOrphanArray: (state, action) => {
      state.filterOrphanArray = action.payload;
    },
    setFilteredAdvisoryData: (state, action) => {
      state.filteredAdvisoryData = action.payload;
    },
    setFilterAdvisoryArray: (state, action) => {
      state.filterAdvisoryArray = action.payload;
    },
    setOrphanData: (state, action) => {
      state.orphanData = action.payload;
    },
    setComplianceData: (state, action) => {
      state.complianceData = action.payload;
    },
    setFilteredComplainceData: (state, action) => {
      state.filteredComplainceData = action.payload;
    },
    setFilterComplainceArray: (state, action) => {
      state.filterComplainceArray = action.payload;
    },
    setLaunchStackData: (state, action) => {
      state.launchStackData = action.payload;
    },
    setAdvisoryData: (state, action) => {
      state.advisoryData = action.payload;
    },
    setLoginDetails: (state, action) => {
      state.loginDetails = action.payload;
      // state.loginDetails = action.payload
    },
    setUsersApiData: (state, action) => {
      state.usersApiData = action.payload;
    },
    setAppBarDataset: (state, action) => {
      state.appBarDataset = action.payload;
    },
    resetAppBarDataset: (state, action) => {
      state.appBarDataset = null;
    },
    setActiveUserDetails: (state, action) => {
      state.activeUserDetails = action.payload;
    },
    setUserRolesApiData: (state, action) => {
      state.userRolesApiData = action.payload;
    },
    setBarChartDataSet: (state, action) => {
      state.barChartDataset = action.payload;
    },
    resetChartDataSet: (state) => {
      state.barChartDataset = null;
    },
    setComplainceBarChartDataSet: (state, action) => {
      state.complaincebarChartDataset = action.payload;
    },
    resetComplainceChartDataSet: (state) => {
      state.complaincebarChartDataset = null;
    },
    setTicketDetailsData: (state, action) => {
      state.ticketDetailsData = action.payload;
    },
    setAwsVmData: (state, action) => {
      state.awsVmData = action.payload;
    },
    setAwsRegion: (state, action) => {
      state.AwsRegion = action.payload;
    },
    setAzureVmData: (state, action) => {
      state.azureVmData = action.payload;
    },
    setGcpVmData: (state, action) => {
      state.gcpVmData = action.payload;
    },
    setAllVmData: (state, action) => {
      state.allVmData = action.payload;
    },
    setK8SData: (state, action) => {
      state.k8sData = action.payload;
    },
    setActiveOnboarding: (state, action) => {
      state.activeOnboarding = action.payload;
    },
    resetLoginDetails: (state) => {
      state.loginDetails = { validation: false };
    },
    hasKClogout: (state , action) => {
      state.hasKcLogout = action.payload;
    },
    setLocalStorageUsers: (state, action) => {
      state.usersLocalStorage = action.payload;
    },
    setDropdownsApi: (state, action) => {
      state.dropdownsApiData = action.payload;
    },
    setTagsFilterData: (state, action) => {
      state.tagsFilterData = action.payload;
    },
    setAzureLocation: (state, action) => {
      state.AzureLocation = action.payload;
    },
    setGcpRegion: (state, action) => {
      state.GcpRegion = action.payload;
    },
    setGcpDbName: (state, action) => {
      state.GcpDbName = action.payload;
    },
    setGcpImage: (state, action) => {
      state.GcpImage = action.payload;
    },
    setAzureVmlist: (state, action) => {
      state.AzureVmlist = action.payload;
    },
    setAzureSize: (state, action) => {
      state.AzureSize = action.payload;
    },
    setAwsSize: (state, action) => {
      state.AwsSize = action.payload;
    },
    setAwsDropdowndata: (state, action) => {
      state.AwsDropdowndata = action.payload;
    },
    setAwsPassDb: (state, action) => {
      state.AwsPassDb = action.payload;
    },
    setCluster: (state, action) => {
      state.Cluster = action.payload;
    },
    setContainer: (state, action) => {
      state.Container = action.payload;
    },

    setGcpVm: (state, action) => {
      state.GcpVm = action.payload;
    },
    setGcpCluster: (state, action) => {
      state.GcpCluster = action.payload;
    },
    setGcpNetwork: (state, action) => {
      state.GcpNetwork = action.payload;
    },
    setOrphanDeletedCost: (state, action) => {
      state.OrphanDeletedCost = action.payload;
    },
    setAdvisoryCost: (state, action) => {
      state.AdvisoryCost = action.payload;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(updateTaggingFilterData.pending, (state) => {
  //       state.filteredTaggingData = [];
  //     })
  //     .addCase(updateTaggingFilterData.fulfilled, (state, action) => {
  //       state.filteredTaggingData = action.payload;
  //     })
  //     .addCase(updateTaggingFilterData.rejected, (state) => {
  //       state.filteredTaggingData = [];
  //     });
  // },
});

export const {
  setCloudData,
  setOrderId,
  setFilteredTaggingData,
  setFilterArray,
  setOrphanData,
  setFilterOrphanArray,
  setFilteredOrphanData,
  setFilterAdvisoryArray,
  setFilteredAdvisoryData,
  setFilterComplainceArray,
  setFilteredComplainceData,
  setLaunchStackData,
  setAdvisoryData,
  setLoginDetails,
  setUsersApiData,
  setActiveUserDetails,
  setUserRolesApiData,
  setBarChartDataSet,
  setComplainceBarChartDataSet,
  resetChartDataSet,
  setTicketDetailsData,
  setAppBarDataset,
  resetAppBarDataset,
  setAwsVmData,
  setAzureVmData,
  setGcpVmData,
  setAllVmData,
  setK8SData,
  setComplianceData,
  setActiveOnboarding,
  resetLoginDetails,
  hasKClogout,
  setLocalStorageUsers,
  setDropdownsApi,
  setTagsFilterData,
  setAzureLocation,
  setGcpRegion,
  setGcpDbName,
  setGcpImage,
  setAzureVmlist,
  setAzureSize,
  setAwsSize,
  setAwsDropdowndata,
  setAwsPassDb,
  setCluster,
  setContainer,
  setGcpCluster,
  setGcpNetwork,
  setGcpVm,
  setOrphanDeletedCost,
  setAdvisoryCost,
  setAwsRegion,
} = commonConfligSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCommonConfig = (state: RootState) => state.commonConfig;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// export const incrementIfOdd =
//   (amount: number): AppThunk =>
//   (dispatch, getState) => {
//     const currentValue = selectCount(getState());
//     if (currentValue % 2 === 1) {
//       dispatch(incrementByAmount(amount));
//     }
//   };

export default commonConfligSlice.reducer;
