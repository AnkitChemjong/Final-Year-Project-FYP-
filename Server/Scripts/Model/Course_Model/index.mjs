import {Schema,model} from 'mongoose';
import lectureSchema from './Lecture_Schema/index.mjs';
import quizSchema from './Quiz_Schema/index.mjs';



const courseSchema=new Schema({
    creator:{
         type:Schema.Types.ObjectId,
         ref:"User",
         required:true,
    },
    title:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    level:{
        type:String,
        required:true
    },
    primaryLanguage:{
        type:String,
        required:true
    },
    subtitle:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    pricing:{
    type:String,
    required:true
    },
    image:{
        type:String,
        required:true
    },
    image_public_id:{
        type:String,
        required:true
    },
    welcomeMessage:{
        type:String,
        required:true
    },
    objectives:{
        type:String,
        required:true
    },
    students:
    [
    {
        studentId:{
        type:Schema.Types.ObjectId,
        ref:"User"
        }
    }
    ],
    curriculum: [lectureSchema],
    isPublished:{
        type:Boolean,
        default:true
    },
    extraResources:{
        type:String,
        required:false
    },
    quizData:{
        passMark:{
            type:String,
            required:true
        },
       question:[quizSchema]
    }
},{timestamps:true});
const CourseModel=model("CourseModel",courseSchema);
export default CourseModel;