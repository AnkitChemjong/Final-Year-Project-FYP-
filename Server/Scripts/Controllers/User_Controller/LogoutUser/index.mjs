
const logoutUser=(req,res)=>{
try{
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({message:'Error logging out',error:error?.message});
        }
        res.clearCookie('hook',{httpOnly:true,path:'/' }); 
        return res.status(200).json({message:'Logout successfully',error:null});
    });
}
catch(error){
    return res.status(500).json({message:"Error logging out",error:error?.message})
}
}
export default logoutUser;