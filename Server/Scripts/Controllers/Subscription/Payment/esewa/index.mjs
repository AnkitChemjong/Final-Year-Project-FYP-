import PaymentSubscription from "../../../../Model/Payment_Model_Subscription/index.mjs";
import User from "../../../../Model/User_Model/index.mjs";
import {
  getEsewaPaymentHash,
  verifyEsewaPayment,
} from "../../../../Services/PaymentService/esewa/index.mjs";

class EsewaPaymentSubscription {
  static initializeEsewaPayment = async (req, res) => {
    try {
      const data = req.query;
      const user = await User.findById(data?.userId);
      if (!user || !data) {
        return res.redirect(
          `${process.env.EFAULURE_SUBSCRIPTION_URL}?payment=failed&message=user or data not found`
        );
      }
      
      const paymentModel = await PaymentSubscription.create(data);

      const paymentInitate = await getEsewaPaymentHash({
        amount: data?.amountPaid,
        transaction_uuid: paymentModel._id,
      });
      const formData = {
        esewaUrl: process.env.ESEWA_REDIRECT_URL,
        total_amount: Number(data?.amountPaid),
        transaction_uuid: paymentModel._id,
        product_code: process.env.ESEWA_PRODUCT_CODE,
        success_url: process.env.ESUCCESS_SUBSCRIPTION_URL,
        failure_url: `${process.env.ESEWA_SUBSCRIPTION_CANCEL_URL}?purchasedDataId=${paymentModel._id}`,
        signed_field_names: paymentInitate.signed_field_names,
        signature: paymentInitate.signature,
        secret: process.env.ESEWA_SECRET_KEY,
      };
      res.render("payment", formData);
      //const esewaUrl = `https://rc-epay.esewa.com.np/api/epay/main/v2/form/?total_amount=${Number(data?.amountPaid)}&transaction_uuid=${purchaseData._id}&product_code=${process.env.ESEWA_PRODUCT_CODE}&success_url=${process.env.SUCCESS_URL}&failure_url=${process.env.FAILURE_URL}&signed_field_names=${paymentInitate.signed_field_names}&signature=${paymentInitate.signature}&secret=${process.env.ESEWA_SECRET_KEY}`;
    } catch (error) {
      console.log(error);
    }
  };

  // to verify payment this is our `success_url`
  static completeEsewaPayment = async (req, res) => {
    const { data } = req.query;
    const user = req.user;
    const paymentInfo = await verifyEsewaPayment(data);
    try {
      //console.log(paymentInfo);
      const purchasedData = await PaymentSubscription.findOne({
        _id: paymentInfo.response.transaction_uuid,
        amountPaid: Math.floor(paymentInfo?.decodedData?.total_amount),
      });
      if (!purchasedData) {
        return res.redirect(
          `${process.env.EFAULURE_SUBSCRIPTION_URL}?payment=failed&message=purchase not found.`
        );
      }
      purchasedData.orderStatus = "done";
      purchasedData.paymentStatus = "paid";
      purchasedData.transactionId = paymentInfo?.decodedData?.transaction_code;
      await purchasedData.save();


      const userData =await User.findById(user?._id);
      if (!userData) {
        return res.redirect(
          `${process.env.EFAULURE_SUBSCRIPTION_URL}?payment=failed&message=user Data not found.`
        );
      }
const currentDate = new Date();


// Initialize subscription if it doesn't exist
if (!userData.subscription) {
  userData.subscription = {
    subscriptionStatus: 'pending',
    subscriptionType: purchasedData?.subscriptionType,
    subscriptionStartDate: currentDate,
    subscriptionEndDate: currentDate,
  };
}

// If subscription is expired or new, set fresh dates
if (userData.subscription.subscriptionStatus === "expired" || userData.subscription.subscriptionStatus === "pending") {
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
  userData.subscription.subscriptionType = paymentInfo?.response?.subscriptionType;
  
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
      return res.redirect(
        `${
          process.env.AFTER_PAYMENT_SUCCESS_TEACHER
        }?payment=success&message=payment successfull&amount=${Math.floor(
          paymentInfo?.decodedData?.total_amount
        )}`
      );
    } catch (error) {
      console.log(error);
      const purchasedData = await PaymentSubscription.findOne({
        _id: paymentInfo.response.transaction_uuid,
        amountPaid: Math.floor(paymentInfo?.decodedData?.total_amount),
      });
      await PaymentSubscription.findByIdAndDelete(purchasedData?._id);
      return res.redirect(
        `${process.env.EFAULURE_SUBSCRIPTION_URL}?payment=failed&message=Payment Cancelled`
      );
    }
  };

  static esewaCancelUrlSubscription = async (req, res) => {
    try {
      const { purchasedDataId } = req.query;
      await PaymentSubscription.findByIdAndDelete(purchasedDataId);
      return res.redirect(
        `${process.env.EFAULURE_SUBSCRIPTION_URL}?payment=failed&message=Payment Cancelled`
      );
    } catch (error) {
      console.log(error);
      return res.redirect(
        `${process.env.EFAULURE_SUBSCRIPTION_URL}?payment=failed&message=Payment Cancelled`
      );
    }
  };
}
export default EsewaPaymentSubscription;
