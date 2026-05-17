const fs = require("fs");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadNote = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    let extractedText = "";

    // PDF
    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(req.file.path);
      const data = await pdfParse(dataBuffer);
      extractedText = data.text;
    }

    // DOCX
    if (req.file.mimetype.includes("document")) {
      const result = await mammoth.extractRawText({
        path: req.file.path,
      });

      extractedText = result.value;
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    return res.json({
      success: true,
      fileName: req.file.originalname,
      fileUrl: fileUrl,

      characters:
        extractedText?.length || 0,

      preview:
        extractedText?.slice(0, 500) || "",

      fullText:
        extractedText || "",
    });

  } catch (error) {

    console.log(
      "UPLOAD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Upload failed"
    });
  }
};

module.exports = {
  uploadNote
};