import { Router } from "express";
import multer from "multer";
import { extractDocument } from "../services/extraction.service.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) =>
    cb(
      null,
      file.mimetype === "application/pdf" ||
        file.originalname.toLowerCase().endsWith(".pdf"),
    ),
});

router.post("/extract", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "A PDF file is required." });
    }

    const result = await extractDocument(
      req.file.buffer,
      req.file.originalname,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
