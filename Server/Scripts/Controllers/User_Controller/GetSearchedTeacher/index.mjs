import User from "../../../Model/User_Model/index.mjs";

const getSearchedTeacher = async (req, res) => {
    try {
        const { searchTerm } = req.body;
        if (!searchTerm) {
            return res.status(400).json({ message: "searchTerm is required." });
        }

        const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape special characters
        const regex = new RegExp(sanitizedSearchTerm, "i"); // Case-insensitive search

        
        const allTeachers = await User.find({
            $and: [
                { userRole: { $in: ["teacher"] } }, 
                {
                    $or: [
                        { userName: regex }, 
                        { email: regex },
                        {address: regex},
                    ]
                }
            ]
        }).sort({ createdAt: -1 });
            //console.log(allTeachers);
        if(allTeachers){
            return res.status(200).json({
                message: "Teachers fetched successfully after search.",
                data: allTeachers,
                error: null
            });
        }
        return res.status(200).json({
            message:"Teacher not found",
            data:null
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching Teacher.", error: error?.message });
    }
};
export default getSearchedTeacher;