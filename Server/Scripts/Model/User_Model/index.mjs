import {Schema,model} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';


const userSchema=new Schema({
    userId:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:false,
        isUnique:true,
        validate:[validator.isEmail,'This should be an valid email']
    },
    userName:{
        type:String,
        required:false,
        isUnique:false
    },
    password:{
        type:String,
        required:false
    },
    userRole:{
       type:[String],
       enum:['student','teacher','admin'],
       default:['student']
    },
    salt:{
        type:String,
        required:false
    }
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
          return false;
       }
        return true;
   }
   catch(error){
   console.log(error?.message);
   }
  };

  const User=model("User",userSchema);
  export default User;