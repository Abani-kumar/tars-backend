import mongoose from "mongoose";
import Note from "../models/notes.js";

export const createNote = async (
  userId,
  { title, description, images = [] }
) => {
  if (!title || !description) {
    throw new Error("Please fill all the fields");
  }

  const note = new Note({
    user: userId,
    title,
    content: description,
    images,
  });

  await note.save();
  return note;
};

export const getNotes = async (userId) => {
  const notes = await Note.find({ user: userId }).lean();
  return notes;
};

export const getNoteById = async (id, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid note ID");
  }

  const note = await Note.findOne({ _id: id, user: userId }).lean();
  if (!note) {
    throw new Error("Note not found");
  }

  return note;
};

export const updateNoteById = async (id, userId, updateData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid note ID");
  }

  const note = await Note.findOneAndUpdate(
    { _id: id, user: userId },
    updateData,
    { new: true, runValidators: true }
  );
  if (!note) {
    throw new Error("Note not found");
  }

  return note;
};

export const deleteNote = async (id, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid note ID");
  }

  const note = await Note.findOneAndDelete({ _id: id, user: userId });
  if (!note) {
    throw new Error("Note not found");
  }

  return "Note deleted successfully";
};

export const toggleFavorite = async (id, userId) => {
  const note = await Note.findOne({ _id: id, user: userId });
  if (!note) {
    throw new Error("Note not found");
  }

  note.favorite = !note.favorite;
  await note.save();

  return note;
};

export const searchNotes = async (userId, query) => {
  const note = await Note.find();
  const pipeline = [
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $match: {
        title: {
          $regex: query,
          $options: "i",
        },
      },
    },
    {
      $sort: {
        updatedAt: -1,
      },
    },
  ];
  const notes = await Note.aggregate(pipeline);

  return notes;
};
