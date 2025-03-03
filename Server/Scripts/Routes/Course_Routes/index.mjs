import { Router } from "express";
import uploadCourse from "../../Services/UserService/Multer/courseData/index.mjs";
import CloudinaryControl from "../../Controllers/Course_Controller/Cloudinary_Course_File/index.mjs";
import addNewCourse from "../../Controllers/Course_Controller/AddNewCourse/index.mjs";
import getAllCourses from "../../Controllers/Course_Controller/GetAllCourses/index.mjs";
import updateCourse from "../../Controllers/Course_Controller/UpdateCourse/index.mjs";
import getCourseDetails from "../../Controllers/Course_Controller/GetCourseDetails/index.mjs";
import DeleteCourse from "../../Controllers/Course_Controller/DeleteCourse/index.mjs";
import bulkUpload from "../../Controllers/Course_Controller/BulkUploadLecture/index.mjs";

const courseRouter=Router();

courseRouter.post("/upload",uploadCourse.single('file'),CloudinaryControl.uploadFileToCloudinary)
courseRouter.delete("/delete/:id",CloudinaryControl.deleteFileFromCloudinary)
courseRouter.post('/add',addNewCourse);
courseRouter.put('/update/:id',updateCourse);
courseRouter.get('/get/details/:id',getCourseDetails);
courseRouter.get("/",getAllCourses);
courseRouter.delete('/deleteSingle',DeleteCourse.deleteSingleCourse);
courseRouter.delete('/deleteAll',DeleteCourse.deleteAllCourses);
courseRouter.delete('/deleteSelected',DeleteCourse.deleteSelectedCourses);
courseRouter.post('/bulkUpload',uploadCourse.array('files',10),bulkUpload);


export default courseRouter;
