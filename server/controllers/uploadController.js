const fs = require("fs");
const PDFParser = require("pdf2json");
const mammoth = require("mammoth");

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

      extractedText = await new Promise(
        (resolve, reject) => {

          const pdfParser =
            new PDFParser(null,1);

          pdfParser.on(
            "pdfParser_dataError",
            err => reject(err)
          );

          pdfParser.on(
            "pdfParser_dataReady",
            () => {

              const text =
                pdfParser.getRawTextContent();

              resolve(text);
            }
          );

          pdfParser.loadPDF(
            req.file.path
          );
        }
      );
    }

    // DOCX
    if (
      req.file.mimetype.includes(
        "document"
      )
    ) {

      const result =
        await mammoth.extractRawText({
          path:req.file.path
        });

      extractedText =
        result.value;
    }

    // cleanup temp file
    if(fs.existsSync(req.file.path)){
      fs.unlinkSync(req.file.path);
    }

    return res.json({
      success:true,
      fileName:
      req.file.originalname,

      characters:
      extractedText.length,

      preview:
      extractedText.slice(0,500),

      fullText:
      extractedText
    });

  } catch(error){

    console.log(
      "UPLOAD ERROR:",
      error
    );

    return res.status(500).json({
      success:false,
      message:"Upload failed"
    });
  }
};

module.exports = {
 uploadNote
};