import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;
import contentProgressSchema from "./Content_Progress_Schema/index.mjs";

const progressSchema = new Schema({
    userId: {
      type:Schema.Types.ObjectId,
      ref:"User",
      required:true
    },
    courseId: {
        type:Schema.Types.ObjectId,
        ref:"CourseModel",
        required:true
      },
      quizCompletion:{
         type:Boolean
      },
      quizSubmitted:{
        type:Boolean
      },
      completed:{
        type:Boolean
      },
      completionDate:{
        type:Date
      },
      contentProgress:[contentProgressSchema],
      contentCompleted:{
        type:Boolean
      },
      marksObtained:{
        type:String,
      },
      certificate:{
        type:String
      }
  },{timestamps:true});
  
  const ProgressModel =models?.ProgressModel || model("ProgressModel", progressSchema);
  export default ProgressModel;