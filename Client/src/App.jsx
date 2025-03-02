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
import { UseContextApi } from "./Components/ContextApi";
import { useContext } from "react";
import CommonSkeleton from "./Components/CommonSkeleton";
import CreateNewCourse from "./Pages/CreateNewCourse";
import { getCourse } from "./Store/Slices/Course_Slice";

const PrivateRoute = ({ children }) => {
  const logedUser = useSelector((state) => state?.user?.data);

  const isAuthenticated = !!logedUser; 
  if(isAuthenticated){
    if(logedUser?.userRole?.includes('admin')){
      return <Navigate to="/dashboard"/>
    }
    else if(!logedUser?.userRole?.includes('admin')){
       return children;
    }
  }
  else{
    return <Navigate to="/signup"/>
  }
};

const AuthRoute=({children})=>{
  const logedUser=useSelector((state)=>state?.user?.data)
  const user=!!logedUser;
  return user? <Navigate to="/"/>:children;
}
function AdminRoute({ children }) {
  const logedUser = useSelector((state) => state?.user?.data);
  if (!logedUser || !logedUser?.userRole?.includes("admin")) {
    return <Navigate to="/" />;
  }
  return children;
}
function HomeRestrictForAdmin({children}){
  const logedUser = useSelector((state) => state?.user?.data);
  if(logedUser?.userRole?.includes("admin")){
    return <Navigate to="/dashboard" />
  }
  else{
    return children;
  }
}


function App() {
  const {loading,setLoading}=useContext(UseContextApi);
  const logedUser=useSelector((state)=>state?.user)
  const applications=useSelector(state=>state?.application);
  const courses=useSelector(state=>state?.course);
  const dispatch=useDispatch();
  useEffect(()=>{
     if(!logedUser?.data){
      setLoading(true);
      dispatch(getUser()); 
     }
     if(!applications?.data){
      setLoading(true);
       dispatch(getApplication());
     }
     if(!courses?.data){
      setLoading(true);
       dispatch(getCourse());
     }
     setLoading(false);
  },[]);
if(loading){
  return(
     <CommonSkeleton/>
  )
}
else{

  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomeRestrictForAdmin><Home/></HomeRestrictForAdmin>}/>
          <Route path="/signup" element={<AuthRoute><Signup/></AuthRoute>}/>
          <Route path="/signin" element={<AuthRoute><Signin/></AuthRoute>}/>
          <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>}/>
          <Route path="/course" element={<PrivateRoute><Course/></PrivateRoute>}/>
          <Route path="/teacher" element={<PrivateRoute><Teacher/></PrivateRoute>}/>
          <Route path="/dashboard" element={<AdminRoute><Dashboard/></AdminRoute>}/>
          <Route path="/createnewcourse" element={<AdminRoute><CreateNewCourse/></AdminRoute>}/>
          <Route path="/edit_course/:courseId" element={<AdminRoute><CreateNewCourse/></AdminRoute>}/>
          <Route path="/resetcode" element={<ResetCode/>}/>
          <Route path="/changePass" element={<ChangePass/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </Router>
    )
}
}

export default App
