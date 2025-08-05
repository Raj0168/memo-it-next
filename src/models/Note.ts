// models/Note.ts
import { Schema, model, models } from "mongoose";

const NoteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    heading: { type: String, required: true },
    content: { type: Schema.Types.Mixed, required: true },
    timer: { type: Date },
    folder: { type: Schema.Types.ObjectId, ref: "Folder", default: null },
  },
  { timestamps: true }
);

const Note = models.Note || model("Note", NoteSchema);
export default Note;
