import UserClass from "../../../Services/UserService/index.mjs"


export const createUser=async (req,res)=>{
try{
     const {email,userName,password}=req.body;
     const userCreation=await UserClass?.createUserModel(email,userName,password);
     if(userCreation){
        return res.status(200).json({
           message:"User created successfully"
        })
     }
     else{
        return res.status(400).json({
           message:"User already exist"
           });
     }
     }
catch(error){
    return res.status(500).json({
        message:"Error on making user,try again",
        error:error?.message
    })
}
}

