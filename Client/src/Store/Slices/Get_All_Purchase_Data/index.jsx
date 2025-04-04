import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Get_All_Purchase_Data } from "@/Routes";
import { axiosService } from "@/Services";



 export const getAllPurchaseData=createAsyncThunk("getAllPurchaseData",async ()=>{

  try{
     const allPurchase=await axiosService.get(Get_All_Purchase_Data,{withCredentials:true});
     return allPurchase?.data?.data;
  }
  catch(error){
    toast.error("Something Wrong on getting ratings");
    return rejectWithValue(error.message);
  }
})

const getAllPurchaseDataSlice=createSlice({
    name:"purchase",
    initialState:{
        status:"pending",
        data:null,
        error:null,
        loading:true
    },
    extraReducers:(builder)=>{
        builder.addCase(getAllPurchaseData.fulfilled,(state,action)=>{
                    state.status="fulfilled"
                    state.data=action.payload;
                    state.loading=false;
                })
                .addCase(getAllPurchaseData.pending,(state,action)=>{
                  state.status="pending";
                  state.loading=true;
                })
                .addCase(getAllPurchaseData.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.error.message;
                    state.loading=false;
                });
    }
});

export default getAllPurchaseDataSlice.reducer;
