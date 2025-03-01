import BecomeTeacherApp from "../../../Model/Become_Teacher_Application/index.mjs";
import sendMailToUser from "../../../Services/UserService/Nodemailer/index.mjs";

class BecomeTeacher{
    static uploadCV=async (req,res)=>{
        try {
            const user=req.user;
            if(!req.file){
             return res.status(400).json({message:"File is Required"});
            }
            const fileName=`${user?.userId}/becomeTeacher/${req.file.filename}`;
            await BecomeTeacherApp.create({user:user?._id,userName:user?.userName,userCV:fileName});
            const subject="Details about Becoming Teacher."
            const text=`You have successfully uploaded the CV.\n\n wait for few days for the details and we will inform \n you in the mail if you are approved or not.\n\nRegards,\nEfficient Pathsala`
            const email=user?.email;
            await sendMailToUser(email,"",text,subject);
            return res.status(200).json({message:"CV Uploaded Successfully. Check mail for more detail."});
       } catch (err) {
           return res.status(500).json({ message: err.message });
       }

    }
}
export default BecomeTeacher;