require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
  const uploadResult = await cloudinary.uploader.upload('valid.pdf', {
    resource_type: "raw",
    type: "authenticated",
    folder: "notehive_uploads",
    public_id: `${Date.now()}-test_auth.pdf`,
  });
  
  console.log('Uploaded public_id:', uploadResult.public_id);
  
  const signedUrl = cloudinary.url(uploadResult.public_id, {
    resource_type: "raw",
    type: "authenticated",
    sign_url: true,
  });
  
  console.log('Signed URL:', signedUrl);
  
  try {
    const res = await fetch(signedUrl);
    console.log('Status:', res.status);
  } catch(e) { console.error(e) }
}

run().catch(console.error);
