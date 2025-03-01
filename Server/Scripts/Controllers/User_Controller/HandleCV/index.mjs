import User from "../../../Model/User_Model/index.mjs";
import fs from "fs";

class HandleCV {
  static updateCV = async (req, res) => {
    try {
      const user = req.user;
      const newFilePath = `${user?.userId}/BecomeTeacher/${req.file.filename}`;
      const oldFilePath = `Scripts/Upload/${user?.myCV}`;
      fs.unlink(oldFilePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted successfully!");
        }
      });
      await User.findByIdAndUpdate(user._id,{$set:{myCV:newFilePath}});
      return res.status(200).json({
        message: "CV Successfully Updated.",
        error: null,
      });
    } catch (error) {
      return res.json({
        message: "Error on Updating CV.",
        error: error?.message,
      });
    }
  };
};
export default HandleCV;
