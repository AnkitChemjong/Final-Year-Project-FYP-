import {Schema,model} from 'mongoose';


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
const BecomeTeacherApp=model("BecomeTeacherApp",becomeTeacherSchema);
export default BecomeTeacherApp;