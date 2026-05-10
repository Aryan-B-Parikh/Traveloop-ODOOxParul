import dotenv from 'dotenv';

dotenv.config();

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const isLocalhostOrigin = (origin) => /^https?:\/\/localhost:\d+$/i.test(origin);

const matchesAllowedOrigin = (origin, allowedOrigin) => {
    if (allowedOrigin === '*') {
        return true;
    }

    if (allowedOrigin.startsWith('*.')) {
        const domain = allowedOrigin.slice(2).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const wildcardRegex = new RegExp(`^https?:\\/\\/[\\w-]+\\.${domain}$`, 'i');
        return wildcardRegex.test(origin);
    }

    return origin === allowedOrigin;
};

export const isCorsOriginAllowed = (origin, nodeEnv) => {
    if (!origin) {
        return true;
    }

    // In development, allow any localhost port so each developer can run on different Vite ports.
    if (nodeEnv === 'development' && isLocalhostOrigin(origin)) {
        return true;
    }

    return corsOrigins.some((allowedOrigin) => matchesAllowedOrigin(origin, allowedOrigin));
};

export const config = {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        url: process.env.DATABASE_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        expiry: process.env.JWT_EXPIRY || '7d',
    },
    cors: {
        origins: corsOrigins,
    },
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
        maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    },
};

export default config;
