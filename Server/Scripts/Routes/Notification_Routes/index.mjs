import { Router } from "express";
import getUserNotification from "../../Controllers/Notification_Controller/GetUserNotification/index.mjs";
import deleteUserNotification from "../../Controllers/Notification_Controller/DeleteNotification/index.mjs";
import updateUserNotification from "../../Controllers/Notification_Controller/UpdateNotification/index.mjs";


const notificationRouter=Router();

notificationRouter.get('/getUserNotification/:id',getUserNotification);
notificationRouter.delete('/deleteNotification',deleteUserNotification);
notificationRouter.patch('/updateUserNotification/:id',updateUserNotification);


export default notificationRouter;