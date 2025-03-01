
//user routes
export const User_Route=`/user`;
export const User_Login_Route=`${User_Route}/log`;
export const User_GoogleAuth_Route=`${User_Route}/auth/google`;
export const User_GitAuth_Route=`${User_Route}/auth/github`;
export const User_FBAuth_Route=`${User_Route}/auth/facebook`;
export const User_Token_Gen_Route=`${User_Route}/code`;
export const User_Check_Code_Route=`${User_Route}/check`;
export const User_Change_Pass_Route=`${User_Route}/changePass`;
export const User_Update_Pass_Route=`${User_Route}/updatePass`;
export const User_Upload_Profile_Image=`${User_Route}/userImageUpdate`;
export const User_Delete_Profile_Image=`${User_Route}/userImageDelete`;
export const User_Info_Update=`${User_Route}/userInfoUpdation`;
export const User_Become_Teacher=`${User_Route}/becomeTeacher`;
export const User_Update_CV=`${User_Route}/updateCV`;


//Application routes
export const Get_All_Applications='/application';
export const Update_Application=`${Get_All_Applications}/updateApplication`;
export const Delete_Single_Application=`${Get_All_Applications}/deleteSingle`;
export const Delete_All_Application=`${Get_All_Applications}/deleteAll`;


//Course Routes
export const Get_All_Course='/course';
export const Upload_Course_File=`${Get_All_Course}/upload`