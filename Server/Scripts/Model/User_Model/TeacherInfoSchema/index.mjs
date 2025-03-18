
const teacherInfoSchema={
    certificate:{
        type:String,
    },
    degree:{
        type:String,
    },
    avilability:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    college:{
        type:String,
    },
    university:{
        type:String,
    }
}
export default teacherInfoSchema;
