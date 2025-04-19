import { createAsyncThunk,createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { Get_All_Subscription_Payment } from "@/Routes";
import { axiosService } from "@/Services";



 export const getSubscriptionPaymentData=createAsyncThunk("getSubscriptionPaymentData",async ()=>{

  try{
     const allSubscriptionPayment=await axiosService.get(Get_All_Subscription_Payment,{withCredentials:true});
     return allSubscriptionPayment?.data?.data;
  }
  catch(error){
    toast.error("Something Wrong on getting Subscription Payment Data.");
    return rejectWithValue(error.message);
  }
})

const getSubscriptionPaymentDataSlice=createSlice({
    name:"subscriptionPayment",
    initialState:{
        status:"pending",
        data:null,
        error:null,
        loading:true
    },
    extraReducers:(builder)=>{
        builder.addCase(getSubscriptionPaymentData.fulfilled,(state,action)=>{
                    state.status="fulfilled"
                    state.data=action.payload;
                    state.loading=false;
                })
                .addCase(getSubscriptionPaymentData.pending,(state,action)=>{
                  state.status="pending";
                  state.loading=true;
                })
                .addCase(getSubscriptionPaymentData.rejected, (state, action) => {
                    state.status = "failed";
                    state.error = action.error.message;
                    state.loading=false;
                });
    }
});

export default getSubscriptionPaymentDataSlice.reducer;
