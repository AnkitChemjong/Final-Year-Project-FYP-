import { Router } from "express";
import uploadCourse from "../../Services/UserService/Multer/courseData/index.mjs";
import CloudinaryControl from "../../Controllers/Course_Controller/Cloudinary_Course_File/index.mjs";
import addNewCourse from "../../Controllers/Course_Controller/AddNewCourse/index.mjs";
import getAllCourses from "../../Controllers/Course_Controller/GetAllCourses/index.mjs";
import updateCourse from "../../Controllers/Course_Controller/UpdateCourse/index.mjs";
import {getCourseDetails,checkPurchase} from "../../Controllers/Course_Controller/GetCourseDetails/index.mjs";
import DeleteCourse from "../../Controllers/Course_Controller/DeleteCourse/index.mjs";
import bulkUpload from "../../Controllers/Course_Controller/BulkUploadLecture/index.mjs";
import getSearchedCourse from "../../Controllers/Course_Controller/GetSearchedCourse/index.mjs";
import getEnrolledCourses from "../../Controllers/Course_Controller/GetEnrolledCourse/index.mjs";
import CourseProgress from "../../Controllers/Course_Controller/CourseProgress/index.mjs";
import getTopFourCourses from "../../Controllers/Course_Controller/GeTTopFourCourses/index.mjs";
import TeacherCourses from "../../Controllers/Course_Controller/GetTeacherCourses/index.mjs";
import UpdateCouseIsPublished from "../../Controllers/Course_Controller/UpdateTeacherCourse/index.mjs";
import getCourseQuizData from "../../Controllers/Course_Controller/GetCourseQuizData/index.mjs";
import storeCourseCertificate from "../../Controllers/Course_Controller/StoreCourseCertificate/index.mjs";
import uploadCourseCertificate from "../../Services/UserService/Multer/certificates/CourseCertificate/index.mjs";
import rateCourse from "../../Controllers/Course_Controller/Rate_Course/index.mjs";
import getStudentRating from "../../Controllers/Course_Controller/Get_Student_Rating/index.mjs";
import getAllRatingData from "../../Controllers/Course_Controller/GetAllRating/index.mjs";
import getAllProgress from "../../Controllers/Get_All_Progress/index.mjs";
import getAllPurchasedCourse from "../../Controllers/Course_Controller/Get_All_Purchased_Course/index.mjs";

const courseRouter=Router();

courseRouter.post("/upload",uploadCourse.single('file'),CloudinaryControl.uploadFileToCloudinary)
courseRouter.delete("/delete/:id",CloudinaryControl.deleteFileFromCloudinary)
courseRouter.post('/add',addNewCourse);
courseRouter.put('/update/:id',updateCourse);
courseRouter.get('/get/details/:id/:studentId',getCourseDetails);
courseRouter.get('/checkPurchase/:id/:studentId',checkPurchase);
courseRouter.get("/",getAllCourses);
courseRouter.delete('/deleteSingle',DeleteCourse.deleteSingleCourse);
courseRouter.delete('/deleteAll',DeleteCourse.deleteAllCourses);
courseRouter.delete('/deleteSelected',DeleteCourse.deleteSelectedCourses);
courseRouter.post('/bulkUpload',uploadCourse.array('files',10),bulkUpload);
courseRouter.post("/searchedCourse",getSearchedCourse);
courseRouter.get("/getEnrolledCourse/:studentId",getEnrolledCourses);
courseRouter.get("/getTopFourCourses",getTopFourCourses);
courseRouter.get("/getAllPurchasedCourse",getAllPurchasedCourse);

//teacherdashboard
courseRouter.get("/getTeacherCourses/:id",TeacherCourses.getTeachersCourses);
courseRouter.patch("/updateTeacherAllCourses",UpdateCouseIsPublished.updateAllCourses);
courseRouter.patch("/updateTeacherSingleCourse",UpdateCouseIsPublished.updateSingleCourse);
courseRouter.patch("/updateTeacherSelectedCourses",UpdateCouseIsPublished.updateSelectedCourses);

//course progress routes
courseRouter.get("/getCourseProgress/:userId/:courseId",CourseProgress.getCourseProgress);
courseRouter.post("/updateContentAsViewed",CourseProgress.updateContentAsViewed);
courseRouter.post("/resetCourseProgress",CourseProgress.resetCourseProgress);
courseRouter.post("/storeCourseCertificate/:userId/:courseId",uploadCourseCertificate.single('coursecertificate'),storeCourseCertificate);
courseRouter.post('/rateCourse/:userId/:courseId',rateCourse);
courseRouter.get('/getRatingData/:userId/:courseId',getStudentRating);
courseRouter.get('/getAllRating',getAllRatingData);
courseRouter.get('/getAllProgress',getAllProgress);

//for quiz
courseRouter.get("/getCourseQuizData/:id",getCourseQuizData);
courseRouter.post("/updateQuizData",CourseProgress.updateQuizData);
export default courseRouter;
