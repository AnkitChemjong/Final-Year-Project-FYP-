import BecomeTeacherApp from "../../../Model/Become_Teacher_Application/index.mjs";
import sendMailToUser from "../../../Services/UserService/Nodemailer/index.mjs";
import User from "../../../Model/User_Model/index.mjs";

const updateApplication=async (req,res)=>{
try{
     const {application,status}=req.body;
     if(status==="reject"){
        await BecomeTeacherApp.findByIdAndUpdate(application._id,{status:"rejected"});
        const subject="Details about your Application."
        const text=`we have successfully riviewed your CV.\n\n Sorry to inform you that you are not selected for the interview.\n Improve your CV and try again. \n you in the mail if you are approved or not.\n\nRegards,\nEfficient Pathsala`
        const email=application?.user?.email;
        await sendMailToUser(email,"",text,subject);
        return res.status(200).json({message:"Application Updated Successfully."});
     }
     if(status==="approve"){
        await BecomeTeacherApp.findByIdAndUpdate(application._id,{status:"approved"});
        const subject="Details about your Application."
        const text=`we have successfully riviewed your CV.\n\n Congratulation you are selected for the interview. \n We will inform you through mail for the Online interview.\n\nRegards,\nEfficient Pathsala`
        const email=application?.user?.email;
        await sendMailToUser(email,"",text,subject);
        return res.status(200).json({message:"Application Updated Successfully."});
     }
     if(status==="recrute"){
        await BecomeTeacherApp.findByIdAndUpdate(application._id,{status:"recruted"});
        await User.findByIdAndUpdate(application?.user?._id,{$addToSet:{userRole:"teacher"},$set: { myCV: application?.userCV }});
        const subject="Details about your Application."
        const text=`Congratulation! You have been recruted as Teacher.\n Hope you will follow respect the role and behave well.\n\nRegards,\nEfficient Pathsala`
        const email=application?.user?.email;
        await sendMailToUser(email,"",text,subject);
        return res.status(200).json({message:"Application Updated Successfully."});
     }
}
catch(error){
    return res.json({message:"Error on Updating application",error:error?.message})
}
}

export default updateApplication;