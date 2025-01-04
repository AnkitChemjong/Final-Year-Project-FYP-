import { axiosService } from '@/Services';
import { User_Route } from '@/Routes';


export default async function Logout() {

 try{
    const returnData=await axiosService.delete(User_Route,{withCredentials:true});
    return returnData;
 }
 catch(error){
    return error?.message;
 }
}
