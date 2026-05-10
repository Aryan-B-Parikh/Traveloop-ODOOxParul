import prisma from '../lib/prisma.js';

export const adminOnly = async (req, res, next) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.userId },
        });

        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
