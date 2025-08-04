import { axiosPrivate, axiosPublic } from "@/lib/axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Import LoginFormData from adminAuthSlice
interface LoginFormData {
  email: string;
  password: string;
}

interface SignupFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  password: string;
}

const initialState = {
  loading: false,
  error: null as string | null,
  data: null,
};

export const authSignup = createAsyncThunk("auth/signup", async (data: SignupFormData) => {
    const response = await axiosPublic.post(`/api/auth/signup`, data);
    return response.data;
  });

export const authLogin = createAsyncThunk("auth/login", async (data: LoginFormData) => {
    const response = await axiosPublic.post(`/api/auth/login`, data);
    return response.data;
  });

  export const getUser = createAsyncThunk("auth/getUser", async () => {
    const response = await axiosPrivate.get(`/api/auth/user`);
    return response.data;
  });

const authSlice = (name: string) => {
  return createSlice({
    name: "auth",
    initialState,
    reducers: {
      logout: (state) => {
        state.data = null;
        state.error = null;
        sessionStorage.removeItem("authToken");
      },
    },
    extraReducers: (builder) => {
      builder.addCase(authLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(authLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      });
      builder.addCase(authLogin.rejected, (state, action) => {  
        state.loading = false;
        state.error = action.error.message || "Login failed";
      });
      builder.addCase(authSignup.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(authSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      });
      builder.addCase(authSignup.rejected, (state, action) => {  
        state.loading = false;
        state.error = action.error.message || "Signup failed";
      });
      builder.addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      });
      builder.addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      });
      builder.addCase(getUser.rejected, (state, action) => {  
        state.loading = false;
        state.error = action.error.message || "Get user failed";
      });
    },
  });
}

const authSliceInstance = authSlice("auth");
export const { logout } = authSliceInstance.actions;
export default authSliceInstance.reducer;