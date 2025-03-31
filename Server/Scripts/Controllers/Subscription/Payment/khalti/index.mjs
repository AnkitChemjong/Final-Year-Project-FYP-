import { initializeKhaltiPayment,verifyKhaltiPayment } from "../../../../Services/PaymentService/khalti/index.mjs";
import PaymentSubscription from "../../../../Model/Payment_Model_Subscription/index.mjs";
import User from "../../../../Model/User_Model/index.mjs";


class KhaltiPaymentSubscription{
    // route to initilize khalti payment gateway
   static initializeTheKhaltiPayment= async (req, res) => {
      try {
        const data = req.query;
        //console.log(data);
        const user=req.user;
        if (!data || !user) {
            return res.redirect(
              `${process.env.EFAULURE_SUBSCRIPTION_URL}?payment=failed&message=user or data not found`
            );
          }
          const paymentModel = await PaymentSubscription.create(data);
    
        const paymentInitate = await initializeKhaltiPayment({
            return_url: process.env.KSUCCESS_SUBSCRIPTION_URL,
            website_url:process.env.AFTER_PAYMENT_SUCCESS_TEACHER,
          amount: data?.amountPaid * 100, // amount should be in paisa (Rs * 100)
          purchase_order_id: paymentModel._id,
          purchase_order_name: paymentModel.userId,
          userdata: {
            subscriptionType: data?.subscriptionType
        }
        });
        return res.redirect(paymentInitate.payment_url);
      } catch (error) {
        console.log(error);
      }
    };
  
    // it is our `return url` where we verify the payment done by user
  static completeKhaltiPayment= async (req, res) => {
      const {
        pidx,
        txnId,
        amount,
        mobile,
        purchase_order_id,
        purchase_order_name,
        transaction_id,
        subscriptionType

      } = req.query;
      const user=req.user;
    
      try {
        const paymentInfo = await verifyKhaltiPayment(pidx);
    
        // Check if payment is completed and details match
        if (
          paymentInfo?.status !== "Completed" ||
          paymentInfo.transaction_id !== transaction_id ||
          Number(paymentInfo.total_amount) !== Number(amount)
        ) {
          return res.redirect(`${process.env.EFAULURE_SUBSCRIPTION_URL}?payment=failed&message=purchase record error`);
        }
    
        // Check if payment done in valid item
        const purchasedData = await PaymentSubscription.findOne({
          _id: purchase_order_id,
          amountPaid: (amount/100),
        });
        if (!purchasedData) {
          return res.redirect(`${process.env.EFAULURE_SUBSCRIPTION_URL}?payment=failed&message=purchase record not found`);
        }
        purchasedData.orderStatus="done";
        purchasedData.paymentStatus="paid";
        purchasedData.transactionId=transaction_id;
        purchasedData.save();
        
        const userData =await User.findById(user?._id);
      if (!userData) {
        return res.redirect(
          `${process.env.EFAULURE_SUBSCRIPTION_URL}?payment=failed&message=user Data not found.`
        );
      }
const currentDate = new Date();

// Initialize subscription if it doesn't exist
if (!userData?.subscription) {
  userData.subscription = {
    subscriptionStatus: 'pending',
    subscriptionType: purchasedData?.subscriptionType,
    subscriptionStartDate: currentDate,
    subscriptionEndDate: currentDate,
  };
}

// If subscription is expired or new, set fresh dates
if (userData?.subscription?.subscriptionStatus === "expired" || userData?.subscription?.subscriptionStatus === "pending") {
  userData.subscription.subscriptionType = purchasedData?.subscriptionType;
  userData.subscription.subscriptionStartDate = currentDate;
  userData.subscription.subscriptionStatus = 'active'; 
  let endDate = new Date(currentDate);
  
  switch(purchasedData?.subscriptionType) {
    case "basic":
      endDate.setMonth(endDate.getMonth() + 1);
      break;
    case "premium":
      endDate.setMonth(endDate.getMonth() + 6);
      break;
    case "elite":
      endDate.setFullYear(endDate.getFullYear() + 1);
      break;
  }
  
  userData.subscription.subscriptionEndDate = endDate;
} 
else {
  // Extend existing subscription (BUG FIXED HERE)
  userData.subscription.subscriptionType = purchasedData?.subscriptionType;
  
  let extensionDays = 0;
  
  switch(purchasedData?.subscriptionType) {
    case "basic":
      extensionDays = 30; // ~1 month
      break;
    case "premium":
      extensionDays = 180; // ~6 months
      break;
    case "elite":
      extensionDays = 365; // 1 year
      break;
  }
  
  // Calculate new end date (either from now or from existing end date, whichever is later)
  const currentEndDate = new Date(userData.subscription.subscriptionEndDate);
  const now = new Date();
  
  const baseDate = currentEndDate > now ? currentEndDate : now;
  const newEndDate = new Date(baseDate);
  
  newEndDate.setDate(newEndDate.getDate() + extensionDays);
  userData.subscription.subscriptionEndDate = newEndDate;
}

await userData.save();

        res.redirect(`${process.env.AFTER_PAYMENT_SUCCESS_TEACHER}?payment=success&message=payment successfull&amount=${amount/100}&subscriptionType=${purchasedData?.subscriptionType}`);
      } catch (error) {
        console.log(error);
        const purchasedData=await PaymentSubscription.findOne({
            _id: purchase_order_id,
            amountPaid: (amount/100),
          });
        await PaymentSubscription.findByIdAndDelete(purchasedData?._id);
        return res.redirect(`${process.env.EFAULURE_SUBSCRIPTION_URL}?payment=failed&message=Payment Cancelled`);
        
      }
    };
}

export default KhaltiPaymentSubscription;