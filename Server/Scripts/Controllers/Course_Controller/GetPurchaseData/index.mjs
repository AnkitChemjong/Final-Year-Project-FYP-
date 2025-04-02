import PurchaseModel from "../../../Model/Purchase_Model/index.mjs";
import CourseModel from "../../../Model/Course_Model/index.mjs";

class GetPurchaseData{
    static getPurchaseTeacherModel=async(req,res)=>{
    try{
       const {id}=req.params;
       const courses=await CourseModel.find({creator:id});
       if(courses?.length>0){
         const courseIds = courses?.map(course => course._id);
        
         const purchases = await PurchaseModel.find({
            courseId: { $in: courseIds }
          })
          .populate('userId', 'name email') 
          .sort({ createdAt: -1 });
      
         
          const response = courses.map(course => {
            const coursePurchases = purchases.filter(purchase => 
              purchase.courseId.toString() === course._id.toString()
            );
            
            return {
              _id: course._id,
              title: course.title,
              price: course.price,
              thumbnail: course.thumbnail,
              totalPurchases: coursePurchases.length,
              totalEarnings: coursePurchases.reduce(
                (sum, purchase) => sum + parseFloat(purchase?.teacherAmount || 0), 
                0
              ),
              purchases: coursePurchases.map(purchase => ({
                _id: purchase._id,
                userId: purchase.userId,
                paymentMethod: purchase.paymentMethod,
                paymentStatus: purchase.paymentStatus,
                amountPaid: purchase.amountPaid,
                teacherAmount: purchase.teacherAmount,
                orderDate: purchase.orderDate,
                transactionId: purchase.transactionId
              }))
            };
          });
      
          return res.status(200).json({
            success: true,
            data: response,
            purchase:purchases,
            totalCourses: courses.length,
            totalPurchases: purchases.length,
            totalEarnings: response.reduce(
              (sum, course) => sum + course?.totalEarnings, 
              0
            )
          });
    
       }
       return res.status(200).json({
        success: true,
        message: "No courses found for this teacher",
        data: [],
        purchase:[],
        totalEarnings: 0
      });
    
    }
    catch(error){
        console.log(error);
        return res.status(200).json({message:"Purchase model is fetched successfully.",error:error?.message});
    }
    }
}
export default GetPurchaseData;