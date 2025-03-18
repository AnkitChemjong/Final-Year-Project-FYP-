import User from "../../../Model/User_Model/index.mjs";
import fs from 'fs';

class ProfileImage{
    static updateProfileImage=async (req,res)=>{
        try {
            const user=req.user;
            if(!req.file){
             return res.status(400).json({message:"File is Required"});
            }
            const fileName=`${user?.userId}/UserImage/${req.file.filename}`;
            await User.findByIdAndUpdate(user?._id,{userImage:fileName},{
             new:true,runValidators:true
            });
            //console.log(updateUser);
            return res.status(200).json({message:"Image Updated Successfully"});
       } catch (err) {
           return res.status(500).json({ message: err.message });
       }

    }

    static deleteProfileImage=async (req,res)=>{
        try{
            const user=req.user;
            if(user){
                const fileName=`./Scripts/Upload/${user?.userImage}`;
                fs.unlink(fileName,(err)=>{
                    if (err) {
                        console.error('Error deleting file:', err);
                      } else {
                        console.log('File deleted successfully!');
                      }
                })
                await User.findByIdAndUpdate(user?._id,{$unset:{userImage:""}});
                return res.status(200).json({message:"Profile image removed successfully"});
            }
        }
        catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }
}

export default ProfileImage;