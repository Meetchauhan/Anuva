import { axiosPrivate } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null as string | null,
};

export const familyHistoryInfoForm = createAsyncThunk("familyHistoryInfo/fetchFamilyHistoryInfo", async (data: any) => {
  const response = await axiosPrivate.post("/api/forms/family-history-form", data);
  return response.data;
});

const familyHistoryInfoSlice = createSlice({
  name: "familyHistoryInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(familyHistoryInfoForm.pending, (state) => {
        state.loading = true;
      })
      .addCase(familyHistoryInfoForm.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(familyHistoryInfoForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export default familyHistoryInfoSlice.reducer;  