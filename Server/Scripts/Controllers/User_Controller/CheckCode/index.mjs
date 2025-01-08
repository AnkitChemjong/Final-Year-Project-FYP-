import User from "../../../Model/User_Model/index.mjs";
import bcrypt from 'bcrypt';

const CheckCode=async (req,res)=>{
    const {code,email}=req.body;
    const user=await User.findOne({email:email});
    const match=await bcrypt.compare(code,user?.resetCode)
    if(match){
        if(user?.codeDueTime>Date.now()){
            return res.status(200).json({message:"Code matched."});
        }
        else{
            return res.status(400).json({message:"Code Timedout."});
        }
    }
    else{
        return res.status(401).json({message:"Code doesn't matched."})
    }
}
export default CheckCode;