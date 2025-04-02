import User from "../../Model/User_Model/index.mjs";
import { io, sendPushNotification, userSocketMap } from "../../Services/UserService/Socket/index.mjs";
import NotificationModel from "../../Model/Notification_Model/index.mjs";

const checkSubscription = async (req, res, next) => {
    try {
        const teachers = await User.find({
            'userRole': 'teacher',
            'subscription.subscriptionStatus': { $ne: 'expired' }
        });

        const now = Date.now();
        const today = new Date().toISOString().split('T')[0]; // For daily check

        for (const teacher of teachers) {
            const endDate = new Date(teacher?.subscription?.subscriptionEndDate).getTime();
            const daysLeft = Math.floor((endDate - now) / (1000 * 60 * 60 * 24));

            // Handle expired subscriptions
            if (endDate <= now) {
                // Only update if not already expired
                if (teacher.subscription.subscriptionStatus !== 'expired') {
                    await User.findByIdAndUpdate(
                        teacher._id,
                        { 
                            'subscription.subscriptionStatus': 'expired',
                            'lastSubscriptionNotification': today
                        },
                        { runValidators: true, new: true }
                    );

                    const notificationMessage = {
                        userId: teacher._id,
                        title: "Subscription Expired",
                        message: "Your subscription has expired. Please renew to continue teaching.",
                        type: "subscription"
                    };
                    
                    await sendNotification(teacher._id, notificationMessage);
                }
                continue;
            }

            // Handle 10-day warning (only send once per day)
            if (daysLeft === 10 && teacher.lastSubscriptionNotification !== today) {
                await User.findByIdAndUpdate(
                    teacher._id,
                    { lastSubscriptionNotification: today },
                    { runValidators: true }
                );

                const notificationMessage = {
                    userId: teacher._id,
                    title: "Subscription Expiring Soon",
                    message: "Your subscription will expire in 10 days. Please renew it.",
                    type: "subscription",
                    subscriptionType: teacher.subscription.subscriptionType
                };

                await sendNotification(teacher._id, notificationMessage);
            }
        }
    } catch (error) {
        console.error('Subscription check failed:', error);
    }
    return next();
};

// Helper function to send notifications
async function sendNotification(userId, notificationMessage) {
    try {
        const notification = await NotificationModel.create(notificationMessage);
        
        if (io) {
            const userSocketId = userSocketMap.get(userId.toString());
            if (userSocketId) {
                io.to(userSocketId).emit("notification", notification);
            } else {
                await sendPushNotification(userId, notification);
            }
        }
    } catch (error) {
        console.error('Notification sending failed:', error);
    }
}

export default checkSubscription;