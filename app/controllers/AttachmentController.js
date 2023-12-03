import { models } from "../models/index.js";
import * as MediaService from "../services/MediaService.js";

// Multer configuration

const { Attachment } = models;

export const index = async (req, res) => {
  const attachments = await Attachment.findAll();

  return res.send(attachments);
};

export const show = async (req, res) => {
  const { slug } = req.params;
  const attachment = await Attachment.findByPk(slug);

  if (!attachment) {
    return res.status(404).json({ message: constants.NOT_FOUND });
  }

  res.send(attachment);
};

export const store = async (req, res) => {
  try {
    const attachments = req.files;
    let result = [];

    for (const attachment of attachments) {
      const attachmentUploaded = await MediaService.uploadMedia(attachment.path);
      const attachmentThumb = await MediaService.generateMediaThumb(
        attachmentUploaded
      );
      const attachmentSaved = await Attachment.create({
        url: attachmentUploaded.url,
        // Add other fields as needed
      });

      result.push({
        thumbnail: attachmentThumb,
        original: attachmentUploaded.url,
        id: attachmentSaved.id,
      });
    }

    res.send(result);
  } catch (error) {
    // Handle errors that might occur during file upload or database saving
    console.error("Error:", error);
    res
      .status(500)
      .json({ message: "Error uploading files", error: error.message });
  }
};

export const destroy = async (req, res) => {
  const { slug } = req.params;

  await Attachment.destroy({ where: { id: slug } });

  res.send(true);
};
