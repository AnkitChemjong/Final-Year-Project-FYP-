import PurchaseModel from "../../../../Model/Purchase_Model/index.mjs";
import { initializeKhaltiPayment,verifyKhaltiPayment } from "../../../../Services/PaymentService/khalti/index.mjs";
import PurchasedCoursesModel from "../../../../Model/Purchased_Courses_Model/index.mjs";
import User from "../../../../Model/User_Model/index.mjs";
import CourseModel from "../../../../Model/Course_Model/index.mjs";


class KhaltiPayment{
    // route to initilize khalti payment gateway
   static initializeTheKhaltiPayment= async (req, res) => {
      try {
        const data = req.query;
        //console.log(data);
    
        const course=await CourseModel.find({_id:data?.courseId,pricing:data?.amountPaid});
        //console.log(course);
        
        if (course.length === 0) {
              return res.redirect(`${process.env.EFAULURE_URL}?payment=failed&message=purchase record not found`);
            }
        const purchaseData=await PurchaseModel.create(data);
        //console.log(purchaseData);
    
        const paymentInitate = await initializeKhaltiPayment({
            return_url: process.env.KSUCCESS_URL,
            website_url:process.env.AFTER_PATMENT_SUCCESS,
          amount: data?.amountPaid * 100, // amount should be in paisa (Rs * 100)
          purchase_order_id: purchaseData._id,
          purchase_order_name: purchaseData.courseId,
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
          return res.redirect(`${process.env.EFAULURE_URL}?payment=failed&message=purchase record error`);
        }
    
        // Check if payment done in valid item
        const purchasedData = await PurchaseModel.findOne({
          _id: purchase_order_id,
          amountPaid: (amount/100),
        }).populate('courseId');
        
    
        if (!purchasedData) {
          return res.redirect(`${process.env.EFAULURE_URL}?payment=failed&message=purchase record not found`);
        }
        purchasedData.orderStatus="done";
        purchasedData.paymentStatus="paid";
        purchasedData.transactionId=transaction_id;
        purchasedData.save();
        
        const creator=await User.findOne({_id:purchasedData?.courseId?.creator});

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
        await CourseModel.findByIdAndUpdate(purchasedData?.courseId?._id,{$addToSet:{students:{studentId:user?._id}}},{ runValidators: true });

        res.redirect(`${process.env.AFTER_PATMENT_SUCCESS}?payment=success&message=payment successfull&amount=${amount/100}`);
      } catch (error) {
        console.log(error);
        const purchasedData=await PurchaseModel.findOne({
            _id: purchase_order_id,
            amountPaid: (amount/100),
          });
        await PurchaseModel.findByIdAndDelete(purchasedData?._id);
        return res.redirect(`${process.env.EFAULURE_URL}?payment=failed&message=Payment Cancelled`);
        
      }
    };
}

export default KhaltiPayment;