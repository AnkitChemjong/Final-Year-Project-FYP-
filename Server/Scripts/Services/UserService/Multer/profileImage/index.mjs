import multer from 'multer';
import path from 'path';
import fs from 'fs';


const checkImage=(req,file,cb)=>{
    const types=/png|jpg|jpeg/
    //we can do the if(types.test(file.mimetype)) also
    const allowedImageTypes=['image/png', 'image/jpg', 'image/jpeg'];
    if(allowedImageTypes.includes(file.mimetype)){
        cb(null,true);
    }
    else{
        cb(new Error('Invalid file type'),false);
    }
};

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
       const user=req.user;
              const filePathFolder=`./Scripts/Upload/${user?.userId}/UserImage`;
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

const upload=multer({storage:storage,limits:{
    fieldSize:20*1024*1024
},fileFilter:checkImage});

export default upload;