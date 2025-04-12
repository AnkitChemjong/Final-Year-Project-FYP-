import { UseContextApi } from '@/Components/ContextApi';
import { Get_Course_Quiz_Data, Update_Quiz_Data, Get_Course_Progress, Store_Course_Certificate } from '@/Routes';
import { axiosService } from '@/Services';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/Components/ui/button';
import { toast } from 'react-toastify';
import { FaChevronLeft, FaRedo } from 'react-icons/fa';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import LottieAnimation from '@/Components/LottieAnimation';
import quiz from '@/assets/quiz.json';
import { BlobProvider } from '@react-pdf/renderer';
import CourseCertificate from '@/Components/Certificate';
import signadmin from '/images/signadmin.jpg';
import logo from '/images/logo.png';
import { getAllProgress } from '@/Store/Slices/Get_All_Progress';

export default function Quiz() {
  const userState = useSelector((state) => state?.user);
  const { data: user, loading } = userState;
  const dispatch=useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { courseQuizData, setCourseQuizData, showConfetti, setShowConfetti, courseCompletedDialog, setCourseCompletedDialog } = useContext(UseContextApi);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false); 
  const [certificateBlob, setCertificateBlob] = useState(null); 
  const [courseProgress, setCourseProgress] = useState(null);


  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

 
  const getCourseQuizData = async () => {
    try {
      const response = await axiosService.get(`${Get_Course_Quiz_Data}/${id}`);
      if (response.status === 200) {
        const quizData = response?.data?.data?.quizData?.question;
        const shuffledQuestions = shuffleArray(quizData);
        setCourseQuizData(shuffledQuestions);
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
    try {
      const response = await axiosService.get(`${Get_Course_Progress}/${user?._id}/${id}`);
      if (response?.status === 200) {
        if (!response?.data?.isPurchased) {
          navigate(-1);
          toast.error("First purchase the course.");
        }
        if (!response?.data?.contentCompleted) {
          navigate(-1);
          toast.error("First complete the contents.");
        }
        if (response?.data?.progressData) {
            setCourseProgress(response?.data?.progressData);
          setScore(response?.data?.progressData?.marksObtained);
          setQuizSubmitted(response?.data?.progressData?.quizSubmitted);
        }
      }
    } catch (error) {
      console.log(error);
      navigate(-1);
      toast.error(error?.response?.data?.message);
    }
  };


  const handleSubmitQuiz = async () => {
    try {
      let correctAnswers = 0;

      courseQuizData.forEach((question) => {
        if (selectedAnswers[question._id] === question.answer) {
          correctAnswers++;
        }
      });
      setScore(correctAnswers * 10);

      const response = await axiosService.post(Update_Quiz_Data, {
        userId: user?._id,
        courseId: id,
        mark: correctAnswers * 10,
      });

      if (response?.status === 200) {
        if (
          Number(response?.data?.data?.marksObtained) >= Number(response?.data?.course?.quizData?.passMark) &&
          response?.data?.data?.completed
        ) {
          setIsGeneratingCertificate(true); 
        } else {
          setQuizSubmitted(response?.data?.data?.quizSubmitted);
          setSelectedAnswers({});
          dispatch(getAllProgress());
          toast.info(`You scored ${response?.data?.data?.marksObtained} out of ${courseQuizData.length * 10}! Retake exam.`);
        }
      }

      // Handle 201 status
      if (response?.status === 201) {
        getCourseProgress();
        setSelectedAnswers({});
        toast.info(`${response?.data?.message}`);
      }
      // Handle 202 status
      if (response?.status === 202) {
        setIsGeneratingCertificate(true);
        getCourseProgress();
        setSelectedAnswers({});
        toast.info(`${response?.data?.message}`);
      }
    } catch (error) {
      console.log(error);
      setSelectedAnswers({});
      toast.error(error?.response?.data?.message);
    }
  };

  const handleRetakeQuiz = async () => {
    try {
      setQuizSubmitted(false);
      setSelectedAnswers({});
      getCourseQuizData();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  useEffect(() => {
    if (id && user) {
      getCourseProgress();
    }
  }, [id, user]);

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


  const sendCertificateToBackend = async (blob) => {
    const formData = new FormData();
    formData.append('coursecertificate', blob, 'certificate.pdf');

    try {
      const response = await axiosService.post(`${Store_Course_Certificate}/${user?._id}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response?.status === 200) {
        dispatch(getAllProgress);
        console.log('Certificate stored successfully:', response);
      }
    } catch (error) {
      console.error('Error storing certificate:', error?.response?.data?.message);
    }
  };


  return (
    <div>
      <Navbar />
      <div className="p-6 bg-gradient-to-b min-h-screen">
        <div className="mb-6">
          <Button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-green-600 hover:scale-105 transition-all duration-100 ease-in-out hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
          >
            <FaChevronLeft className="w-4 h-4 mr-2" />
            Return
          </Button>
        </div>

        <div className="w-full mx-auto bg-white p-8 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 justify-center">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 font-heading">Course Quiz</h1>
            <LottieAnimation animationData={quiz} width={200} height={200} speed={1} />
          </div>

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
                    }`}
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
                  Mark Obtained: {score} / {courseQuizData?.length * 10}
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


      {isGeneratingCertificate && (
        <BlobProvider
          document={
            <CourseCertificate
              studentName={user?.userName} 
              courseTitle={courseProgress?.courseId?.title } 
              startDate={new Date(courseProgress?.createdAt).toLocaleDateString()}
              completionDate={new Date().toLocaleDateString()}
              userImage={user?.userImage}
              websiteLogo={logo}
              adminSignPhoto={signadmin}
              marksObtained={score}
              total={(courseQuizData?.length*10).toString()}
            />
          }
        >
          {({ blob, loading, error }) => {
            if (error) {
            
              setIsGeneratingCertificate(false); // Stop generating the certificate
            }
            if (!loading && blob) {
           
              setCertificateBlob(blob); // Store the generated blob in state
              setIsGeneratingCertificate(false); // Stop generating the certificate

              // Send the blob to the backend
              sendCertificateToBackend(blob).then(() => {
                setShowConfetti(true);
                setCourseCompletedDialog(true);
                setQuizSubmitted(true);
                setSelectedAnswers({});
                navigate(`/courseProgress/${id}`);
                toast.success(`You scored ${score} out of ${courseQuizData.length * 10}`);
              });
            }
            return null; // Render nothing
          }}
        </BlobProvider>
      )}

      <Footer />
    </div>
  );
}