import User from "../../../Model/User_Model/index.mjs";
import bcrypt from 'bcrypt';

const CheckCode=async (req,res)=>{
    try{
        const {code,email}=req.body;
        const user=await User.findOne({email:email});
        const match=await bcrypt.compare(code,user?.resetCode)
        if(match){
            if(user?.codeDueTime>Date.now()){
                return res.status(200).json({message:"Code matched."});
            }
            else{
                return res.status(201).json({message:"Code Timedout restart again."});
            }
        }
        else{
            return res.status(401).json({message:"Code doesn't matched."})
        }
    }
    catch(error){
        //console.log(error);
        return res.status(500).json({message:"error on checking code."})
    }
}
export default CheckCode;