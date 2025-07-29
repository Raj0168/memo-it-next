import { Schema, model, models } from "mongoose";

const FolderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const Folder = models.Folder || model("Folder", FolderSchema);
export default Folder;
