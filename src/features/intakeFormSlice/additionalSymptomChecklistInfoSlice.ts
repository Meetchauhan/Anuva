import { axiosPrivate } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null as string | null,
}

export const additionalSymptomChecklistInfoForm = createAsyncThunk("additionalSymptomChecklistInfo", async (data: any) => {
    const response = await axiosPrivate.post("/api/forms/additional-symptoms", data);
    return response.data;
});

const additionalSymptomChecklistInfoSlice = createSlice({
    name: "additionalSymptomChecklistInfo",
    initialState,
    reducers: {
       
    },
    extraReducers: (builder) => {
        builder.addCase(additionalSymptomChecklistInfoForm.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(additionalSymptomChecklistInfoForm.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(additionalSymptomChecklistInfoForm.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "An error occurred";
        });
    }
});


export default additionalSymptomChecklistInfoSlice.reducer;