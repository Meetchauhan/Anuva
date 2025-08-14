import { axiosPrivate } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    error: null as string | null,
    patients: {
        users: [],
    },
};

export const createPatient = createAsyncThunk("patient/createPatient", async (data: any) => {
    const response = await axiosPrivate.post("/api/auth/admin/create-user", data);
    return response.data;
});

export const fetchPatients = createAsyncThunk("patient/fetchPatients", async () => {
    const response = await axiosPrivate.get("/api/auth/admin/users");
    return response.data;
});

const patientSlice = createSlice({
    name: "patient",
    initialState,
    reducers: {
        setPatients: (state, action) => {
            state.patients = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchPatients.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchPatients.fulfilled, (state, action) => {
            state.loading = false;
            state.patients = action.payload;
        });
        builder.addCase(fetchPatients.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
        });
        builder.addCase(createPatient.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createPatient.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(createPatient.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message || null;
        });
    },
});

export const { setPatients } = patientSlice.actions;
export default patientSlice.reducer;