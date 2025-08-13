import { axiosPrivate } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null as string | null,
};

export const substanceUseHistoryInfoForm = createAsyncThunk("substanceUseHistoryInfo/fetchSubstanceUseHistoryInfo", async (data: any) => {
  const response = await axiosPrivate.post("/api/forms/substance-use-history-form", data);
  return response.data;
});

const substanceUseHistoryInfoSlice = createSlice({
  name: "substanceUseHistoryInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(substanceUseHistoryInfoForm.pending, (state) => {
        state.loading = true;
      })
      .addCase(substanceUseHistoryInfoForm.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(substanceUseHistoryInfoForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export default substanceUseHistoryInfoSlice.reducer;