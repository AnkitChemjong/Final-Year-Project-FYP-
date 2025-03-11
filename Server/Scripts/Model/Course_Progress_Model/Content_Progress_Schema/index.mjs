import { Schema } from "mongoose";

const contentProgressSchema=new Schema({
    contentId:{
        type:String
    },
    viewed:{
        type:Boolean
    },
    dateViewed:{
        type:Date
    }
});
export default contentProgressSchema;