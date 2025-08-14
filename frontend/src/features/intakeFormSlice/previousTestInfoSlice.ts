import { axiosPrivate } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null as string | null,
};

export const previousTestInfoForm = createAsyncThunk("previousTestInfo/fetchPreviousTestInfo", async (data: any) => {
  const response = await axiosPrivate.post("/api/forms/previous-tests-form", data);
  return response.data;
});

const previousTestInfoSlice = createSlice({
  name: "previousTestInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(previousTestInfoForm.pending, (state) => {
        state.loading = true;
      })
      .addCase(previousTestInfoForm.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(previousTestInfoForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },
});

export default previousTestInfoSlice.reducer;   