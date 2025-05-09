
//Server Url
export const Host=import.meta.env.VITE_BACKEND_URL;
//user routes
export const User_Route=`/user`;
export const User_Temp_Route=`${User_Route}/temp`;
export const User_Temp_Code_Route=`${User_Route}/checktempcode`;
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
export const Get_All_User=`${User_Route}/getAllUsers`;
export const SEARCH_TEACHERS_ROUTES=`${User_Route}/searchedTeacher`;
export const Get_Teacher_Detail=`${User_Route}/get/details`;
export const Update_Teacher_Info=`${User_Route}/update/teacherinfo`;
export const Handle_Status=`${User_Route}/handleStatus`;
export const Get_Online_Users=`${User_Route}/getOnlineUsers`;
export const Toggle_Theme=`${User_Route}/toggleTheme`;


//Application routes
//becometeacher
export const Get_All_Applications='/application';
export const Update_Application=`${Get_All_Applications}/updateApplication`;
export const Delete_Single_Application=`${Get_All_Applications}/deleteSingle`;
export const Delete_All_Application=`${Get_All_Applications}/deleteAll`;
export const Delete_Selected_Application=`${Get_All_Applications}/deleteSelected`;

//hireteacher
export const Hire_Teacher=`${Get_All_Applications}/hireteacher`;
export const Get_All_Hire_Application=`${Get_All_Applications}/getallhire`;
export const Get_Student_Hire_Application=`${Get_All_Applications}/getstudenthire`;
export const Get_Teacher_Hire_Application=`${Get_All_Applications}/getteacherhire`;
export const Delete_Hire_Single_Application=`${Get_All_Applications}/deletehiresingle`;
export const Delete_Hire_All_Application=`${Get_All_Applications}/deletehireall`;
export const Delete_Hire_Selected_Application=`${Get_All_Applications}/deletehireselected`;
export const Get_Hire_Application_Details=`${Get_All_Applications}/gethireapplicationdetails`;
export const Update_Hire_Application_Details=`${Get_All_Applications}/updatehireapplicationdetails`;
export const Update_Hire_Application_Single_Status=`${Get_All_Applications}/updatesinglehireapplicationstatus`;
export const Update_Hire_Application_Selected_Status=`${Get_All_Applications}/updateselectedhireapplicationstatus`;
export const Update_Hire_Application_All_Status=`${Get_All_Applications}/updateallhireapplicationstatus`;
export const Rate_Teacher=`${Get_All_Applications}/rateTeacher`;


//Course Routes
export const Get_All_Course='/course';
export const Upload_Course_File=`${Get_All_Course}/upload`
export const Delete_Course_File=`${Get_All_Course}/delete`
export const Add_New_Course=`${Get_All_Course}/add`
export const Update_Course=`${Get_All_Course}/update`
export const Delete_Single_Course=`${Get_All_Course}/deleteSingle`
export const Delete_All_Course=`${Get_All_Course}/deleteAll`
export const Delete_Selected_Course=`${Get_All_Course}/deleteSelected`
export const Upload_Bulk_File=`${Get_All_Course}/bulkUpload`
export const SEARCH_COURSE_ROUTES=`${Get_All_Course}/searchedCourse`
export const Get_Enrolled_Course=`${Get_All_Course}/getEnrolledCourse`;
export const Get_Course_Detail=`${Get_All_Course}/get/details`;
export const Get_Purchase_Detail=`${Get_All_Course}/checkPurchase`;
export const Get_Course_Progress=`${Get_All_Course}/getCourseProgress`;
export const Update_Content_As_Viewed=`${Get_All_Course}/updateContentAsViewed`;
export const Reset_Course_Progress=`${Get_All_Course}/resetCourseProgress`;
export const Get_Top_Four_Courses=`${Get_All_Course}/getTopFourCourses`;
export const Get_Teacher_Courses=`${Get_All_Course}/getTeacherCourses`;
export const Update_Teacher_Single_Course=`${Get_All_Course}/updateTeacherSingleCourse`;
export const Update_Teacher_Selected_Course=`${Get_All_Course}/updateTeacherSelectedCourses`;
export const Update_Teacher_All_Course=`${Get_All_Course}/updateTeacherAllCourses`;
export const Rate_Course=`${Get_All_Course}/rateCourse`;
export const Get_Student_Rating_Data=`${Get_All_Course}/getRatingData`;
export const Get_All_Rating_Data=`${Get_All_Course}/getAllRating`;
export const Get_All_Progress_Data=`${Get_All_Course}/getAllProgress`;
export const Get_All_Purchased_Course_Data=`${Get_All_Course}/getAllPurchasedCourse`;
export const Get_Teacher_Purchase_Data=`${Get_All_Course}/getPurchaseDataTeacher`;
export const Get_All_Teacher_Purchase_Data=`${Get_All_Course}/getAllTeacherPurchaseData`;
export const Get_All_Purchase_Data=`${Get_All_Course}/getAllPurchaseData`;

//quiz
export const Get_Course_Quiz_Data=`${Get_All_Course}/getCourseQuizData`;
export const Update_Quiz_Data=`${Get_All_Course}/updateQuizData`;
export const Store_Course_Certificate=`${Get_All_Course}/storeCourseCertificate`;

//Payment Routes
export const Payment='/payment';
export const Initialize_Esewa_Payment=`${import.meta.env.VITE_BACKEND_URL}${Payment}/initialize-esewa`;

export const Initialize_Khalti_Payment=`${import.meta.env.VITE_BACKEND_URL}${Payment}/initialize-khalti`;

//subscription
export const Subscription='/subscription';
export const Initialize_Esewa_Payment_Subscription=`${import.meta.env.VITE_BACKEND_URL}${Subscription}/initialize-esewa`;

export const Initialize_Khalti_Payment_Subscription=`${import.meta.env.VITE_BACKEND_URL}${Subscription}/initialize-khalti`;
export const Get_All_Subscription_Payment=`${Subscription}/getAllSubscriptionPayment`;


//Notification
export const Notification='/notification';
export const Get_User_Notification=`${Notification}/getUserNotification`;
export const Delete_Notification=`${Notification}/deleteNotification`;
export const Update_Notification=`${Notification}/updateUserNotification`;
