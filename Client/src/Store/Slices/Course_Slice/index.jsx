import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Get_All_Course } from "@/Routes";
import { axiosService } from "@/Services";



 export const getCourse=createAsyncThunk("getCourse",async ()=>{

  try{
     const allCourses=await axiosService.get(Get_All_Course,{withCredentials:true});
     return allCourses?.data?.course;
  }
  catch(error){
    toast.error("Something Wrong on getting courses");
  }
})

const courseSlice=createSlice({
    name:"course",
    initialState:{
        status:"pending",
        data:null,
        error:null,
        loading:true
    },
    extraReducers:(builder)=>{
        builder.addCase(getCourse.fulfilled,(state,action)=>{
                    state.status="fulfilled"
                    state.data=action.payload;
                    state.loading=false;
                })
                .addCase(getCourse.pending,(state,action)=>{
                  state.status="pending";
                  state.loading=true;
                })
                .addCase(getCourse.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.error.message;
                    state.loading=false;
                });
    }
});

export default courseSlice.reducer;
