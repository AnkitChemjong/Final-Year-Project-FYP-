import { axiosService } from '@/Services';
import { User_Route } from '@/Routes';


export default async function Logout() {

 try{
    const returnData=await axiosService.delete(User_Route,{withCredentials:true});
    if(returnData){
      localStorage.removeItem('user');
      localStorage.removeItem('filters');
       return returnData;
    }
 }
 catch(error){
    return error?.message;
 }
}
