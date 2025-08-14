import { axiosPrivate } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null as string | null,
}

export const headacheInfoForm = createAsyncThunk("headacheInfo", async (data: any) => {
    const response = await axiosPrivate.post("/api/forms/headache-form", data);
    return response.data;
});

const headacheInfoSlice = createSlice({
    name: "headacheInfo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(headacheInfoForm.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(headacheInfoForm.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(headacheInfoForm.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "An error occurred";
        });
    }
});
export default headacheInfoSlice.reducer;