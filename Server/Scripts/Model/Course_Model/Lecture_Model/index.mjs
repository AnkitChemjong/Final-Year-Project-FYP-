import { model,Schema } from "mongoose";

const lectureSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    videoUrl:{
        type:String,
        required:true
    },
    public_id:{
        type:String,
        required:true
    },
    freePreview:{
        type:Boolean,
        required:true
    }
});

const LectureModel=model('LectureModel',lectureSchema);
export default LectureModel;