import { BrowserRouter as Router,Routes,Route } from "react-router-dom";
import Navbar from '@/Components/Navbar';
import Home from "./Pages/Home";
import Signin from "./Pages/Signin";
import Signup from "./Pages/Signup";


function App() {
 

  return (
    <Router>
         <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/signin" element={<Signin/>}/>
      </Routes>
    </Router>
  )
}

export default App
