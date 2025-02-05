import uploadToCloudinary from "../utils/cloudinaryUpload.js";
import {
  createNote as addNote,
  getNoteById,
  getNotes as getAllNotes,
  deleteNote as deleteNoteById,
  updateNoteById as updateNote,
  toggleFavorite,
  searchNotes as findNotes,
} from "../services/noteService.js";

export const createNote = async (req, res) => {
  try {
    const { title, description } = req.body;
    const images = req.files?.images;  
    console.log("images : ", images);
    console.log("title", title, description);

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: "Please fill all the fields",
      });
    }

    const userId = req.user._id;

    let result = [];
    if (images) {
      if (Array.isArray(images)) {
        if (images.length > 5) {
          return res.status(400).json({
            success: false,
            error: "You can upload a maximum of 5 images",
          });
        }

        for (const image of images) {
          const uploadedMedia = await uploadToCloudinary(image);
          if (uploadedMedia.secure_url) {
            result.push(uploadedMedia.secure_url);
          }
        }
      } else {
        const uploadedMedia = await uploadToCloudinary(images);
        if (uploadedMedia.secure_url) {
          result.push(uploadedMedia.secure_url);
        }
      }
    }

    const note = await addNote(userId, { title, description, images: result });
    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};


export const getNotes = async (req, res) => {
  try {
    const userId = req.user._id;
    const notes = await getAllNotes(userId);

    return res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const note = await getNoteById(id, userId);
    return res.status(200).json({ success: true, note });
  } catch (error) {
    console.error(error);
    return res
      .status(error.message.includes("Invalid note ID") ? 400 : 404)
      .json({ success: false, error: error.message });
  }
};

export const updateNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageToKeep = [] } = req.body;
    const userId = req.user._id;

    const note = await getNoteById(id, userId);

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;

    const existingImages = note.images || [];

    const newImages = req.files?.images
      ? Array.isArray(req.files.images)
        ? req.files.images
        : [req.files.images]
      : [];

    const imagesToKeepArray = Array.isArray(imageToKeep)
      ? imageToKeep.filter((img) => existingImages.includes(img))
      : existingImages.includes(imageToKeep)
      ? [imageToKeep]
      : [];

    if (newImages.length + imagesToKeepArray.length > 5) {
      return res.status(400).json({
        success: false,
        error: "You can upload a maximum of 5 images",
      });
    }

    const newImageUrls = await Promise.all(
      newImages.map(async (image) => {
        const uploadedMedia = await uploadToCloudinary(image);
        return uploadedMedia.secure_url;
      })
    );

    updateData.images = [...imagesToKeepArray, ...newImageUrls];

    const updatedNote = await updateNote(id, userId, updateData);

    return res.status(200).json({
      success: true,
      message: "Note updated successfully",
      updatedNote,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(error.message.includes("Invalid note ID") ? 400 : 404)
      .json({ success: false, error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user._id;
    await deleteNoteById(id, userId);
    return res
      .status(200)
      .json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(error.message.includes("Invalid note ID") ? 400 : 404)
      .json({ success: false, error: error.message });
  }
};

export const favoriteNote = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user._id;
    const note = await toggleFavorite(id, userId);
    return res
      .status(200)
      .json({ success: true, message: "Note favorited successfully", note });
  } catch (error) {
    console.error(error);
    return res
      .status(error.message.includes("Invalid note ID") ? 400 : 404)
      .json({ success: false, error: error.message });
  }
};

export const searchNotes = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.user._id;

    if (!query) {
      return res
        .status(400)
        .json({ success: false, error: "Please provide a search query" });
    }

    const notes = await findNotes(userId, query);
    if(notes.length === 0){ 
      return res.status(200).json({ success: true, message: "No notes found" });
    }

    return res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: error.message });
  }
};
