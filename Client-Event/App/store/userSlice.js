// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.userInfo = action.payload;
        },
    },
});

export const { setUser } = userSlice.actions;
export const selectUserInfo = (state) => state.user.userInfo;
export default userSlice.reducer;
