import mongoose, { Schema, Document } from "mongoose";

import {NotificationType } from "./notificationType.enum.ts";

export interface INotification extends Document {
    id: string;
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
}

const NotificationSchema = new Schema<INotification>({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
});

const Notification = mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;