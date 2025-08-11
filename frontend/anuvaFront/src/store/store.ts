import { configureStore } from "@reduxjs/toolkit";
import adminAuthReducer from "@/features/adminAuthSlice";
import authReducer from "@/features/authSlice";
import patientReducer from "@/features/patientSlice";
import intakeformReducer from "@/features/intakeformSlice";
import patientInfoReducer from "@/features/intakeFormSlice/patientInfoSlice";
import symptomChecklistInfoReducer from "@/features/intakeFormSlice/symptomCheckistInfoSlice";
import additionalSymptomChecklistInfoReducer from "@/features/intakeFormSlice/additionalSymptomChecklistInfoSlice";
import headacheInfoReducer from "@/features/intakeFormSlice/headacheInfoSlice";
import sleepDisturbanceInfoReducer from "@/features/intakeFormSlice/sleepDisturbanceInfo";
import bodyPainInfoReducer from "@/features/intakeFormSlice/bodypainInfoSlice";

const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,  
    auth: authReducer,
    patient: patientReducer,
    intakeform: intakeformReducer,  
    patientInfo: patientInfoReducer,
    symptomChecklistInfo: symptomChecklistInfoReducer,
    additionalSymptomChecklistInfo: additionalSymptomChecklistInfoReducer,
    headacheInfo: headacheInfoReducer,
    sleepDisturbanceInfo: sleepDisturbanceInfoReducer,
    bodyPainInfo: bodyPainInfoReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
