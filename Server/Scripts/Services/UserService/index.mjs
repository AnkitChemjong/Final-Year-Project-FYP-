import User from "../../Model/User_Model/index.mjs";
import {v4 as uuid} from "uuid";

class UserClass{
    static async createUserModel(email,userName,password){
        const userId=uuid();
        const user=new User({userId,email,userName,password});
        await user.save();
    }
}

export default UserClass;