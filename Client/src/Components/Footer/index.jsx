import React from 'react';
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { LuMapPin } from "react-icons/lu";
import { FiPhoneCall } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";
import { TfiGithub } from "react-icons/tfi";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-blue-800 text-white py-10 rounded-lg md:mt-5">
  <div className="container mx-auto flex flex-col md:flex-row justify-between items-start px-6">
    
    <div className="flex flex-col items-start mb-8 md:mb-0">
      <div className="flex items-center gap-3 mb-4">
        <img src="/images/logo.png" alt="Logo" className="h-12 w-12 rounded-full border-2 border-white shadow-lg" />
        <span className="text-2xl font-semibold text-white">Efficient Pathsala</span>
      </div>

      <p className="text-sm text-gray-200 opacity-80 max-w-xs">Empowering learners with innovative tools for efficient and effective learning.</p>
    </div>


    <div className="flex flex-col gap-6 text-gray-200 text-sm mb-8 md:mb-0">
      <h3 className="font-semibold text-xl text-white">Quick Links</h3>
      <a href="/about" className="text-white  transition-all duration-300 hover:underline">About Us</a>
      <a href="/contact" className="text-white transition-all duration-300 hover:underline">Contact Us</a>
      <a href="/privacyPolicy" className="text-white transition-all duration-300 hover:underline">Privacy Policy</a>
    </div>


    <div className="flex flex-col gap-6 text-gray-200 text-sm mb-8 md:mb-0 ">
      <h3 className="font-semibold text-xl text-white">Contact Details</h3>
      <p className="flex items-center gap-2">
        <span className="font-bold">Phone:</span> +977 9800000000 <FiPhoneCall className='w-4 h-4'/>
      </p>
      <p className="flex items-center gap-2">
        <span className="font-bold">Email:</span> efficientpathsala@gmail.com <FcGoogle className='w-4 h-4'/>
      </p>
      <p className="flex items-center gap-2">
        <span className="font-bold">Location:</span> 123 Street, Dhankuta, Nepal <LuMapPin className='w-4 h-4'/>
      </p>
    </div>


    <div className="flex flex-col gap-6 text-gray-200 text-sm mb-8 md:mb-0">
      <h3 className="font-semibold text-xl text-white">Connection Platforms</h3>
      <div className="flex gap-4 justify-center items-center">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-all duration-300">
        <FaFacebook className='w-5 h-5' />
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-all duration-300">
        <TfiGithub className='w-5 h-5'/>
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-all duration-300">
        <FaInstagram className='w-5 h-5'/>
        </a>
      </div>
    </div>

  </div>

  <div className="border-t border-gray-600 mt-6 pt-4 text-center text-sm text-gray-300">
    <p>&copy; 2025 Efficient Pathsala. All rights reserved.</p>
  </div>

</footer>


  )
}
