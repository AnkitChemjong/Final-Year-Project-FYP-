import { Router } from "express";
import getAllApplication from "../../Controllers/Application_Controller/GetAllApplication/index.mjs";
import updateApplication from "../../Controllers/Application_Controller/UpdateApplication/index.mjs";
import DeleteApplication from "../../Controllers/Application_Controller/DeleteApplication/index.mjs";

const appRouter=Router();


appRouter.get('/',getAllApplication);
appRouter.patch('/updateApplication',updateApplication);
appRouter.delete('/deleteSingle',DeleteApplication.deleteSingleApplication);
appRouter.delete('/deleteAll',DeleteApplication.deleteAllApplication);
appRouter.delete('/deleteSelected',DeleteApplication.deleteSelectedApplication);


export default appRouter;