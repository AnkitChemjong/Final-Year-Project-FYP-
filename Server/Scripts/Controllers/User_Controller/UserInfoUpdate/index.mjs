import User
 from "../../../Model/User_Model/index.mjs";
class UserInfoUpdate{
    static updateUserInfo=async (req,res)=>{
        try{
            const user=req.user;
            const {userName,address,phone,gender,DOB}=req.body;
            await User.findByIdAndUpdate(user?._id,{$set:{userName:userName,address:address,phone:phone,gender:gender,DOB:DOB}});
            return res.status(200).json({message:"Profile Updated successfully"});
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
    static changePassword=async (req,res)=>{
        try{

        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
}
export default UserInfoUpdate;