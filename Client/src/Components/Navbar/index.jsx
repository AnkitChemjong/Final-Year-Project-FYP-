import React from 'react';
import { Link,useLocation } from 'react-router-dom';
import { useSelector,useDispatch} from 'react-redux';




export default function Navbar() {
 
    const location=useLocation();
    const pagePath=location?.pathname?.split("/").pop();
    const homePath=location?.pathname?.split(" ").pop();
    const logedUser=useSelector((state)=>state?.user?.data);
    const NavItem=
[ 
{
 name:"Home",
 path:"/",
 show:true
},
{
    name:"Register",
    path:"signup",
    show:!logedUser
},
{
    name:"Login",
    path:"signin",
    show:!logedUser
},
]
 
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
        {logedUser && (logedUser?.userImage? null:(
          <div className=' bg-slate-400 flex justify-center items-center px-5 py-3 rounded-full'>
            <p>{logedUser?.userName?.split("")[0].toUpperCase()}</p>
          </div>
        ))}
      </div>
    </nav>
  )
}
