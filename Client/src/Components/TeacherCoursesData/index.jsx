import React, { useContext } from 'react';
import CommonButton from '../CommonButton';
import { useNavigate } from 'react-router-dom';
import CommonTableForCourse from '../CommonTableForCourse';
import { formatForTeacherCourses, courseCurriculumInitialFormData, courseLandingInitialFormData, courseQuizInitialFormData } from '@/Utils';
import { ScrollArea } from '../ui/scroll-area';
import LottieAnimation from '@/Components/LottieAnimation';
import graduationcourse from '@/assets/graduationcourse.json';
import { UseContextApi } from '../ContextApi';
import { FaBook, FaCheckCircle, FaEyeSlash } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function TeacherCoursesData({ courseList, teacherData }) {
  const navigate = useNavigate();
  const { setCurrentEditedCourseId, setCourseLandingFormData, setCourseCurriculumFormData, courseQuizFormData, setCourseQuizFormData } = useContext(UseContextApi);
  const userState = useSelector(state => state?.user);
  const { data: user, loading } = userState;
  
  const handleNavigation = () => {
    setCurrentEditedCourseId(null);
    setCourseQuizFormData(courseQuizInitialFormData);
    setCourseLandingFormData(courseLandingInitialFormData);
    setCourseCurriculumFormData(courseCurriculumInitialFormData);
    navigate("/createnewcourse");
  };

  const totalCourses = courseList?.length || 0;
  const publishedCourses = courseList?.filter(course => course.isPublished).length || 0;
  const unpublishedCourses = courseList?.filter(course => !course.isPublished).length || 0;

  return (
    <ScrollArea className="h-screen overflow-auto">
      <div className={`flex flex-col w-full p-4 md:p-6 min-h-screen`}>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
          <div className='flex items-center gap-2 md:gap-4'>
            <h1 className={`text-2xl sm:text-3xl font-bold ${user?.theme ? "text-gray-800" : "text-white"} font-heading`}>
              Your Courses
            </h1>
            <div className="w-16 h-16 sm:w-24 sm:h-24">
              <LottieAnimation 
                animationData={graduationcourse} 
                width="100%" 
                height="100%" 
                speed={1}
              />
            </div>
          </div>
          
          <CommonButton
            disable={!teacherData?.subscription && courseList?.length >= 3}
            func={handleNavigation}
            text="Upload New Course"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg shadow-md transition-all duration-200 text-sm sm:text-base"
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Total Courses */}
          <div className={`${user?.theme ? "bg-white" : "bg-black"} p-4 md:p-6 rounded-lg shadow-sm border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-medium font-heading">Total Courses</h3>
                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{totalCourses}</p>
              </div>
              <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                <FaBook className="text-blue-600 text-lg sm:text-xl" />
              </div>
            </div>
          </div>

          {/* Published Courses */}
          <div className={`${user?.theme ? "bg-white" : "bg-black"} p-4 md:p-6 rounded-lg shadow-sm border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-medium font-heading">Published Courses</h3>
                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{publishedCourses}</p>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                <FaCheckCircle className="text-green-600 text-lg sm:text-xl" />
              </div>
            </div>
          </div>

          {/* Unpublished Courses */}
          <div className={`${user?.theme ? "bg-white" : "bg-black"} p-4 md:p-6 rounded-lg shadow-sm border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-medium font-heading">Unpublished Courses</h3>
                <p className="text-2xl sm:text-3xl font-bold mt-1 sm:mt-2">{unpublishedCourses}</p>
              </div>
              <div className="bg-yellow-100 p-2 sm:p-3 rounded-full">
                <FaEyeSlash className="text-yellow-600 text-lg sm:text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className={`${user?.theme ? "bg-white" : "bg-black text-white"} rounded-lg shadow-sm py-3 md:py-5 border border-gray-200 overflow-hidden`}>
          <CommonTableForCourse
            data={courseList}
            header={formatForTeacherCourses}
            page="teacher-page"
          />
        </div>
      </div>
    </ScrollArea>
  );
}