import { clerkClient } from '@clerk/express';

export const protectAdmin = async (req, res, next) => {
    try {
        const { userId } = req.auth(); // توجه: req.auth() به عنوان فانکشن
        const user = await clerkClient.users.getUser(userId);

        if (!user.privateMetadata.role || user.privateMetadata.role !== 'admin') {
            return res.status(403).json({ success: false, message: "not allowed" });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
