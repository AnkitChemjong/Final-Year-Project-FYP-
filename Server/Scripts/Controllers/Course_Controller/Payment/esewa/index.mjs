import CourseModel from "../../../../Model/Course_Model/index.mjs";
import PurchaseModel from "../../../../Model/Purchase_Model/index.mjs";
import PurchasedCoursesModel from "../../../../Model/Purchased_Courses_Model/index.mjs";
import User from "../../../../Model/User_Model/index.mjs";
import { getEsewaPaymentHash,verifyEsewaPayment } from "../../../../Services/PaymentService/esewa/index.mjs";


class EsewaPayment{

    static initializeEsewaPayment=async (req, res) => {
        try {
          const data = req.query;
          const course=await CourseModel.find({_id:data?.courseId,pricing:data?.amountPaid});
          if (course.length === 0) {
            return res.redirect(`${process.env.EFAULURE_URL}?payment=Failed&message=purchase course not found`);
              }
          const purchaseData=await PurchaseModel.create(data);
          //console.log(purchaseData);
    
          const paymentInitate = await getEsewaPaymentHash({
            amount: data?.amountPaid,
            transaction_uuid: purchaseData._id,
          });
          const formData=
          {
            esewaUrl:process.env.ESEWA_REDIRECT_URL,
            total_amount:Number(data?.amountPaid),
            transaction_uuid:purchaseData._id,
            product_code:process.env.ESEWA_PRODUCT_CODE,
            success_url:process.env.ESUCCESS_URL,
            failure_url:`${process.env.EFAULURE_URL}?payment=failed&message=Payment Cancelled`,
            signed_field_names:paymentInitate.signed_field_names,
            signature:paymentInitate.signature,
            secret:process.env.ESEWA_SECRET_KEY
    
    
          }
          res.render('payment',formData);
          //const esewaUrl = `https://rc-epay.esewa.com.np/api/epay/main/v2/form/?total_amount=${Number(data?.amountPaid)}&transaction_uuid=${purchaseData._id}&product_code=${process.env.ESEWA_PRODUCT_CODE}&success_url=${process.env.SUCCESS_URL}&failure_url=${process.env.FAILURE_URL}&signed_field_names=${paymentInitate.signed_field_names}&signature=${paymentInitate.signature}&secret=${process.env.ESEWA_SECRET_KEY}`;
        } catch (error) {
            console.log(error)
        }
      };
      
      // to verify payment this is our `success_url`
      static completeEsewaPayment=async (req, res) => {
        const { data } = req.query;
        const user=req.user;
      
        try {
          const paymentInfo = await verifyEsewaPayment(data);
          //console.log(paymentInfo);
          const purchasedData = await PurchaseModel.findOne({
            _id:paymentInfo.response.transaction_uuid,amountPaid:Math.floor(paymentInfo?.decodedData?.total_amount)}
          ).populate('courseId');
          if (!purchasedData) {
            return res.redirect(`${process.env.EFAULURE_URL}?payment=failed&message=purchase not found.`);
          }
          purchasedData.orderStatus="done";
          purchasedData.paymentStatus="paid";
          purchasedData.transactionId=paymentInfo?.decodedData?.transaction_code;
          purchasedData.save();
    
          const creator=await User.findOne({_id:purchasedData?.courseId?.creator})
    
          const userCourses=await PurchasedCoursesModel.findOne({userId:user._id});
          if (userCourses) {
            userCourses.courses.push({
              courseId: purchasedData?.courseId?._id,
              title: purchasedData?.courseId?.title,
              instructorId: purchasedData?.courseId?.creator,
              instructorName: creator?.userName,
              dateOfPurchase: purchasedData?.orderDate,
              courseImage: purchasedData?.courseId?.image,
            });
      
            await userCourses.save();
          } else {
            const newUserCourses = new PurchasedCoursesModel({
              userId: purchasedData.userId,
              courses: [
                {
                    courseId: purchasedData?.courseId?._id,
                    title: purchasedData?.courseId?.title,
                    instructorId: purchasedData?.courseId?.creator,
                    instructorName: creator?.userName,
                    dateOfPurchase: purchasedData?.orderDate,
                    courseImage: purchasedData?.courseId?.image,
                },
              ],
            });
      
            await newUserCourses.save();
          }
          res.redirect(`${process.env.AFTER_PATMENT_SUCCESS}?payment=success&message=payment successfull`);
        } catch (error) {
          console.log(error);
        }
      };
}
export default EsewaPayment;
