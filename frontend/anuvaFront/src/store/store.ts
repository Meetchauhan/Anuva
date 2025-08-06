import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "@/features/adminAuthSlice";
import authReducer from "@/features/authSlice";
import patientReducer from "@/features/patientSlice";
import intakeformReducer from "@/features/intakeformSlice";
import patientInfoReducer from "@/features/intakeFormSlice/patientInfoSlice";

const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,  
    auth: authReducer,
    patient: patientReducer,
    intakeform: intakeformReducer,  
    patientInfo: patientInfoReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
