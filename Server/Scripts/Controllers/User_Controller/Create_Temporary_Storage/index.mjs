import TempUser from "../../../Model/TempUserModel/index.mjs";
import User from "../../../Model/User_Model/index.mjs";
import sendMailToUser from "../../../Services/UserService/Nodemailer/index.mjs";
import bcrypt from 'bcrypt';

const temporaryStorage=async(req,res)=>{
    try{
        const {email,userName,password}=req.body;
        const checkUser=await User.findOne({email:email});
        if(checkUser){
            return res.status(201).json({
                message:"User already exist"
                });
        }
        else{
            const checkTempUser=await TempUser.findOne({email:email});
            if(checkTempUser){
                const code =Math.floor(100000 + Math.random() * 900000).toString();
             const salt=await bcrypt.genSalt(10);
             const hashedCode=await bcrypt.hash(code,salt);
             await checkTempUser.updateOne({ $set: { confirmCode:hashedCode,codeDueTime:Date.now()+10*60*1000 } }, { new: true });
             await checkTempUser.save();
             const subject="Verify your email."
             const text=`Copy the code and verify it in the website.\n\nRegards,\nEfficient Pathsala`
           await sendMailToUser(email,code,text,subject);
                return res.status(200).json({
                    message:"Verify Mail.",
                    email:checkTempUser?.email
                 });
            }
            else{
                const user=await TempUser.create({email,userName,password});
                const code =Math.floor(100000 + Math.random() * 900000).toString();
                const salt=await bcrypt.genSalt(10);
                const hashedCode=await bcrypt.hash(code,salt);
                await user.updateOne({ $set: { confirmCode:hashedCode,codeDueTime:Date.now()+10*60*1000 } }, { new: true });
                await user.save();
                 const subject="Verify your email."
                  const text=`Copy the code and verify it in the website.\n\nRegards,\nEfficient Pathsala`
                await sendMailToUser(email,code,text,subject);
                return res.status(200).json({
                    message:"Verify Mail.",
                    email:user?.email
                 });
            }
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Error on making user,try again",
            error:error?.message
        });
    }
}
export default temporaryStorage;