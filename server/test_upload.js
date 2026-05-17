require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
  const fs = require('fs');
  fs.writeFileSync('test.pdf', 'dummy pdf content');
  
  const uploadResult = await cloudinary.uploader.upload('test.pdf', {
    resource_type: "raw",
    folder: "notehive_uploads",
    public_id: `${Date.now()}-test.pdf`,
    use_filename: true,
    unique_filename: false
  });
  
  console.log(uploadResult);
}

run().catch(console.error);
