import mongoose from "mongoose";
let userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    confirmPassword: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    resetToken: { type: Number, required: true },
  },
  { timestamps: true }
);

let userModel = mongoose.model("users", userSchema);
export default userModel;
