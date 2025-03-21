import User from "../../Model/User_Model/index.mjs";
import {v4 as uuid} from "uuid";

class UserClass{
    static async createUserModel(email,userName,password){
    const checkUser=await User.findOne({email:email});
    if(checkUser){
        return false;
    }
    else{
        const userId=uuid();
        const user=new User({userId,email,userName,password});
        await user.save();
        return true;
    }
    }
}

export default UserClass;