import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;


const rateCourseSchema=new Schema({
    userId:{
         type:Schema.Types.ObjectId,
         ref:"User",
         required:true
    },
    courseId:{
        type:Schema.Types.ObjectId,
        ref:"CourseModel",
   },
   teacherId:{
    type:Schema.Types.ObjectId,
    ref:"User"
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
const RateCourse=models?.RateCourse || model("RateCourse",rateCourseSchema);
export default RateCourse;