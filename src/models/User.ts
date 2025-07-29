import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  password: { type: String, required: true },
  notifications: { type: Boolean, default: true },
});

const User = models.User || model("User", UserSchema);
export default User;
