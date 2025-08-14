import { axiosPrivate } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null as string | null,
}

export const previousHeadInjuryInfoForm = createAsyncThunk("previousHeadInjuryInfo", async (data: any) => {
    const response = await axiosPrivate.post("/api/forms/previous-head-injuries-form", data);
    return response.data;
});

const previousHeadInjuryInfoSlice = createSlice({
    name: "previousHeadInjuryInfo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(previousHeadInjuryInfoForm.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(previousHeadInjuryInfoForm.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(previousHeadInjuryInfoForm.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "An error occurred";
        });
    }
});
export default previousHeadInjuryInfoSlice.reducer;