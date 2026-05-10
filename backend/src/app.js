import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import config from './config/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: config.cors.origin,
        credentials: true,
    }),
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.maxRequests,
    message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 200,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
