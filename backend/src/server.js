import app from './app.js';
import config from './config/index.js';
import prisma from './lib/prisma.js';

const PORT = config.port;

const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('✓ Database connected successfully');

        app.listen(PORT, () => {
            console.log(`✓ Server running on port ${PORT}`);
            console.log(`✓ Environment: ${config.nodeEnv}`);
            console.log(`✓ API Health: http://localhost:${PORT}/api/health`);
        });
    } catch (error) {
        console.error('✗ Failed to start server:', error);
        process.exit(1);
    }
};

process.on('SIGINT', async () => {
    console.log('\n✓ Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n✓ Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

startServer();
