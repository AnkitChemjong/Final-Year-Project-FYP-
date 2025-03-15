import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { getUser } from "./Store/Slices/User_Slice";
import Profile from "./Pages/Profile";
import Teacher from "./Pages/Teacher";
import Course from "./Pages/Course";
import NotFound from "./Pages/NotFound";
import Dashboard from "./Pages/Dashboard";
import ResetCode from "./Pages/ResetCode";
import ChangePass from "./Pages/ChangePass";
import { Navigate } from "react-router-dom";
import { getApplication } from "./Store/Slices/ApplicationSlice";
import CommonSkeleton from "./Components/CommonSkeleton";
import CreateNewCourse from "./Pages/CreateNewCourse";
import { getCourse } from "./Store/Slices/Course_Slice";
import CourseDetails from "./Pages/CourseDetails";
import StudentCourses from "./Pages/StudentCourses";
import CourseProgress from "./Pages/CourseProgress";
import PrivicyPolicy from "./Pages/Privicy_Policy";


const PrivateRoute = ({ children }) => {
  const userStates = useSelector(state => state?.user);
  const { data: user, loading } = userStates;

  if (loading) {
    return <CommonSkeleton />
  }
  if (user) {
    if (user?.userRole?.includes('admin')) {
      return <Navigate to="/dashboard" />;
    } else {
      return children;
    }
  } 
  if(!loading && !user){
    return <Navigate to="/signup" />;
  }
  
};



const AuthRoute=({children})=>{
  const userStates = useSelector(state => state?.user);
  const { data: user, loading } = userStates;
  const logedUser=!!user;
  if (loading) {
    return <CommonSkeleton />; 
  }
  return !loading && logedUser? <Navigate to="/"/>:children;
}

const AdminTeacherRoute=({children})=>{
  const userStates = useSelector(state => state?.user);
  const { data: user, loading } = userStates;

  if (loading) {
    return <CommonSkeleton />
  }
  if (user) {
    if (user?.userRole?.includes('admin') || user?.userRole?.includes('teacher')) {
      return children;
    } else {
      return <Navigate to="/" />;
    }
  } 
  if(!loading && !user){
    return <Navigate to="/signup" />;
  }
}

function AdminRoute({ children }) {
  const userStates = useSelector(state => state?.user);
  const { data: user, loading } = userStates;
  if (loading) {
    return <CommonSkeleton />; 
  }
  if (!loading && (!user || !user?.userRole?.includes("admin"))) {
    return <Navigate to="/" />;
  }
  return children;
}
function HomeRestrictForAdmin({children}){
  const userStates = useSelector(state => state?.user);
  const { data: user, loading } = userStates;
  if (loading) {
    return <CommonSkeleton />; 
  }
  if(!loading && user?.userRole?.includes("admin")){
    return <Navigate to="/dashboard" />
  }
  else{
    return children;
  }
}


function App() {
  const logedUser=useSelector((state)=>state?.user)
  const applications=useSelector(state=>state?.application);
  const courses=useSelector(state=>state?.course);
  const dispatch=useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      if (!logedUser?.data) {
        await dispatch(getUser());
      }
      if (!applications?.data) {
        await dispatch(getApplication());
      }
      if (!courses?.data) {
        await dispatch(getCourse());
      }
    };
  
    fetchData();
  }, []);


  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomeRestrictForAdmin><Home/></HomeRestrictForAdmin>}/>
          <Route path="/signup" element={<AuthRoute><Signup/></AuthRoute>}/>
          <Route path="/signin" element={<AuthRoute><Signin/></AuthRoute>}/>
          <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>}/>
          <Route path="/course" element={<PrivateRoute><Course/></PrivateRoute>}/>
          <Route path="/course/details/:id" element={<PrivateRoute><CourseDetails/></PrivateRoute>}/>
          <Route path="/teacher" element={<PrivateRoute><Teacher/></PrivateRoute>}/>
          <Route path="/dashboard" element={<AdminRoute><Dashboard/></AdminRoute>}/>
          <Route path="/createnewcourse" element={<AdminTeacherRoute><CreateNewCourse/></AdminTeacherRoute>}/>
          <Route path="/edit_course/:courseId" element={<AdminTeacherRoute><CreateNewCourse/></AdminTeacherRoute>}/>
          <Route path="/resetcode" element={<ResetCode/>}/>
          <Route path="/changePass" element={<ChangePass/>}/>
          <Route path="/studentCourse" element={<PrivateRoute><StudentCourses/></PrivateRoute>}/>
          <Route path="/courseProgress/:id" element={<PrivateRoute><CourseProgress/></PrivateRoute>}/>
          <Route path="/privicyPolicy" element={<PrivateRoute><PrivicyPolicy/></PrivateRoute>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </Router>
    )
}

export default App
