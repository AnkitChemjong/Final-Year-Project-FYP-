import multer from 'multer';
import path from 'path';
import fs from 'fs';


const checkPDF = (req, file, cb) => {
    const allowedFileTypes = [
        'application/pdf', // PDFs
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', // Images
        'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo' // Videos
    ];
    
    
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDFs, images, and videos are allowed!'), false);
    }
};


const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        const user=req.user;
        const filePathFolder=`./Scripts/Upload/${user?.userId}/CourseFile`;
        if(!fs.existsSync(filePathFolder)){
            fs.mkdirSync(filePathFolder, { recursive: true });
        }
      const dest=path.resolve(filePathFolder);
       return cb(null,dest);
    },
    filename:(req,file,cb)=>{
        const name=`${Date.now()}-${file.originalname}`;
        return cb(null,name);
    }
});

const uploadCourse=multer({storage:storage,limits:{
    fieldSize:1*1024*1024*1024
},fileFilter:checkPDF});

export default uploadCourse;