import { axiosPrivate } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null as string | null,
}

export const concussionDetailsInfoForm = createAsyncThunk("concussionDetailsInfo", async (data: any) => {
    const response = await axiosPrivate.post("/api/forms/concussion-details-form", data);
    return response.data;
});

const concussionDetailsInfoSlice = createSlice({
    name: "concussionDetailsInfo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(concussionDetailsInfoForm.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(concussionDetailsInfoForm.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(concussionDetailsInfoForm.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "An error occurred";
        });
    }
})
export default concussionDetailsInfoSlice.reducer;