import jwt from 'jsonwebtoken';
import config from '../config/index.js';

export const generateToken = (userId) => {
    return jwt.sign({ userId }, config.jwt.secret, { expiresIn: config.jwt.expiry });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, config.jwt.secret);
    } catch (error) {
        return null;
    }
};

export const decodeToken = (token) => {
    return jwt.decode(token);
};
