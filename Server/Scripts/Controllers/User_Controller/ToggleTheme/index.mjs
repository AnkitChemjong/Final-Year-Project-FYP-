import User from "../../../Model/User_Model/index.mjs";

const toggleTheme = async (req, res) => {
    try {
        const { id } = req.params;
        
      
        const userData = await User.findById(id);
        if (!userData) {
            return res.status(404).json({ message: "User not found.", error: null });
        }
        const currentTheme = userData?.theme; 
        const newThemeValue = !currentTheme;

        await User.findByIdAndUpdate(
            id,
            { $set: { theme: newThemeValue } },
            { new: true,runValidators:true } 
        );

        return res.status(200).json({
            message: "Theme Changed successfully.",
            theme: newThemeValue,
            error: null
        });
    } catch (error) {
        console.error("Theme toggle error:", error);
        return res.status(500).json({
            message: "Error changing theme",
            error: error.message
        });
    }
}

export default toggleTheme;