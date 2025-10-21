import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import cloudReducer from '../features/Components/Cloudtoggle/CloudToggleSlice'
import commonConfigReducer from '../features/Components/CommonConfig/commonConfigSlice'
import patchReducer from '../features/Components/PatchingSlice/PatchingSlice'
import logger from '../middleware/logger';
import finopsReducer from '../features/Components/FinOpsPage/FinOpsDataSlice'
import techAssistReducer from '../features/Components/ISTM/TechAssistSlice'
import storageSession from 'redux-persist/lib/storage/session'
import { persistReducer } from 'redux-persist';

const persistConfig = {
  key: "root",
  version: 1,
  storage : storageSession
  // if you do not want to persist this part of the state
  // blacklist: ['omitedPart']
};


const reducer = combineReducers({
  cloud: cloudReducer,
  commonConfig: commonConfigReducer,
  finopsData: finopsReducer,
  patchData: patchReducer,
  techAssist: techAssistReducer
  // not persisting this reducer
  // omitedPart:OmitReducer
});
const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
});



export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
