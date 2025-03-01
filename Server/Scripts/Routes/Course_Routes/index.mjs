import { Router } from "express";
import uploadCourse from "../../Services/UserService/Multer/courseData/index.mjs";
import CloudinaryControl from "../../Controllers/Course_Controller/index.mjs";


const courseRouter=Router();


courseRouter.post("/upload",uploadCourse.single('file'),CloudinaryControl.uploadFileToCloudinary)
courseRouter.delete("/delete/:id",CloudinaryControl.deleteFileFromCloudinary)


export default courseRouter;
