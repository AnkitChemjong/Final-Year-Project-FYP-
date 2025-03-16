import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Get_All_User } from "@/Routes";
import { axiosService } from "@/Services";



 export const getAllUser=createAsyncThunk("getAllUser",async ()=>{

  try{
     const allUsers=await axiosService.get(Get_All_User,{withCredentials:true});
     return allUsers?.data?.data;
  }
  catch(error){
    toast.error("Something Wrong on getting courses");
    return rejectWithValue(error.message);
  }
})

const getAllUserSlice=createSlice({
    name:"alluser",
    initialState:{
        status:"pending",
        data:null,
        error:null,
        loading:true
    },
    extraReducers:(builder)=>{
        builder.addCase(getAllUser.fulfilled,(state,action)=>{
                    state.status="fulfilled"
                    state.data=action.payload;
                    state.loading=false;
                })
                .addCase(getAllUser.pending,(state,action)=>{
                  state.status="pending";
                  state.loading=true;
                })
                .addCase(getAllUser.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.error.message;
                    state.loading=false;
                });
    }
});

export default getAllUserSlice.reducer;
