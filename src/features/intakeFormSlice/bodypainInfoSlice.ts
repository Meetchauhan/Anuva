import { axiosPrivate } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null as string | null,
}

export const bodyPainInfoForm = createAsyncThunk("bodyPainInfo", async (data: any) => {
    const response = await axiosPrivate.post("/api/forms/body-pain-form", data);
    return response.data;
});

const bodyPainInfoSlice = createSlice({
    name: "bodyPainInfo",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(bodyPainInfoForm.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(bodyPainInfoForm.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(bodyPainInfoForm.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "An error occurred";
        });
    }
});



export default bodyPainInfoSlice.reducer;