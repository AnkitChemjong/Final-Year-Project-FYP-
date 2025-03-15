import CourseModel from "../../../Model/Course_Model/index.mjs";

const getTopSixCourses=async(req,res)=>{
    try{
        const topSixCourses = await CourseModel.aggregate([
            {
                $addFields: {
                    studentCount: { $size: "$students" } 
                }
            },
            {
                $sort: { studentCount: -1 } 
            },
            {
                $limit: 6 
            },
            {
                $lookup: {
                    from: "users", 
                    localField: "creator",
                    foreignField: "_id",
                    as: "creatorDetails"
                }
            },
            {
                $unwind: "$creatorDetails" 
            }
        ]);

        if(topSixCourses.length > 0){
            return res.status(200).json({
                error:null,
                data:topSixCourses
            })
        }
        else{
            return res.status(200).json({
                error:null,
              data:null
            })
        }

    }
    catch(error){
        console.log(error)
        return res.json({message:"Error on getting top six courses.",data:null,error:error?.message}); 
    }
}
export default getTopSixCourses;