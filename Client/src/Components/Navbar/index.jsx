import React from 'react';
import { NavItem } from '@/Utils';
import { Link,useLocation } from 'react-router-dom';


export default function Navbar() {
    const location=useLocation();
    const pagePath=location?.pathname?.split("/").pop();
    const homePath=location?.pathname?.split(" ").pop();
    
    
  return (
    <nav className='flex flex-row flex-wrap justify-between items-center px-4 -mt-5'>
      <div className='flex flex-row justify-center items-center gap-5'>
        <div>
         <img src="images/logo.png" alt="logo if efficient pathsalsa"  className='md:w-[160px] md:h-[160px]'/>
        </div>
        <h1 className='font-bold text-3xl'>Efficient Pathsala</h1>
      </div>
      <div className='flex flex-row justify-center items-center gap-20' >
        {
            NavItem.map((item,index)=>{
                return item.show? (
                     <Link key={index} to={item?.path} className={`text-[18px] relative after:absolute after:-bottom-1 after:left-0 after:h-[4px] after:bg-black hover:text-blue-600 ${
                        pagePath === item?.path || homePath === item?.path
                          ? ' after:w-full'
                          : 'after:w-0 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full hover:text-blue-600'
                      }`}>{item?.name}</Link>
                ) :null
            })
        }

      </div>
    </nav>
  )
}