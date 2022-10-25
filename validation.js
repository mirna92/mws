const { check } = require('express-validator');
 
exports.signupValidation = [
    check('User_id', 'Name is requied').not().isEmpty(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
]


