import { Schema } from "mongoose";
const subscriptionSchema=new Schema({
    subscriptionType:{
        type:String,
        enum: ['basic', 'premium', 'elite'],
    },
    subscriptionStartDate:{
        type:Date
    },
    subscriptionEndDate:{
        type:Date
    },
    subscriptionStatus:{
        type:String,
        enum:['pending','active','expired'],
        default:'pending'
    }
    
},{ _id: false });
export default subscriptionSchema;
