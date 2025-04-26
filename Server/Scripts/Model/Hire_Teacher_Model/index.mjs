import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;


const hireTeacherSchema=new Schema({
    studentId:{
         type:Schema.Types.ObjectId,
         ref:"User",
         required:true
    },
    teacherId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
   },
    hiringDate:{
         type:String,
         required:true,
    },
    hireDescription:{
        type:String,
        required:true
    },
    startTime:{
        type:String,
        required:true
    },
    endTime:{
        type:String,
       required:true
    },
    status:{
        type:String,
        enum:['pending','approved','rejected'],
        default:'pending'
    }
},{timestamps:true});
const HireTeacher=models?.HireTeacher || model("HireTeacher",hireTeacherSchema);
export default HireTeacher;