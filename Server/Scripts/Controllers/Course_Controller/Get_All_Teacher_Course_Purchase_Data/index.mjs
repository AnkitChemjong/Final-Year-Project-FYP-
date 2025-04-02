import CourseModel from "../../../Model/Course_Model/index.mjs";
import PurchaseModel from "../../../Model/Purchase_Model/index.mjs";

const getAllTeacherCoursePurchaseData = async (req, res) => {
    try {
        const {data} = req.body;
        
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ 
                success: false,
                message: "Data array is required" 
            });
        }

        const teacherIds = data?.map(item => item?._id).filter(id => id);
        
        if (teacherIds?.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: "No valid teacher IDs provided" 
            });
        }

       
        const allCourses = await CourseModel.find({ 
            creator: { $in: teacherIds } 
        });

        if (allCourses.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No courses found for these teachers",
                data: []
            });
        }

        const courseIds = allCourses.map(course => course._id);

        
        const allPurchases = await PurchaseModel.find({
            courseId: { $in: courseIds }
        })
        .populate('userId', 'name email')
        .populate('courseId', 'title thumbnail')
        .sort({ createdAt: -1 });

       
        const result = data.map(teacher => {
            
            const teacherCourses = allCourses.filter(
                course => course.creator.toString() === teacher._id.toString()
            );

            
            const coursesWithPurchases = teacherCourses.map(course => {
                const coursePurchases = allPurchases.filter(
                    purchase => purchase.courseId._id.toString() === course._id.toString()
                );

                return {
                    _id: course._id,
                    title: course.title,
                    price: course.price,
                    creator:course.creator,
                    thumbnail: course.thumbnail,
                    totalPurchases: coursePurchases.length,
                    totalEarnings: coursePurchases.reduce(
                        (sum, purchase) => sum + parseFloat(purchase.teacherAmount || 0), 
                        0
                    ),
                    purchases: coursePurchases.map(purchase => ({
                        ...purchase.toObject(),
                        createdAt: purchase.createdAt 
                    }))
                };
            });

            return {
                teacherId: teacher._id,
                teacherName: teacher.name,
                teacherEmail: teacher.email,
                totalCourses: teacherCourses.length,
                totalPurchases: coursesWithPurchases.reduce(
                    (sum, course) => sum + course.totalPurchases, 0
                ),
                totalEarnings: coursesWithPurchases.reduce(
                    (sum, course) => sum + course.totalEarnings, 0
                ),
                courses: coursesWithPurchases
            };
        });

        return res.status(200).json({
            success: true,
            message: "Data fetched successfully",
            data: result
        });

    } catch (error) {
        console.error("Error in getAllTeacherCoursePurchaseData:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export default getAllTeacherCoursePurchaseData;