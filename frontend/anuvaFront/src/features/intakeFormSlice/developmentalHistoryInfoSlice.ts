import { axiosPrivate } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null as string | null,
}

export const developmentalHistoryInfoForm = createAsyncThunk("developmentalHistoryInfo", async (data: any) => {
    const response = await axiosPrivate.post("/api/forms/developmental-history-form", data);
    return response.data;
});

const developmentalHistoryInfoSlice = createSlice({ 
    name: "developmentalHistoryInfo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(developmentalHistoryInfoForm.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(developmentalHistoryInfoForm.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(developmentalHistoryInfoForm.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "An error occurred";
        });
    }
})
export default developmentalHistoryInfoSlice.reducer;