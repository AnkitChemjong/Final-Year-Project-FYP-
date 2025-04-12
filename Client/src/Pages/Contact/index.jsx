import React,{useContext, useRef, useState} from 'react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { 
    FaFacebook,
    FaInstagram,
  } from 'react-icons/fa';
  import { TfiGithub } from "react-icons/tfi";
  import LottieAnimation from '@/Components/LottieAnimation';
  import contact from '@/assets/contact.json';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';
import { Button } from '@/Components/ui/button';
import { UseContextApi } from '@/Components/ContextApi';
import { FiLoader } from "react-icons/fi";


export default function Contact() {
    const formData=useRef();
    const [data,setData]=useState({
     userName:"",
     email:"",
     subject:"",
       message:"",
       websiteName:"Efficient_Pathsala"
    });
    const {loadingSpin,setLoadingSpin}=useContext(UseContextApi);

    const onChangeHandler=(e)=>{
      const {name,value,files}=e.target;
      setData((prev)=>({...prev,[name]:files? files[0]:value}));
    };
  const handleSubmit = async(e) => {
    try{
        setLoadingSpin(true);
        e.preventDefault();
        emailjs.sendForm(
            import.meta.env.VITE_EMAILJS_SERVICEID, 
            import.meta.env.VITE_EMAILJS_TEMPLATEID, 
            formData.current,
            import.meta.env.VITE_EMAILJS_PUBLICKEY 
          )
          .then((result) => {
            //console.log(result);
            formData.current.reset();
            setData({
                userName:"",
                email:"",
                subject:"",
                message:"",
                websiteName:"Efficient_Pathsala"
            })
            setLoadingSpin(false);
            toast.success("Message send successfully.");
          }).catch(error=>console.log(error))
    }
    catch(error){
        console.log(error);
        toast.error('error on sending email message.');
        setLoadingSpin(false);
    }
  };
  const handleButtonDisabled = () => {
    return Object.values(data).some(value => !value.trim());
  };


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 -mt-14">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className='flex gap-6 items-center justify-center'>
            <h1 className="text-4xl font-bold text-black mb-4 font-heading">Contact Us</h1>
            <LottieAnimation animationData={contact} width={200} height={200} speed={1} />
            </div>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Have questions or want to get in touch? We'd love to hear from you! 💬
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-black mb-6">Send us a message 📧</h2>
                
                <form ref={formData} className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      To
                    </label>
                    <input
                      type="text"
                      id="websiteName"
                      name="websiteName"
                      value={data['websiteName']}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Efficient Pathsala"
                      
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="userName"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="John Doe"
                        onChange={onChangeHandler}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="john@example.com"
                        onChange={onChangeHandler}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="How can we help?"
                      onChange={onChangeHandler}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="4"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Type your message here..."
                      onChange={onChangeHandler}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={handleButtonDisabled()|| loadingSpin}
                    className="w-full cursor-pointer bg-green-600 hover:scale-105 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300 flex items-center justify-center shadow-md hover:shadow-lg"
                  >
                    {loadingSpin && <FiLoader className='w-6 h-6 animate-spin'/>} Send Message
                  </Button>
                </form>
              </div>
              
            
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-black mb-6">Contact Information 📱</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-3 rounded-full mr-4 text-blue-600 text-xl">
                    📧
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-black">Email Us</h3>
                      <p className="text-gray-700">info@dharanbusiness.com</p>
                      <p className="text-gray-700">support@dharanbusiness.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-100 p-3 rounded-full mr-4 text-green-600 text-xl">
                      📞
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-black">Call Us</h3>
                      <p className="text-gray-700">+977 98XXXXXXXX</p>
                      <p className="text-gray-700">+977 25-XXXXXX</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-yellow-100 p-3 rounded-full mr-4 text-yellow-600 text-xl">
                      ⏰
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-black">Opening Hours</h3>
                      <p className="text-gray-700">Sunday-Friday: 10AM - 6PM</p>
                      <p className="text-gray-700">Saturday: Closed</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-red-100 p-3 rounded-full mr-4 text-red-600 text-xl">
                    🏠
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-black">Visit Us</h3>
                      <p className="text-gray-700">Dharan Bus Park</p>
                      <p className="text-gray-700">Dharan-8, Sunsari, Nepal</p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-lg font-medium text-black mb-3 ">Follow Us</h3>
                    <div className="flex space-x-4">
                    <a href="#" className="bg-blue-100 p-3 rounded-full text-blue-600 hover:bg-blue-200 transition">
                        <FaFacebook className="text-xl hover:text-blue-600 hover:scale-105 transition-all ease-out" />
                      </a>
                      <a href="#" className="bg-blue-100 p-3 rounded-full text-blue-600 hover:bg-blue-200 transition">
                        <FaInstagram className="text-xl hover:text-red-600 hover:scale-105 transition-all ease-out" />
                      </a>
                      <a href="#" className="bg-blue-100 p-3 rounded-full text-blue-600 hover:bg-blue-200 transition">
                      <TfiGithub className='text-xl hover:text-black hover:scale-105 transition-all ease-out'/>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
         
            <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 mx-auto w-full max-w-3xl">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3560.108033397876!2d87.2822644!3d26.811083!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef4199326d3af1%3A0x8022be8de74345a8!2sDharan%20Bus%20Park!5e0!3m2!1sen!2snp!4v1711860565307!5m2!1sen!2snp"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Dharan Bus Park Location"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}