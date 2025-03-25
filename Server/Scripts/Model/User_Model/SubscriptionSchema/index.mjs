
const subscriptionSchema={
    subscriptionType:{
        type:String,
        enum: ['Basic', 'Premium', 'Elite'],
    },
    subscriptionStartDate:{
        type:Date
    },
    subscriptionEndDate:{
        type:Date
    },
    subscriptionStatus:{
        type:String,
        enum:['pending','active','expired'],
        default:'pending'
    }
}
export default subscriptionSchema;
