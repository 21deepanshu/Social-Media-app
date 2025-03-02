import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    isAuthenticated: boolean;
    user: { email: string; name: string, id: string } | null;
}

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ email: string; name: string, id: string }>) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logoutUser: (state) => {
            state.isAuthenticated = false;
            state.user = null;
        },
    },
});

export const { login, logoutUser } = authSlice.actions;
export default authSlice.reducer;
