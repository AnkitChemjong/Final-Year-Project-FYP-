import UserClass from "../../Services/UserService/index.mjs"


export const createUser=async (req,res)=>{
try{
     const {email,userName,password}=req.body;
     await UserClass?.createUserModel(email,userName,password);
     res.json({
        message:"User Created Successfully"
     })

}catch(error){
    res.json({
        message:"Error on making user,try again",
        error:error?.message
    })
}
}