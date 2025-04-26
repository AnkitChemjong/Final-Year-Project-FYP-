import User from "../../../Model/User_Model/index.mjs";
import bcrypt from 'bcrypt';
import sendMailToUser from "../../../Services/UserService/Nodemailer/index.mjs";

const GenCode=async (req,res)=>{
    try{

        const {email}=req.body;
        const user=await User.findOne({email});
        if(user){
             const code =Math.floor(100000 + Math.random() * 900000).toString();
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
    catch(error){
        return res.status(400).json({message:"Error on finding the registered user."})
    }
}
export default GenCode;