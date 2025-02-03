import User from "../../../Model/User_Model/index.mjs";
import bcrypt from 'bcrypt';


//for forget password 
const ChangePassword=async (req,res)=>{
    try{

        const {password,email}=req.body;
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        await User.updateOne({email:email},{$set:{password:hashedPassword}});
        return res.status(200).json({message:"Password updted successfully"});
    }
    catch(error){
        return res.status(400).json({message:"Password updtetion failed"});
    }
    
}
export default ChangePassword;

export const UpdatePassword=async (req,res)=>{
    try{

        const {currentPassword,newPassword}=req.body;
        const logedUser=req.user;
        const user=await User.findById(logedUser._id);
        const isMatch=await user.verifyPassword(currentPassword);
        if (!isMatch) {
            return res.status(401).json({message:"Current password doesn't Match"});
        }
        else{
            const salt=await bcrypt.genSalt(10);
            const hashedPassword=await bcrypt.hash(newPassword,salt);
            await User.findByIdAndUpdate(logedUser._id,{$set:{password:hashedPassword}});
            return res.status(200).json({message:"Password updted successfully"});
        }
    }
    catch(error){
        return res.status(400).json({message:"Password updtetion failed.."});
    }
}