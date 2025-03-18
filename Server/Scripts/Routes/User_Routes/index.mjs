import { Router } from "express";
import { createUser } from "../../Controllers/User_Controller/CreateUser/index.mjs";
import getLogedUser from "../../Controllers/User_Controller/GetLogedUser/index.mjs";
import logoutUser from "../../Controllers/User_Controller/LogoutUser/index.mjs";
import passport from "passport";
import GenCode from "../../Controllers/User_Controller/GenCode/index.mjs";
import CheckCode from "../../Controllers/User_Controller/CheckCode/index.mjs";
import ChangePassword,{UpdatePassword} from "../../Controllers/User_Controller/ChangePassword/index.mjs";
import ProfileImage from "../../Controllers/User_Controller/ProfileImage/index.mjs";
import upload from "../../Services/UserService/Multer/profileImage/index.mjs";
import UserInfoUpdate from "../../Controllers/User_Controller/UserInfoUpdate/index.mjs";
import uploadCV from "../../Services/UserService/Multer/becomeTeacher/index.mjs";
import BecomeTeacher from "../../Controllers/User_Controller/BecomeTeacherApplication/index.mjs";
import HandleCV from "../../Controllers/User_Controller/HandleCV/index.mjs";
import getAllUsers from "../../Controllers/User_Controller/GetAllUsers/index.mjs";
import getSearchedTeacher from "../../Controllers/User_Controller/GetSearchedTeacher/index.mjs";
import getTeacherDetails from "../../Controllers/User_Controller/GetTeacherDetails/index.mjs";
import { updateTeacherInfo } from "../../Controllers/User_Controller/UpdateTeacherInfo/index.mjs";
import uploadCertificate from "../../Services/UserService/Multer/certificates/TeacherCertificate/index.mjs";


const userRoute=Router();

userRoute.route('/').post(createUser).get(getLogedUser).delete(logoutUser);

userRoute.get('/getAllUsers',getAllUsers);
userRoute.post('/code',GenCode);
userRoute.post('/check',CheckCode);
userRoute.patch('/changePass',ChangePassword);
userRoute.patch('/updatePass',UpdatePassword);
userRoute.post('/log', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return res.status(500).json({ message: 'Error in login', status: 500 });

        if (info.status===401) {
            return res.status(info.status || 401).json({ message:"User is not Registered."});
        }
        if (info.status===402) {
            return res.status(info.status || 402).json({ message:"Incorrect Password."});
        }

        req.logIn(user, (err) => {
            if (err) return res.status(500).json({ message: 'Error in session handling' });

            return res.status(200).json({ message: 'Logged in successfully', user});
        });
    })(req, res, next);
});

userRoute.get('/auth/google',passport.authenticate('google'));
userRoute.get('/auth/github',passport.authenticate('github'));
userRoute.get('/auth/facebook',passport.authenticate('facebook'));
userRoute.patch('/userImageUpdate',upload.single('profile-image'),ProfileImage.updateProfileImage)
userRoute.delete('/userImageDelete',ProfileImage.deleteProfileImage);
userRoute.patch('/userInfoUpdation',UserInfoUpdate.updateUserInfo);
userRoute.post('/becomeTeacher',uploadCV.single("cv"),BecomeTeacher.uploadCV);
userRoute.patch('/updateCV',uploadCV.single("cv"),HandleCV.updateCV);
userRoute.post('/searchedTeacher',getSearchedTeacher);
userRoute.get('/get/details/:id',getTeacherDetails);
userRoute.post('/update/teacherinfo/:id',uploadCertificate.single("certificate"),updateTeacherInfo);
  

export default userRoute;