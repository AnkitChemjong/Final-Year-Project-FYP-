import React, { useContext } from 'react';
import { Button } from '../ui/button';
import { UseContextApi } from '../ContextApi';
import { FiLoader } from "react-icons/fi";


export default function CommonButton({func = () => {},text,disable=false}) {
  const {loadingSpin,setLoadingSpin}=useContext(UseContextApi);
  return (
    <Button disabled={disable} onClick={func} className="bg-green-600 text-white px-5 py-5 hover:bg-blue-700 hover:scale-105 transform transition-transform duration-300 ease-in-out shadow-md">{loadingSpin && <FiLoader className='w-6 h-6 animate-spin'/>}{text}</Button>
  )
}
