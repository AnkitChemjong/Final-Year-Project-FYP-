import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Get_All_Rating_Data } from "@/Routes";
import { axiosService } from "@/Services";



 export const getAllRating=createAsyncThunk("getAllRating",async ()=>{

  try{
     const allRating=await axiosService.get(Get_All_Rating_Data,{withCredentials:true});
     return allRating?.data?.data;
  }
  catch(error){
    toast.error("Something Wrong on getting ratings");
    return rejectWithValue(error.message);
  }
})

const getAllRatingSlice=createSlice({
    name:"allRating",
    initialState:{
        status:"pending",
        data:null,
        error:null,
        loading:true
    },
    extraReducers:(builder)=>{
        builder.addCase(getAllRating.fulfilled,(state,action)=>{
                    state.status="fulfilled"
                    state.data=action.payload;
                    state.loading=false;
                })
                .addCase(getAllRating.pending,(state,action)=>{
                  state.status="pending";
                  state.loading=true;
                })
                .addCase(getAllRating.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.error.message;
                    state.loading=false;
                });
    }
});

export default getAllRatingSlice.reducer;
