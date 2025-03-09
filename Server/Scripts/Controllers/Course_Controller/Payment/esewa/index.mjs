import CourseModel from "../../../../Model/Course_Model/index.mjs";
import PurchaseModel from "../../../../Model/Purchase_Model/index.mjs";
import PurchasedCoursesModel from "../../../../Model/Purchased_Courses_Model/index.mjs";
import User from "../../../../Model/User_Model/index.mjs";
import { getEsewaPaymentHash,verifyEsewaPayment } from "../../../../Services/PaymentService/esewa/index.mjs";

export const initializeEsewaPayment=async (req, res) => {
    try {
      const data = req.query;
      const course=await CourseModel.find({_id:data?.courseId,pricing:data?.amountPaid});
      if (course.length === 0) {
            return res.status(400).json({
            data:null,
            success: false,
            message: "Course not found",
            });
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
        failure_url:`${process.env.EFAULURE_URL}?payment=failed`,
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
  export const completeEsewaPayment=async (req, res) => {
    const { data } = req.query;
    const user=req.user;
  
    try {
      const paymentInfo = await verifyEsewaPayment(data);
      const purchasedData = await PurchaseModel.findById(
        paymentInfo.response.transaction_uuid
      ).pupulate('courseId');
      if (!purchasedData) {
        res.status(500).json({
          success: false,
          message: "Purchase not found",
        });
      }
      purchasedData.orderStatus="done";
      purchasedData.paymentStatus="paid";
      purchasedData.transactionId=paymentInfo?.decodedData?.transaction_code;
      purchasedData.save();

      const creator=await User.find({_id:purchasedData?.couseId?.creator})

      const userCourses=await PurchasedCoursesModel.find({userId:user._id});
      if (userCourses) {
        userCourses.courses.push({
          courseId: purchasedData?.courseId,
          title: purchasedData?.courseId?.courseTitle,
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
                courseId: purchasedData?.courseId,
                title: purchasedData?.courseId?.courseTitle,
                instructorId: purchasedData?.courseId?.creator,
                instructorName: creator?.userName,
                dateOfPurchase: purchasedData?.orderDate,
                courseImage: purchasedData?.courseId?.image,
            },
          ],
        });
  
        await newUserCourses.save();
      }
      res.redirect(`${process.env.AFTER_PATMENT_SUCCESS}?payment=Success`);
    } catch (error) {
      console.log(error);
    }
  };
