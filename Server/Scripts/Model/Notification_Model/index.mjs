import { Schema,model } from "mongoose";

const notificationSchema = new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['system', 'course', 'message', 'payment', 'admin'],
      default: 'system'
    },
    read: {
      type: Boolean,
      default: false
    },
  }, {
    timestamps: true,
  });

const NotificationModel=model("NotificationModel",notificationSchema);
export default NotificationModel;
  