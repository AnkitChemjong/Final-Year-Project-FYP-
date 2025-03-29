import {Schema,model} from 'mongoose';


const rateCourseSchema=new Schema({
    userId:{
         type:Schema.Types.ObjectId,
         ref:"User",
         required:true
    },
    courseId:{
        type:Schema.Types.ObjectId,
        ref:"CourseModel",
        required:true
   },
    rating:{
        type:Number,
        required:true
    },
    comment:{
        type:String,
        required:true
    }
},{timestamps:true});
const RateCourse=model("RateCourse",rateCourseSchema);
export default RateCourse;