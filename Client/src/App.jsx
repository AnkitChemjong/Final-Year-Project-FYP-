import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Navbar from '@/Components/Navbar';
import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";
import { useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { getUser } from "./Store/Slices/User_Slice";
import Profile from "./Pages/Profile";



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
      </Routes>
    </Router>
  )
}

export default App
