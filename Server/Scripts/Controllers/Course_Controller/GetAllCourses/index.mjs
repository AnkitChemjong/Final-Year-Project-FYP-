import CourseModel from "../../../Model/Course_Model/index.mjs";


const getAllCourses=async (req,res)=>{
    try{
        const {category=[],level=[],primaryLanguage=[],sortBy="create-rtoo"}=req.query;
        let filters={};
        if(category.length){
            filters.category={$in:category.split(',')};
        }
        if(level.length){
            filters.level={$in:level.split(',')};
        }
        if(primaryLanguage.length){
            filters.primaryLanguage={$in:primaryLanguage.split(',')};
        }

        let sortParam={};
        switch(sortBy){
            case "price-lowtohigh":
                sortParam.pricing=1
            break;
            case "price-hightolow":
                sortParam.pricing=-1
            break;
            case "title-atoz":
                sortParam.title=1
            break;
            case "title-ztoa":
                sortParam.title=-1
            break;
            case "create-rtoo":
                sortParam.createdAt=-1
            break;
            case "create-otor":
                sortParam.createdAt=1
            break;
            default:
                sortParam.pricing=1
            break;
        }
        
       const allCourses=await CourseModel.find(filters).sort(sortParam).populate('creator').populate('students.studentId');
       if(!allCourses){
        return res.status(400).json({message:"Fetched course problem.",
            course:null,
            error:null
           });
       }
        return res.status(200).json({message:"Fetched all Successfully",
            course:allCourses,
            error:null
           });
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Error on getting courses.",data:null,error:error?.message}); 
    }
}

export default getAllCourses;