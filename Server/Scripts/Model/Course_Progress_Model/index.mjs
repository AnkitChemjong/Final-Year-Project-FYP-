import { Schema,model } from "mongoose";
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
      completed:{
        type:Boolean
      },
      completionDate:{
        type:Date
      },
      contentProgress:[contentProgressSchema]
  });
  
  const ProgressModel = model("ProgressModel", progressSchema);
  export default ProgressModel;