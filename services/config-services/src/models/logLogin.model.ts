import mongoose, { Schema, Document } from "mongoose";

export interface ILogLogin extends Document {
    uuid: string;
    date: number;
    name: string;
    type: string;
}

const logLoginSchema = new Schema<ILogLogin>({
    uuid: { type: String, required: true },
    date: { type: Number, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true }
});

const LogLogin = mongoose.model<ILogLogin>("logLogin", logLoginSchema);

export default LogLogin;