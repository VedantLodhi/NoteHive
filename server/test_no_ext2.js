require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
  fs.copyFileSync('valid.pdf', 'valid_file_no_ext'); // NO EXTENSION
  
  const uploadResult = await cloudinary.uploader.upload('valid_file_no_ext', {
    resource_type: "raw",
    folder: "notehive_uploads",
    public_id: `${Date.now()}-test_no_ext2`,
  });
  
  console.log(uploadResult.secure_url);
  try {
    const res = await fetch(uploadResult.secure_url);
    console.log(res.status);
  } catch(e) { console.error(e) }
}

run().catch(console.error);
