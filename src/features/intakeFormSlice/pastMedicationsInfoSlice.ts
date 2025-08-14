import { axiosPrivate } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    error: null as string | null,
}

export const pastMedicationsInfoForm = createAsyncThunk("pastMedicationsInfo/pastMedicationsInfoForm", async (data: any) => {
    const response = await axiosPrivate.post("api/forms/past-medications-form", data);
    return response.data;
});

const pastMedicationsInfoSlice = createSlice({
  name: "pastMedicationsInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(pastMedicationsInfoForm.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(pastMedicationsInfoForm.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(pastMedicationsInfoForm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Error submitting past medications information";
      });
  },
});

export default pastMedicationsInfoSlice.reducer;