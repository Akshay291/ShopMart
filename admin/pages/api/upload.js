import cloudinary from 'cloudinary';
import multiparty from 'multiparty';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export default async function handle(req, res) {
  try {
    const form = new multiparty.Form();
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return res.status(400).json({ error: "Failed to parse form data" });
      }

      if (!files || !files.file || files.file.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const links = [];
      for (const file of files.file) {
        try {
          const result = await cloudinary.uploader.upload(file.path);
          links.push(result.secure_url);
          fs.unlinkSync(file.path); // Delete the temporary file after upload
        } catch (uploadError) {
          console.error("Error uploading file to Cloudinary:", uploadError);
          return res.status(500).json({ error: "Failed to upload file to Cloudinary", detail: uploadError.message });
        }
      }
      return res.json({ links });
    });
  } catch (error) {
    console.error("Error handling upload request:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export const config = {
  api: { bodyParser: false },
};
