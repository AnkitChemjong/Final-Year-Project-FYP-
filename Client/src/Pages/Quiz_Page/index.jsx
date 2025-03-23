import { UseContextApi } from '@/Components/ContextApi';
import { Get_Course_Quiz_Data, Update_Quiz_Data,Get_Course_Progress,Retake_Quiz } from '@/Routes';
import { axiosService } from '@/Services';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/Components/ui/button';
import { toast } from 'react-toastify';
import { FaChevronLeft, FaRedo } from 'react-icons/fa';


export default function Quiz() {
  const userState = useSelector((state) => state?.user);
  const { data: user, loading } = userState;
  const { id } = useParams();
  const navigate = useNavigate();
  const { courseQuizData, setCourseQuizData,showConfetti,setShowConfetti,courseCompletedDialog, setCourseCompletedDialog } = useContext(UseContextApi);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0); 
  const [quizSubmitted, setQuizSubmitted] = useState(false); 


  const getCourseQuizData = async () => {
    try {
      const response = await axiosService.get(`${Get_Course_Quiz_Data}/${id}`);
      if (response.status === 200) {
        setCourseQuizData(response?.data?.data?.quizData?.question);
      }
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch quiz data.');
    }
  };

  const handleAnswerSelect = (questionId, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const getCourseProgress = async () => {
    try{

        const response = await axiosService.get(
          `${Get_Course_Progress}/${user?._id}/${id}`
        );
        if (response?.status === 200) {
          if (!response?.data?.isPurchased) {
               navigate(-1);
               toast.error("first purchase the course.")
          }
          if(!response?.data?.contentCompleted){
            navigate(-1);
               toast.error("first complete the contents.")
          }
          if(response?.data?.progressData){
            setScore(response?.data?.progressData?.marksObtained);
            setQuizSubmitted(response?.data?.progressData?.quizSubmitted);
          }
        }
    }
    catch(error){
        console.log(error);
        navigate(-1);
        toast.error(error?.response?.data?.message);

    }
    };

 
  const handleSubmitQuiz =async () => {
    try{
    let correctAnswers = 0;

    courseQuizData.forEach((question) => {
      if (selectedAnswers[question._id] === question.answer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers*10);
     const response=await axiosService.post(Update_Quiz_Data,{userId:user?._id,courseId:id,mark:correctAnswers*10});
     if(response?.status === 200){
        if(Number(response?.data?.data?.marksObtained)>=Number(response?.data?.course?.quizData?.passMark)){
            setShowConfetti(true);
            setCourseCompletedDialog(true);
             setQuizSubmitted(response?.data?.data?.quizSubmitted);
             setSelectedAnswers({});
             navigate(`/courseProgress/${id}`);
             toast.success(`You scored ${response?.data?.data?.marksObtained} out of ${courseQuizData.length*10}!`);
        }
        else{
            setQuizSubmitted(response?.data?.data?.quizSubmitted);
             setSelectedAnswers({});
             toast.info(`You scored ${response?.data?.data?.marksObtained} out of ${courseQuizData.length*10}! retake exam.`);
        }
     }
    }
    catch(error){
        console.log(error);
        setSelectedAnswers({});
        toast.error(error?.response?.data?.message);
    }
    
  };

  const handleRetakeQuiz=async()=>{
    try{
          const response=await axiosService.post(Retake_Quiz,{userId:user?._id,courseId:id});
          if(response?.status === 200){
            toast.success(response?.data?.message);
            setQuizSubmitted(false);
            setScore(0);
          }
    }
    catch(error){
        console.log(error);
        toast.error(error?.response?.data?.message);
    }
  }

  useEffect(()=>{
    if(id && user){
        getCourseProgress();
    }
  },[id,user]);

  const handleResetQuiz = () => {
    setSelectedAnswers({});
  };

  useEffect(() => {
    if (!id) {
      navigate(-1);
    } else {
      getCourseQuizData();
    }
  }, [id, user]);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
    
      <div className="mb-6">
        <Button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 bg-green-600 hover:scale-105 transition-all duration-100 ease-in-out hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
        >
         <FaChevronLeft className='w-4 h-4 mr-2'/>
          Return
        </Button>
      </div>

      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Course Quiz</h1>

        {courseQuizData?.map((question, index) => (
          <div key={question._id} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {index + 1}. {question.question}
            </h2>
            <div className="space-y-3">
              {['optionA', 'optionB', 'optionC', 'optionD'].map((optionKey) => (
                <div
                  key={optionKey}
                  className={`p-4 rounded-lg cursor-pointer transition-all duration-200 border ${
                    selectedAnswers[question._id] === optionKey
                      ? 'bg-blue-100 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                  } `}
                  onClick={() => !quizSubmitted && handleAnswerSelect(question._id, optionKey)}
                >
                  <span className="font-medium text-gray-700">{optionKey.slice(-1)}.</span>{' '}
                  <span className="text-gray-700">{question[optionKey]}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-between mt-8">
          <Button
            onClick={handleResetQuiz}
            className="flex items-center gap-2 bg-gray-600 hover:scale-105 transition-all duration-100 ease-in-out hover:bg-gray-700 text-white px-4 py-2 rounded-lg shadow-md"
          >
            <FaRedo className="h-4 w-4" />
            Reset Quiz
          </Button>

          {!quizSubmitted ? (
            <Button
              onClick={handleSubmitQuiz}
              className="bg-green-600 hover:bg-blue-700 hover:scale-105 transition-all duration-100 ease-in-out text-white px-6 py-2 rounded-lg shadow-md"
              disabled={Object.keys(selectedAnswers).length !== courseQuizData?.length}
            >
              Submit Quiz
            </Button>
          ) : (
            <div className="text-center">
              <p className="text-xl font-bold mb-4 text-gray-800">
                Mark Obtained: {score} / {courseQuizData?.length*10}
              </p>
              <Button
              onClick={handleRetakeQuiz}
              className="bg-green-600 hover:bg-blue-700 hover:scale-105 transition-all duration-100 ease-in-out text-white px-6 py-2 rounded-lg shadow-md"
              >
              Retake Quiz
            </Button>
            </div>

          )}
        </div>
      </div>
    </div>
  );
}