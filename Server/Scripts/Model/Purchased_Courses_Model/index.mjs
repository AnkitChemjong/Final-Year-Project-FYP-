import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const purchasedCoursesSchema = new Schema({
  userId: {
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
  },
  courses: [
    {
      courseId: String,
      title: String,
      instructorId: String,
      instructorName: String,
      dateOfPurchase: Date,
      courseImage: String,
    },
  ],
});

const PurchasedCoursesModel =models?.PurchasedCoursesModel || model("PurchasedCoursesModel", purchasedCoursesSchema);
export default PurchasedCoursesModel;