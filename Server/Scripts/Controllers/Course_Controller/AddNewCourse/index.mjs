import CourseModel from "../../../Model/Course_Model/index.mjs";

const addNewCourse=async (req,res)=>{
    try{
       const courseData=req.body;
       const newCourse=new CourseModel(courseData);
       const saveCourse=await newCourse.save();
       if(saveCourse){
           return res.status(200).json({message:"Course Created Successfully",
            data:saveCourse,
            error:null
           })
       }
    }
    catch(error){
        console.log(error)
            return res.json({message:"Error on uploading course.",data:null,error:error?.message}); 
    }
}

export default addNewCourse;