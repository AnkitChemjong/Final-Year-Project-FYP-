import React,{useContext,useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { UseContextApi } from '@/Components/ContextApi';
import SkeletonCard from '@/Components/SkeletonCard';
import { Get_Teacher_Detail } from '@/Routes';
import { axiosService } from '@/Services';

export default function TeacherDetails() {
    const {specificTeacherDetailsId,setSpecificTeacherDetailsId,
        specificTeacherDetails,setSpecificTeacherDetails}=useContext(UseContextApi);
    const {id}=useParams();
    const navigate=useNavigate();
    
        useEffect(()=>{
            const getTeacherDetail=async ()=>{
                if(id){
                    const response=await axiosService.get(`${Get_Teacher_Detail}/${id}`);
                    //console.log(response);
                    if(response.status===200){
                        setSpecificTeacherDetails(response?.data?.data);
                }
            }
            }
            if(specificTeacherDetailsId){
                getTeacherDetail();
            }
        },[specificTeacherDetailsId]);


    useEffect(()=>{
      if(!id){
        navigate(-1);
      }
      else{
        setSpecificTeacherDetailsId(id)
      }
    },[id]);

  if(!specificTeacherDetails) return <SkeletonCard/>
  return (
    <div className='w-full h-screen flex justify-center items-center'>
       userName: {specificTeacherDetails?.userName}
    </div>
  )
}
