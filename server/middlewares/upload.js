const multer = require("multer");

const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"uploads/");
  },

  filename:(req,file,cb)=>{
    cb(null,Date.now()+"-"+file.originalname);
  }
});

const upload = multer({
 storage,
 limits:{
   fileSize:10*1024*1024
 },
 fileFilter:(req,file,cb)=>{
   const allowed=[
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
   ];

   if(allowed.includes(file.mimetype)){
      cb(null,true);
   }else{
      cb(new Error("Only PDF/DOCX allowed"));
   }
 }
});

module.exports=upload;