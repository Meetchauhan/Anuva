import { axiosPrivate } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IntakeForm {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
}

const initialState = {
    loading: false,
    error: null as string | null,
    intakeform: [] as IntakeForm[],
}

export const fetchIntakeform = createAsyncThunk("intakeform/fetchIntakeform", async () => {
  const response = await axiosPrivate.get("/api/form/intakeform");
  return response.data;
});

const intakeformSlice = createSlice({
  name: "intakeform",
  initialState,
  reducers: { },
  extraReducers: (builder) => {
    builder.addCase(fetchIntakeform.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchIntakeform.fulfilled, (state, action) => {
      state.loading = false;
      state.intakeform = action.payload;
    });
    builder.addCase(fetchIntakeform.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || null;
    });
  }
});

export default intakeformSlice.reducer;