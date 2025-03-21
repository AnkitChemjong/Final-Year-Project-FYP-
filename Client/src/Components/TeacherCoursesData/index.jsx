import React from 'react';
import CommonButton from '../CommonButton';
import { useNavigate } from 'react-router-dom';
import CommonTableForCourse from '../CommonTableForCourse';
import { formatForTeacherCourses } from '@/Utils';
import { ScrollArea } from '../ui/scroll-area';
import LottieAnimation from '@/Components/LottieAnimation';
import graduationcourse from '@/assets/graduationcourse.json';

export default function TeacherCoursesData({ courseList }) {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/createNewCourse');
  };

  return (
    <ScrollArea className="max-h-screen overflow-auto">

    <div className="flex flex-col w-full p-6  min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className='flex gap-1 items-center'>
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Your Courses</h1>
        <LottieAnimation animationData={graduationcourse} width={100} height={100} speed={1}/>
        </div>
        <CommonButton
          func={handleNavigation}
          text="Upload New Course"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-all duration-200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-600 text-sm font-medium">Total Courses</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">{courseList?.length || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-600 text-sm font-medium">Published Courses</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {courseList?.filter(course => course.isPublished).length || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-600 text-sm font-medium">Unpublished Courses</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {courseList?.filter(course => !course.isPublished).length || 0}
          </p>
        </div>
      </div>

   
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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