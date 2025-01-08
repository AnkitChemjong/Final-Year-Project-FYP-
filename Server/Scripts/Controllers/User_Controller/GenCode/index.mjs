import User from "../../../Model/User_Model/index.mjs";
import bcrypt from 'bcrypt';
import {v4 as uuid} from "uuid";
import sendMailToUser from "../../../Services/UserService/Nodemailer/index.mjs";

const GenCode=async (req,res)=>{
    const {email}=req.body;
    const user=await User.findOne({email});
    if(user){
         const code=uuid();
         const salt=await bcrypt.genSalt(10);
         const hashedCode=await bcrypt.hash(code,salt);
         await user.updateOne({ $set: { resetCode:hashedCode,codeDueTime:Date.now()+10*60*1000 } }, { new: true });
         user.save();
         await sendMailToUser(email,code);
         return res.status(200).json({
            message: "Reset code generated and email sent successfully.",
            email:email
          });
    }
    else{
        return res.status(400).json({message:"No user found of this email."})
    }
}
export default GenCode;