import CourseModel from "../../../Model/Course_Model/index.mjs";
import User from "../../../Model/User_Model/index.mjs";

const getSearchedCourse = async (req, res) => {
    try {
        const { searchTerm } = req.body;
        if (!searchTerm) {
            return res.status(400).json({ message: "searchTerm is required." });
        }

        const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
        const regex = new RegExp(sanitizedSearchTerm, "i"); // Case-insensitive search

        // Find courses by title, category, level, OR creator's userName
        const allCourses = await CourseModel.find({
            $or: [
                { title: regex },
                { category: regex },
                { level: regex },
                { creator: { $in: await getMatchingUsers(regex) } } 
            ]
        })
            .sort({ createdAt: -1 })
            .populate("creator")
            .populate("students.studentId");
            console.log(allCourses);

        return res.status(200).json({
            message: "Course details fetched successfully after search.",
            data: allCourses,
            error: null
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching course details.", error: error?.message });
    }
};

// Helper function to get user IDs that match the userName search
const getMatchingUsers = async (regex) => {
    const users = await User.find({ userName: regex }).select("_id");
    return users.map(user => user._id);
};

export default getSearchedCourse;
