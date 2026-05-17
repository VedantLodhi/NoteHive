require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
  const url = cloudinary.url('notehive_uploads/x4wynqxcuazqwusa85e7.pdf', {
    sign_url: true,
    resource_type: "image"
  });
  
  console.log(url);
  
  const fetch = require('node-fetch');
  const response = await fetch(url);
  console.log(response.status);
}

run().catch(console.error);
