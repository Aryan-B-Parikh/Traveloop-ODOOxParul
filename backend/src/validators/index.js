import { body, validationResult } from 'express-validator';

export const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array().map((err) => ({
                field: err.param,
                message: err.msg,
            })),
        });
    }
    next();
};

export const signupValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Username must be between 3 and 100 characters'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    body('firstName')
        .trim()
        .isLength({ min: 1 })
        .withMessage('First name is required'),
    body('lastName')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Last name is required'),
    validationMiddleware,
];

export const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Invalid credentials'),
    validationMiddleware,
];

export const tripValidation = [
    body('startDestination')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Start destination is required'),
    body('returnPlace')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Return place is required'),
    body('startDate')
        .isISO8601()
        .withMessage('Invalid start date format'),
    body('endDate')
        .isISO8601()
        .withMessage('Invalid end date format'),
    body('description')
        .optional()
        .trim(),
    validationMiddleware,
];

export const itinerarySectionValidation = [
    body('location')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Location is required'),
    body('sectionDateStart')
        .isISO8601()
        .withMessage('Invalid start date format'),
    body('sectionDateEnd')
        .isISO8601()
        .withMessage('Invalid end date format'),
    body('sectionBudget')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Budget must be a positive number'),
    body('description')
        .optional()
        .trim(),
    validationMiddleware,
];

export const activityValidation = [
    body('name')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Activity name is required'),
    body('city')
        .trim()
        .isLength({ min: 1 })
        .withMessage('City is required'),
    body('description')
        .optional()
        .trim(),
    body('cost')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Cost must be a positive number'),
    body('duration')
        .optional()
        .trim(),
    body('category')
        .optional()
        .trim(),
    validationMiddleware,
];

export const expenseValidation = [
    body('category')
        .isIn(['ACCOMMODATION', 'TRANSPORTATION', 'FOOD', 'ACTIVITIES', 'SHOPPING', 'MISCELLANEOUS'])
        .withMessage('Invalid expense category'),
    body('description')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Description is required'),
    body('quantity')
        .isInt({ min: 1 })
        .withMessage('Quantity must be at least 1'),
    body('unitCost')
        .isFloat({ min: 0 })
        .withMessage('Unit cost must be a positive number'),
    validationMiddleware,
];

export const packingItemValidation = [
    body('category')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Category is required'),
    body('itemName')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Item name is required'),
    validationMiddleware,
];

export const tripNoteValidation = [
    body('content')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Note content is required'),
    body('tagType')
        .optional()
        .trim(),
    validationMiddleware,
];

export const communityPostValidation = [
    body('tripId')
        .isInt({ min: 1 })
        .withMessage('Invalid trip ID'),
    body('postContent')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Post content is required'),
    validationMiddleware,
];

export const updateProfileValidation = [
    body('firstName')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('First name must not be empty'),
    body('lastName')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Last name must not be empty'),
    body('phoneNumber')
        .optional()
        .trim(),
    body('city')
        .optional()
        .trim(),
    body('country')
        .optional()
        .trim(),
    body('additionalInfo')
        .optional()
        .trim(),
    validationMiddleware,
];
