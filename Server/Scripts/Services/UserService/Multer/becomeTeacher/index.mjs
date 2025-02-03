import multer from 'multer';
import path from 'path';


const checkPDF = (req, file, cb) => {
    const allowedFileType = 'application/pdf';
    
    if (file.mimetype === allowedFileType) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDFs are allowed!'), false);
    }
};


const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
      const dest=path.resolve('./Scripts/Upload/BecomeTeacher/');
       return cb(null,dest);
    },
    filename:(req,file,cb)=>{
        const name=`${Date.now()}-${file.originalname}`;
        return cb(null,name);
    }
});

const uploadCV=multer({storage:storage,limits:{
    fieldSize:20*1024*1024
},fileFilter:checkPDF});

export default uploadCV;