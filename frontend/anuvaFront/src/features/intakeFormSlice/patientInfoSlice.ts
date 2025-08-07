import { axiosPrivate } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  // patientInfo: null,
  loading: false,
  error: null as string | null,
};

export const patientInfoForm = createAsyncThunk("patientInfo", async (data: any) => {
  const response = await axiosPrivate.post("/api/forms/patient-info-form", data);
  return response.data;
});

const patientInfoSlice = createSlice({
  name: "patientInfo",
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
        builder.addCase(patientInfoForm.pending, (state) => {
        state.loading = true;
    });
    builder.addCase(patientInfoForm.fulfilled, (state, action) => {
      // state.patientInfo = action.payload;
      state.loading = false;
    });
    builder.addCase(patientInfoForm.rejected, (state, action) => {
      state.error = action.error.message || "An error occurred";
      state.loading = false;
    }); 
  },
});

export default patientInfoSlice.reducer;