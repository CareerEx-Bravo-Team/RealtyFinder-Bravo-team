import Activity from "../models/activity";



// Function to log user activity
export const logActivity = async (userId: string, action: string, status: string) => {
    try {
        await Activity.create({
            user: userId,
            action,
            status,
        });
    } catch (error) {
        console.error("❌ Error logging activity:", error);
    }
};
        