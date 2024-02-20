import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: { type: Boolean, default: false },
    voted: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);
export default User;
