import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Navbar from '@/Components/Navbar';
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



function App() {
  const logedUser=useSelector((state)=>state?.user?.data)
  const dispatch=useDispatch();
  useEffect(()=>{
     if(!logedUser){
      dispatch(getUser())
     }
  },[]);
  return (
    <Router>
         <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<Signin/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/course" element={<Course/>}/>
        <Route path="/teacher" element={<Teacher/>}/>
        <Route path="dashboard" element={<Dashboard/>}/>
        <Route path="resetcode" element={<ResetCode/>}/>
        <Route path="changePass" element={<ChangePass/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </Router>
  )
}

export default App
