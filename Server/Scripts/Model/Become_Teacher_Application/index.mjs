import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;


const becomeTeacherSchema=new Schema({
    user:{
         type:Schema.Types.ObjectId,
         ref:"User",
         required:true,
    },
    userCV:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['pending','approved','rejected'],
        default:'pending'
    }
},{timestamps:true});
const BecomeTeacherApp=models?.BecomeTeacherApp || model("BecomeTeacherApp",becomeTeacherSchema);
export default BecomeTeacherApp;