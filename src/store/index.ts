import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import reducers
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import tasksReducer from './slices/tasksSlice';
import userReducer from './slices/userSlice';
import departmentReducer from './slices/departmentSlice';
import teamReducer from './slices/teamSlice';
import teamMemberReducer from './slices/teamMemberSlice';
import reportReducer from './slices/reportSlice';
import leaveReducer from './slices/leaveSlice';
import approvalReducer from './slices/approvalSlice';
import leaveHistoryReducer from './slices/leaveHistorySlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'], 
};

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  tasks: tasksReducer,
  user: userReducer,
  departments: departmentReducer,
  teams: teamReducer,
  teamMembers: teamMemberReducer,
  reports: reportReducer,
  leave: leaveReducer,
  approvals: approvalReducer,
  leaveHistory: leaveHistoryReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppDispatch = typeof store.dispatch;

// Use these typed hooks throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;