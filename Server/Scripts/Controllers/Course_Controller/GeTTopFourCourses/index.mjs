import CourseModel from "../../../Model/Course_Model/index.mjs";

const getFourSixCourses=async(req,res)=>{
    try{
        const topFourCourses = await CourseModel.aggregate([
            {
                $addFields: {
                    studentCount: { $size: "$students" } 
                }
            },
            {
                $sort: { studentCount: -1 } 
            },
            {
                $limit: 4
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

        if(topFourCourses.length > 0){
            return res.status(200).json({
                error:null,
                data:topFourCourses
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
        return res.status(500).json({message:"Error on getting top six courses.",data:null,error:error?.message}); 
    }
}
export default getFourSixCourses;