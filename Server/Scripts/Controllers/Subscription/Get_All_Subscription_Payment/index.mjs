import PaymentSubscription from "../../../Model/Payment_Model_Subscription/index.mjs";


const getAllSubscriptionPayment=async(req,res)=>{
    try{
       const allSubscriptionPayment=await PaymentSubscription.find({}).populate('userId').sort({createdAt:-1});
       if(allSubscriptionPayment?.length>0){
        return res.status(200).json({message:"Subscription Payment fetched successfully",data:allSubscriptionPayment})
       }
       return res.status(200).json({message:"no data.",data:allSubscriptionPayment});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"cannot get all subscription payment",error:error?.message});
    }
}

export default getAllSubscriptionPayment;