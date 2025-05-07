import mongoose, { Schema, Document } from "mongoose";

export interface ILogDownload extends Document {
    userId: string;
    date: number;
    componentName: string;
}

const logDownloadSchema = new Schema<ILogDownload>({
    userId: { type: String, required: true },
    date: { type: Number, required: true },
    componentName: { type: String, required: true },
});

const LogDownload = mongoose.model<ILogDownload>("logDownload", logDownloadSchema);

export default LogDownload;