import mongoose, { Schema, Document } from "mongoose";

export interface IImage extends Document {
    imageId: string;
    base64: string;
}

const ImageSchema = new Schema<IImage>({
    imageId: { type: String, required: true, unique: true },
    base64: { type: String, required: true, unique: true },
});

const Image = mongoose.model<IImage>("Image", ImageSchema);

export default Image;