import { axiosPrivate } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null as string | null,
}

export const surgicalHistoryInfoForm = createAsyncThunk("surgicalHistoryInfo", async (data: any) => {
    const response = await axiosPrivate.post("/api/forms/surgical-history-form", data);
    return response.data;
});

const surgicalHistoryInfoSlice = createSlice({
    name: "surgicalHistoryInfo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(surgicalHistoryInfoForm.pending, (state) => {
            state.loading = true;
        }); 
        builder.addCase(surgicalHistoryInfoForm.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(surgicalHistoryInfoForm.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "An error occurred";
        });
    }
})
export default surgicalHistoryInfoSlice.reducer;