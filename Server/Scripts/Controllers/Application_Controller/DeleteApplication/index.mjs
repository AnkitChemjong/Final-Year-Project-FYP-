import BecomeTeacherApp from "../../../Model/Become_Teacher_Application/index.mjs";
import fs from 'fs';


class DeleteApplication{
static deleteSingleApplication=async (req,res)=>{
    try{

        const {data}=req.body;
        if(data?.status !== "recruted" ){
                            const fileName=`./Scripts/Upload/${data?.userCV}`;
                            fs.unlink(fileName,(err)=>{
                                if (err) {
                                    console.error('Error deleting file:', err);
                                  } else {
                                    console.log('File deleted successfully!');
                                  }
                            })
        }
        await BecomeTeacherApp.findByIdAndDelete(data?._id);
        return res.status(200).json({message:"application successfully deleted.",error:null});
        
    }
    catch(error){
        return res.status(500).json({message:"Error on deleting application",error:error?.message})
    }

}
static deleteAllApplication=async (req,res)=>{
    try{

        const {status}=req.body;
        if(status==="all"){
            const applications=await BecomeTeacherApp.find({});
            if(applications?.status !== "recruted" ){
                applications.forEach((item)=>{
                                        const fileName=`./Scripts/Upload/${item?.userCV}`;
                                        fs.unlink(fileName,(err)=>{
                                            if (err) {
                                                console.error('Error deleting file:', err);
                                              } else {
                                                console.log('File deleted successfully!');
                                              }
                                        })
                                    });
                }
            await BecomeTeacherApp.deleteMany({});   
            return res.status(200).json({message:"All application successfully deleted.",error:null});
        }
        else{
            const applications=await BecomeTeacherApp.find({status:status});
            if(status !== "recruted" ){
            applications.forEach((item)=>{
                                    const fileName=`./Scripts/Upload/${item?.userCV}`;
                                    fs.unlink(fileName,(err)=>{
                                        if (err) {
                                            console.error('Error deleting file:', err);
                                          } else {
                                            console.log('File deleted successfully!');
                                          }
                                    })
                                });
            }
            await BecomeTeacherApp.deleteMany({status:status});
            return res.status(200).json({message:"All application successfully deleted.",error:null});
        }

        
    }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Error on deleting many application",error:error?.message});
    }

}

static deleteSelectedApplication=async (req,res)=>{
    try{
        const {data}=req.body;
            data.forEach(async (item)=>{
                if(item?.status !== "recruted" ){
                                            const fileName=`./Scripts/Upload/${item?.userCV}`;
                                            fs.unlink(fileName,(err)=>{
                                                if (err) {
                                                    console.error('Error deleting file:', err);
                                                  } else {
                                                    console.log('File deleted successfully!');
                                                  }
                                            })
                    }

                await BecomeTeacherApp.findByIdAndDelete(item._id);
            })
            return res.status(200).json({message:"All selected application successfully deleted.",error:null});    
        }
    catch(error){
        console.log(error)
        return res.status(500).json({message:"Error on deleting selected application",error:error?.message});
    }

}
}
export default DeleteApplication;