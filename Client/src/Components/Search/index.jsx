import React,{ useState} from 'react';
import { Input } from '../ui/input';
import { FcSearch } from "react-icons/fc";

export default function Search({searchFunc,onChangeFunc}) {
    const [searchTerm,setSearchTerm]=useState("");
    
  return (
    <div className="flex items-center mt-2 md:mt-0 md:px-80 relative md:left-10 px-10">
      <Input onChange={(e)=>{
          setSearchTerm(e.target.value) 
          if(e.target.value.length === 0){
              onChangeFunc();
            }
    }} className="text-center p-2 border-2 md:h-11 rounded-2xl" placeholder="Search..." />
      <FcSearch onClick={()=>searchFunc(searchTerm)} className="w-6 h-6 relative right-9 hover:scale-125 cursor-pointer" />
    </div>
  );
}
