import { Schema } from "mongoose";
const teacherInfoSchema=new Schema({
    certificate:{
        type:String,
    },
    degree:{
        type:String,
    },
    avilability:{
        type:String,
    },
    description:{
        type:String,
    },
    college:{
        type:String,
    },
    university:{
        type:String,
    },
    feePerHour:{
        type:String,
    },
    category:{
        type:String
    },
    experience:{
      type:String
    },
    primaryLanguage:{
        type:String
    }
},{ _id: false });
export default teacherInfoSchema;
