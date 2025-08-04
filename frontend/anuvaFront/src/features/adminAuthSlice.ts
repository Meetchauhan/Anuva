import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosPrivate, axiosPublic } from "@/lib/axios";
import { warn } from "console";

// Interface for the user object from API response
interface User {
  email: string;
  fullName: string;
  profileImageUrl: string | null;
  username: string;
  isAdmin: boolean;
  _id: string;
}

// Interface for the complete API response
interface AdminAuthResponse {
  message: string;
  user: User;
  token: string;
}

// Interface for the slice state
interface AdminAuthState {
  loading: boolean;
  error: string | null;
  data: AdminAuthResponse | null;
}

// Interface for registration form data
interface RegisterFormData {
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: string;
  phoneNumber?: string;
  speciality?: string;
  licenseNumber?: string;
  relationToPatient?: string;
}

// Interface for login form data
interface LoginFormData {
  username: string;
  password: string;
}

export const signupAdmin = createAsyncThunk("adminAuth/signupAdmin", async (adminData: RegisterFormData) => {
  const response = await axiosPublic.post(`/api/auth/admin/signup`, adminData);
  return response.data;
});

export const loginAdmin = createAsyncThunk("adminAuth/loginAdmin", async (adminData: LoginFormData) => {
  const response = await axiosPublic.post(`/api/auth/admin/login`, adminData);
  return response.data;
});

export const getAdminProfile = createAsyncThunk("adminAuth/getAdminProfile", async () => {
  const response = await axiosPrivate.get(`/api/auth/admin/user`);
  return response.data;
});

const initialState: AdminAuthState = {
  loading: false,
  error: null,
  data: null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    logoutAdmin: (state) => {
      state.data = null;
      sessionStorage.removeItem("adminAuthToken");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signupAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signupAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
      // Store admin token in sessionStorage
      if (action.payload.token) {
        sessionStorage.setItem("adminAuthToken", action.payload.token);
      }
    });
    builder.addCase(signupAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Signup failed';
    });
    builder.addCase(loginAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
      // Store admin token in sessionStorage
      if (action.payload.token) {
        sessionStorage.setItem("adminAuthToken", action.payload.token);
      }
    });
    builder.addCase(loginAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Login failed';
    });
    builder.addCase(getAdminProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAdminProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
    builder.addCase(getAdminProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Get admin profile failed';
    });
  },
});
export const { logoutAdmin } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
