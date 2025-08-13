import { axiosPrivate } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null as string | null,
};

export const seizureHistoryInfoForm = createAsyncThunk("seizureHistoryInfo/fetchSeizureHistoryInfo", async (data: any) => {
  const response = await axiosPrivate.post("/api/forms/seizure-history-form", data);  
  return response.data;
});

const seizureHistoryInfoSlice = createSlice({
  name: "seizureHistoryInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(seizureHistoryInfoForm.pending, (state) => {
        state.loading = true;
      })
      .addCase(seizureHistoryInfoForm.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(seizureHistoryInfoForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
    }
});

export default seizureHistoryInfoSlice.reducer;