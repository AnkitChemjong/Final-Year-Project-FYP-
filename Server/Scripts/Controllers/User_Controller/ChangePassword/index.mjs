import User from "../../../Model/User_Model/index.mjs";
import bcrypt from 'bcrypt';

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