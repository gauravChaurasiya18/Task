import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  deadline: { type: Date }, // ✅ added deadline field
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model("Task", TaskSchema);
export default Task;
