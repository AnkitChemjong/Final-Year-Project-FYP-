import { Router } from "express";
import { createUser } from "../../Controllers/User_Controller/index.mjs";

const userRoute=Router();

userRoute.route('/').post(createUser);

export default userRoute;