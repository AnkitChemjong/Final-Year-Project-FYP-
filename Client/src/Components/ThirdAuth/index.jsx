import { User_GoogleAuth_Route } from "@/Routes";
import { User_GitAuth_Route } from "@/Routes";
import { User_FBAuth_Route } from "@/Routes";


const Backend_Url=import.meta.env.VITE_BACKEND_URL;



export const handleGoogle=()=>{
    window.location.href=`${Backend_Url}${User_GoogleAuth_Route}`
}
export const handleGithub=()=>{
    window.location.href=`${Backend_Url}${User_GitAuth_Route}`
}
export const handleFacebook=()=>{
    window.location.href=`${Backend_Url}${User_FBAuth_Route}`
}