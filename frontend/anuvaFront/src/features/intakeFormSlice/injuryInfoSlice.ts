import { axiosPrivate } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState = {
    loading: false,
    error: null,
    // injuryInfo: null,
};

export const injuryInfoForm = createAsyncThunk("injuryInfo/injuryInfoForm", async (data: any) => {
  const response = await axiosPrivate.post(`/api/injury-info`, data);
  return response.data;
});

const injuryInfoSlice = createSlice({
  name: "injuryInfo",
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder.addCase(injuryInfoForm.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(injuryInfoForm.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(injuryInfoForm.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    });
  },
});


export default injuryInfoSlice.reducer;
