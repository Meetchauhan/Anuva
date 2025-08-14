import { axiosPrivate } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    error: null as string | null,
};

export const currentMedicationInfoForm = createAsyncThunk("currentMedicationsInfo/currentMedicationInfoForm", async (data: any) => {
    const response = await axiosPrivate.post("api/forms/current-medications-form", data);
    return response.data;
});

const currentMedicationsInfoSlice = createSlice({
  name: "currentMedicationsInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(currentMedicationInfoForm.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(currentMedicationInfoForm.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(currentMedicationInfoForm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Error submitting current medication information";
      });
  },
});

export default currentMedicationsInfoSlice.reducer;