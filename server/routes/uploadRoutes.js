const express=require("express");
const router=express.Router();

const upload=require("../middlewares/upload");
const {
 uploadNote
}=require("../controllers/uploadController");

router.post(
"/upload-note",
upload.single("file"),
uploadNote
);

module.exports=router;