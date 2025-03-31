import User from "../../Model/User_Model/index.mjs";
import { io,userSocketMap } from "../../Services/UserService/Socket/index.mjs";
import NotificationModel from "../../Model/Notification_Model/index.mjs";

const checkSubscription =async (req, res, next) => {
    const user = req.user;
    if (!user) return next();
    if (user?.userRole?.includes('teacher') && user?.subscription) {
        const now = Date.now();
        const endDate = new Date(user?.subscription?.subscriptionEndDate).getTime();
        const daysLeft = Math.floor((endDate - now) / (1000 * 60 * 60 * 24));
        
        if (endDate <= now) {
            try {
                await User.findByIdAndUpdate(
                    user._id,
                    { 'subscription.subscriptionStatus': 'expired' }, 
                    { runValidators: true, new: true }
                );
                const notificationMessage = {
                    userId: user?._id,
                    title: "Subscription Expired.",
                    message: "Your subscription expired. Take a new one.",
                    type: "subscription",
                };
                const notification=await NotificationModel.create(notificationMessage);

                if (io) {
                    const userSocketId = userSocketMap.get(user._id.toString());
                    if (userSocketId) {
                        io.to(userSocketId).emit("notification", notification);
                    }
                }
                return next();
            } catch (error) {
                console.error('Subscription status update failed:', error);
                return next();
                
            }
        }
        if (daysLeft === 10) {
            try {
                const notificationMessage = {
                    userId: user?._id,
                    title: "Subscription Expiring Soon",
                    message: "Your subscription will expire in 10 days. Please renew it to continue using our services.",
                    type: "subscription",
                    subscriptionType:user?.subscription?.subscriptionType
                };
                const notification=await NotificationModel.create(notificationMessage);

                if (io) {
                    const userSocketId = userSocketMap.get(user._id.toString());
                    if (userSocketId) {
                        io.to(userSocketId).emit("notification", notification);
                    }
                }
            } catch (error) {
                console.error("Failed to send subscription warning notification:", error);
            }
        }
        return next();
    }
    return next();
};
export default checkSubscription;