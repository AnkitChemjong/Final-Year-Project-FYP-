import {Schema,model} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import teacherInfoSchema from './TeacherInfoSchema/index.mjs';


const userSchema=new Schema({
    userId:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:false,
        unique:true,
        validate:[validator.isEmail,'This should be an valid email']
    },
    userName:{
        type:String,
        required:false,
        unique:false
    },
    password:{
        type:String,
        required:false
    },
    userRole:{
       type:[String],
       default:['student']
    },
    salt:{
        type:String,
        required:false
    },
    myCV:{
        type:String,
        required:false
    },
    userImage:{
        type:String,
        required:false,
    },
    resetCode:{
        type:String,
        required:false
    },
    codeDueTime:{
        type:Date,
        required:false
    },
    address:{
        type:String,
        required:false
    },
    phone:{
        type:Number,
        required:false
    },
    gender:{
        type:String,
        required:false
    },
    DOB:{
        type:Date,
        required:false
    },
    provider:{
        type:String,
        required:false
    },
    teacherInfo:teacherInfoSchema
    
},{timestamps:true})

userSchema.pre('save',async function(next){
    try
    {
        const user=this;
        if(!user.isModified('password')) return next();
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(this.password,salt);
        this.password = hashedPassword;
        this.salt=salt;
        next();
    }
    catch(error){
        console.log(error?.message)
    }
});

userSchema.methods.verifyPassword =async function(password) {
   try{
       const userPassword=this.password;
       const comparePassword=await bcrypt.compare(password,userPassword);
       if(comparePassword){
          return true;
       }
        return false;
   }
   catch(error){
   console.log(error?.message);
   }
  };

  const User=model("User",userSchema);
  export default User;