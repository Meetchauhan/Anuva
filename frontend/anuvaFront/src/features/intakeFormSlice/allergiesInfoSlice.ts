import { axiosPrivate } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState = {
loading: false,
error: null as string | null,
};

export const allergiesInfoForm = createAsyncThunk("allergiesInfo/fetchAllergiesInfo", async (data: any) => {
  const response = await axiosPrivate.post("/api/forms/allergies-form", data);
  return response.data;
});

const allergiesInfoSlice = createSlice({
  name: "allergiesInfo",
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(allergiesInfoForm.pending, (state) => {
        state.loading = true;
      })
      .addCase(allergiesInfoForm.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(allergiesInfoForm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "An error occurred";
      });
  },

});

export default allergiesInfoSlice.reducer;