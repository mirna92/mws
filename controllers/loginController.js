const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const conn = require('../dbConnection').promise();


exports.login = async (req,res,next) =>{
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{

        const [row] = await conn.execute(
            "SELECT * FROM `user` WHERE `name`=?",
            [req.body.name]
          );

        if (row.length === 0) {
            return res.status(422).json({
                message: "Invalid name address",
            });
        }

        const passMatch = await bcrypt.compare(req.body.Password, row[0].Password);
        if(!passMatch){
            return res.status(422).json({
                message: "Incorrect password",
            });
        }

        const theToken = jwt.sign({id:row[0].User_id,role:row[0].admin},'the-super-strong-secrect',{ expiresIn: '1h' });

        return res.json({
            token:theToken,
            admin:row[0].admin,
            User_id:row[0].User_id
        });

    }
    catch(err){
        next(err);
    }
}