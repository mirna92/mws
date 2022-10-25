const router = require('express').Router();
const {body} = require('express-validator');
const {login} = require('./controllers/loginController');
const {getUser} = require('./controllers/getUserController');


router.post('/login',[
    body('name',"Invalid name")
    .notEmpty()
    .escape(),
    body('Password',"The Password must be of minimum 4 characters length").notEmpty().trim().isLength({ min: 4 }),
],login);

router.get('/getuser',getUser);

module.exports = router;