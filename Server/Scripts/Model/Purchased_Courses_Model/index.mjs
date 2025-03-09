import {Schema,model} from 'mongoose';

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

const PurchasedCoursesModel = model("PurchasedCoursesModel", purchasedCoursesSchema);
export default PurchasedCoursesModel;