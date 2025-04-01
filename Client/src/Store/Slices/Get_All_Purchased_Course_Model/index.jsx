import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Get_All_Purchased_Course_Data } from "@/Routes";
import { axiosService } from "@/Services";



 export const getAllPurchasedCourse=createAsyncThunk("getAllPurchasedCourse",async ()=>{

  try{
     const allPurchase=await axiosService.get(Get_All_Purchased_Course_Data,{withCredentials:true});
     return allPurchase?.data?.data;
  }
  catch(error){
    toast.error("Something Wrong on getting ratings");
    return rejectWithValue(error.message);
  }
})

const getAllPurchasedCourseSlice=createSlice({
    name:"purchasedCourse",
    initialState:{
        status:"pending",
        data:null,
        error:null,
        loading:true
    },
    extraReducers:(builder)=>{
        builder.addCase(getAllPurchasedCourse.fulfilled,(state,action)=>{
                    state.status="fulfilled"
                    state.data=action.payload;
                    state.loading=false;
                })
                .addCase(getAllPurchasedCourse.pending,(state,action)=>{
                  state.status="pending";
                  state.loading=true;
                })
                .addCase(getAllPurchasedCourse.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.error.message;
                    state.loading=false;
                });
    }
});

export default getAllPurchasedCourseSlice.reducer;
