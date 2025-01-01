
const getLogedUser=(req,res)=>{
    try{
        let user=null;
       if(req?.session){
          let logedUser=req?.user;
           if(logedUser){
            user=logedUser;
           return res.json({user:user,message:"user"})
        }
       }
       return res.json({user:user,message:null,error:null})
    }
    catch(error){
       return res.json({message:"Error on finding loged User",user:null,error:error?.message});
    }
}
export default getLogedUser;