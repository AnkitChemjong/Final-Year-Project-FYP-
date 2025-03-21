import { Router } from "express";
import getAllApplication from "../../Controllers/Application_Controller/GetAllApplication/index.mjs";
import updateApplication from "../../Controllers/Application_Controller/UpdateApplication/index.mjs";
import DeleteApplication from "../../Controllers/Application_Controller/DeleteApplication/index.mjs";
import hireTeacherCreate from "../../Controllers/Hiring_Controller/Hiring_Create/index.mjs";
import getAllHireApplication from "../../Controllers/Hiring_Controller/Get_All_Application/index.mjs";
import GetSpecificApplication from "../../Controllers/Hiring_Controller/Get_Specific_Application/index.mjs";
import DeleteHireApplication from "../../Controllers/Hiring_Controller/Delete_Hire_Application/index.mjs";
import ManipulateApplication from "../../Controllers/Hiring_Controller/Manipulate_Application_Hire/index.mjs";

const appRouter=Router();

//Become Teacher
appRouter.get('/',getAllApplication);
appRouter.patch('/updateApplication',updateApplication);
appRouter.delete('/deleteSingle',DeleteApplication.deleteSingleApplication);
appRouter.delete('/deleteAll',DeleteApplication.deleteAllApplication);
appRouter.delete('/deleteSelected',DeleteApplication.deleteSelectedApplication);

//hireTeacher
appRouter.post('/hireteacher',hireTeacherCreate);
appRouter.get('/getallhire',getAllHireApplication);
appRouter.get('/getstudenthire/:id',GetSpecificApplication.getStudentApplication);
appRouter.get('/getteacherhire/:id',GetSpecificApplication.getTeacherApplication);
appRouter.delete('/deletehiresingle',DeleteHireApplication.deleteSingleApplication);
appRouter.delete('/deletehireall',DeleteHireApplication.deleteAllApplication);
appRouter.delete('/deletehireselected',DeleteHireApplication.deleteSelectedApplication);
appRouter.get('/gethireapplicationdetails/:id',ManipulateApplication.getApplicationDetails);
appRouter.patch('/updatehireapplicationdetails/:id',ManipulateApplication.updateApplicationDetails);


export default appRouter;