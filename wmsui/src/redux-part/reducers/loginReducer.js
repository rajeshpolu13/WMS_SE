import { createSlice } from '@reduxjs/toolkit'

export const LoginSclice = createSlice({
    name: "loginReducer",
    initialState: {
        isLogged: false,
        cartVal:0,
        userInfo:{  username:null,
                    userId:null, firstName:null,role:null },
        checkoutInfo:{
            userId:null,
            cartItems:[],
            totalBill:null,

        },
        offers:[],
        showLiveTrack:false
    },
    reducers: {
        login: (state) => {
            state.isLogged = true;
        },
        logout: (state) => {
            state.isLogged = false;
        },
        increaseCartCount:(state,action)=>{
            state.cartVal+=action.payload;
        },
        setLoginUserInfo:(state,action)=>{
                state.userInfo.userId=action.payload.userId;
                state.userInfo.username=action.payload.username;
                state.userInfo.firstName=action.payload.firstName;
                state.userInfo.role= action.payload.role;
        },
        clearLoginUserInfo:(state)=>{
            state.userInfo.userId=null;
                state.userInfo.username=null;
                state.userInfo.firstName=null;
                state.userInfo.role=null;
        }

    },

})

export const {login,logout,increaseCartCount,setLoginUserInfo,clearLoginUserInfo} = LoginSclice.actions;

export default LoginSclice.reducer;