import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;


const paymentSchema=new Schema({
    userId: {
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
  orderStatus: {
    type:String,
    enum:['processing','done'],
    default:'pending'
},
  paymentMethod: {
    type:String,
    enum:["khalti","esewa"]
  },
  paymentStatus: {
    type:String,
    enum:['processing','paid'],
    default:'processing'
  },
  orderDate: {
    type:Date,
    default:Date.now,
    required:true
  },
  transactionId: 
  {
    type:String,
    required:false
  },
  amountPaid:{
    type:String,
    required:true
  },
  paymentFor:{type:String,required:true},
  subscriptionType:{
    type:String,
    required:true,
    enum:['basic','premium','elite']
  },processFor:{
    type:String,
    required:true
  }
},{timestamps:true});
const PaymentSubscription=models?.PaymentSubscription || model("PaymentSubscription",paymentSchema);
export default PaymentSubscription;