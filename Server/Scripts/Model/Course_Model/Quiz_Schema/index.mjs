import { model,Schema } from "mongoose";

const quizSchema=new Schema({
    question:{
        type:String,
        required:true
    },
    optionA:{
        type:String,
        required:true
    },
    optionB:{
        type:String,
        required:true
    },
    optionC:{
        type:String,
        required:true
    },
    optionD:{
        type:String,
        required:true
    },
    answer:{
        type:String,
        required:true
    }
});


export default quizSchema;