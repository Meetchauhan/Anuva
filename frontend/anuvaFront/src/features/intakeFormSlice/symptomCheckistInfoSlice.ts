import { axiosPrivate } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


const initialState = {
    loading: false,
    error: null as string | null,
};

export const symptomChecklistInfoForm = createAsyncThunk("symptomChecklistInfo", async (data: any) => {
    const response = await axiosPrivate.post("/api/forms/symptom-checklist", data);
    return response.data;
});

const symptomChecklistInfoSlice = createSlice({
    name: "symptomChecklistInfo",
    initialState,
    reducers: {
       
    },
    extraReducers: (builder) => {
        builder.addCase(symptomChecklistInfoForm.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(symptomChecklistInfoForm.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(symptomChecklistInfoForm.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || "An error occurred";
        });
    },
});

export default symptomChecklistInfoSlice.reducer;