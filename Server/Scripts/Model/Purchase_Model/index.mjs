import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;


const purchaseSchema=new Schema({
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
  courseId:{
    type:Schema.Types.ObjectId,
        ref:"CourseModel",
        required:true
  },
  siteAmount:{
    type:String,
    required:true
  },
  teacherAmount:{
    type:String,
    required:true
  },
  paymentFor:{
    type:String,
    required:true
  }
},{timestamps:true});
const PurchaseModel=models?.PurchaseModel || model("PurchaseModel",purchaseSchema);
export default PurchaseModel;