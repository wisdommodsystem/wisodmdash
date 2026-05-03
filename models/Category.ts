import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  icon?: string; // Optional icon name from lucide-react
}

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, default: "Tag" },
});

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
