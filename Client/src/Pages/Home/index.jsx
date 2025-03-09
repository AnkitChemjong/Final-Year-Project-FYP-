import React,{useEffect} from 'react';
import { Button } from '@/Components/ui/button';
import { useSelector } from 'react-redux';
import { useNavigate,useLocation } from 'react-router-dom';
import Navbar from '@/Components/Navbar';
import { toast } from 'react-toastify';


export default function Home() {
  const location = useLocation();
    const params = new URLSearchParams(location.search);
    console.log(params);
    const status=params.get('payment');
    useEffect(() => {
      if (status && status === 'success') {
        toast.success("Payment Successful");
      }
    }, [location.search]);


  const user=useSelector(state=>state?.user?.data)
  const navigate=useNavigate();
  const handleButtonClick=()=>{
    if(user){
      navigate("/course");
    }
    else{
      navigate("/signin");
    }
  }
  return (
    <main >
      <Navbar/>
        <div className="w-[100vw] h-[100vh] bg-white">
          <div className='flex flex-row justify-evenly items-center md:-mt-8'>
            <div className='flex flex-col md:gap-20 -mt-15'>
            <div className='flex flex-col gap-2'>
            <h1 className='font-bold text-5xl'>Efficient Pathsala</h1>
            <h1 className='font-bold text-5xl'>provides efficiency</h1>
            <h1 className='font-bold text-5xl'>in learning</h1>
            </div>
            <div className='flex flex-col gap-2' >
            <h2 className='font-medium font-mono text-3xl'>Don't think twice and</h2>
            <h2 className='font-medium font-mono text-3xl'>start learning</h2>
            </div>
            <Button onClick={handleButtonClick} className="bg-green-600 text-white md:absolute bottom-10 px-10 py-5 animate-bounce hover:bg-blue-700 transition-all duration-3000 ease-in-out">Start</Button>
            </div>
            <div>
            <img src="images/homebg.png" alt="home background" className='md:w-[700px] md:h-[550px] -mt-10'/>
            </div>
          </div>
        </div>
    </main>
  )
}
