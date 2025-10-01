import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String,
    default: false
  },
  emailTokenExpires:  {
    type: Date,
    default: new Date().getDate()
  },
});

const UserModel = mongoose.models?.User || mongoose.model('User', userSchema);

export default UserModel;
