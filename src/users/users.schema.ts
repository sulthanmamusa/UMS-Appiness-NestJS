
import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
  roles: Array,
  token: String,
  url: String,
  gender: String,
  comments: String,
  adhaar: Number
});
