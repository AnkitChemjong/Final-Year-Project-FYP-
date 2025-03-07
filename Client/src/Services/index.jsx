import axios from 'axios';

export const axiosService=axios.create({
    baseURL:import.meta.env.VITE_BACKEND_URL,
      withCredentials:true,
      headers: { "Content-Type": "application/json"},

});

export const handleDwn=async (type,url)=>{
     const response = await axiosService.get(`${import.meta.env.VITE_BACKEND_URL}/${url}`, { responseType: "blob",
            //   onDownloadProgress:progressEvent=>{
            //     const {loaded,total}=progressEvent;
            //     const percentCompleted=Math.round((loaded*100)/total);
            //     setFileDownloadProgress(percentCompleted);
            //   }
             });
                const urlBlob = window.URL.createObjectURL(new Blob([response.data],{ type: "application/pdf" }));
                const link = document.createElement("a");
                link.href = urlBlob;
                if(type==="view"){
                  link.setAttribute("target","_blank");
                }
                if(type==="download"){
                  link.setAttribute("download", url.split("/").pop()); 
                }
                document.body.appendChild(link);
                link.click();
                link.remove();
                // document.removeChild(link);
                window.URL.revokeObjectURL(urlBlob);
}