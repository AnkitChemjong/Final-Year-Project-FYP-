import User from "../../Model/User_Model/index.mjs";

const checkSubscription =async (req, res, next) => {
    const user = req.user;
    if (!user) return next();
    if (user?.userRole?.includes('teacher') && user?.subscription) {
        const now = Date.now();
        const endDate = new Date(user.subscription.subscriptionEndDate).getTime();
        
        if (endDate <= now) {
            try {
                await User.findByIdAndUpdate(
                    user._id,
                    { 'subscription.subscriptionStatus': 'expired' }, 
                    { runValidators: true, new: true }
                );
                return next();
            } catch (error) {
                console.error('Subscription status update failed:', error);
                return next();
                
            }
        }
        return next();
    }
    return next();
};
export default checkSubscription;