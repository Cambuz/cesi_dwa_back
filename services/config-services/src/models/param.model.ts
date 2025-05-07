import mongoose, { Schema, Document } from "mongoose";

export interface IParam extends Document {
    param: string;
    value: number;
}

const ParamSchema = new Schema<IParam>({
    param: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
});

const Param = mongoose.model<IParam>("Param", ParamSchema);

export default Param;