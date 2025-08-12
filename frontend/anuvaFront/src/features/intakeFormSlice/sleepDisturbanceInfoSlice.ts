import { axiosPrivate } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null as string | null,
}

export const sleepDisturbanceInfoForm = createAsyncThunk("sleepDisturbanceInfo", async (data: any) => {
    const response = await axiosPrivate.post("/api/forms/sleep-disturbance-form", data);
    return response.data;
});

const sleepDisturbanceInfoSlice = createSlice({
    name: "sleepDisturbanceInfo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(sleepDisturbanceInfoForm.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(sleepDisturbanceInfoForm.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(sleepDisturbanceInfoForm.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "An error occurred";
        });
    }
});
export default sleepDisturbanceInfoSlice.reducer;