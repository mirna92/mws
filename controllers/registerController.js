const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const conn = require('../dbConnection').promise();

exports.register = async(req,res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    try{
        
        const [row] = await conn.execute(
            "SELECT `name` FROM `user` WHERE `name`=?",
            [req.body.name]
          );
          console.log(row);
        if (row.length > 0) {
            return res.status(201).json({
                message: "The name already in use",
            });
        }

        const hashPass = await bcrypt.hash(req.body.Password, 12);

        const [rows] = await conn.execute('INSERT INTO `user`(`name`,`Password`,`admin`) VALUES(?,?,?)',[
            req.body.name,
            hashPass,
            req.body.admin
        ]);

        if (rows.affectedRows === 1) {
            return res.status(201).json({
                message: "The user has been successfully inserted.",
            });
        }
        
    }catch(err){
        next(err);
    }
}