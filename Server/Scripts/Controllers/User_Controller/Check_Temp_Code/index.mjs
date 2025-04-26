import bcrypt from 'bcrypt';
import TempUser from "../../../Model/TempUserModel/index.mjs";
import UserClass from '../../../Services/UserService/index.mjs';

const CheckTempCode=async (req,res)=>{
    try{
        const {code,email}=req.body;
        const user=await TempUser.findOne({email:email});
        const match=await bcrypt.compare(code,user?.confirmCode);
        if(user){
            if(match){
                if(user?.codeDueTime>Date.now()){
                await UserClass?.createUserModel(email,user?.userName,user?.password);
                await TempUser.findByIdAndDelete(user?._id);
                  return res.status(200).json({
                   message:"User created successfully"
                });
                }
                else{
                    return res.status(201).json({message:"Code Timedout restart again."});
                }
            }
            else{
                return res.status(401).json({message:"Code doesn't matched."})
            }
        }
        else{
            return res.status(400).json({message:"No user Found of the email."})
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"error on checking temp code."})
    }
}
export default CheckTempCode;