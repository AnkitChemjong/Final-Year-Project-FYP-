import User from "../../../Model/User_Model/index.mjs";

const handleStatus=async(req,res)=>{
    try{
        const {data,status}=req.body;
         if(!data || !status){
            return res.status(400).json({ message: "Both data and status are required" });
         }
         const usersToProcess = Array.isArray(data) ? data : [data];
        switch(status){
            case 'ban':
                const banResults = await Promise.all(
                    usersToProcess.map(user => 
                        User.findByIdAndUpdate(
                            user._id, 
                            {status: 'banned' },
                            { new: true }
                        )
                    )
                );
                return res.status(200).json({ 
                    message: "Users banned successfully",
                    results: banResults 
                });
            case 'unban':
                const unbanResults = await Promise.all(
                    usersToProcess.map(user => 
                        User.findByIdAndUpdate(
                            user._id, 
                            {  status: 'active' },
                            { new: true }
                        )
                    )
                );
                return res.status(200).json({ 
                    message: "Users unbanned successfully",
                    results: unbanResults 
                });
            default:
                return res.status(400).json({ message: "Invalid status provided" });
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"error on handling the status",error:error?.message});
    }
}
export default handleStatus;