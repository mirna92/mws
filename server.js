const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const indexRouter = require('./routes.js');
const conn = require('./dbConnection');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
app.use(express.static('public'));// to use public front-end resource

app.use(express.json());
 
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
})); 

    app.use(cors());
 
    app.use('/api', indexRouter);
  
// Handling Errors
app.use((err, req, res, next) => {
    // console.log(err);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      message: err.message,
    });
});
// Retrieve all users 
app.get('/user', function (req, res) {

    
    conn.query('SELECT * FROM user', function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'users list.' });
    });
    });


    // Retrieve user with id 
app.get('/user/:id', function (req, res) {
    
    let user_id = req.params.id;
    if (!user_id) {
    return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    conn.query('SELECT * FROM user where User_id=?', user_id, function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results[0], message: 'users list.' });
    });
    });

// Add a new user  



    app.post('/user', function (req, res) {
        const theToken = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
       if(!decoded.role) {
       return res.status(401).send({error:true,message:'bla bla bla'});
       }
    
    let user_id = req.body.User_id ;
    let name = req.body.name ;
    bcrypt.hash(req.body.Password, 12).then(
        Password=>{
            conn.query("INSERT INTO user(`name`,`Password`) VALUES(?,?) ", [name,Password], function (error, results, fields) {
                if (error) return res.send({error:true,message:error.message});;
                return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
                });
            

                });
   
    });
    
    // if (!user) {
    // return res.status(400).send({ error:true, message: 'Please provide user' });
    // }


    //  Update user with id
app.post('/useredit', async function (req, res) {
    let user_id = req.body.user_id;
    let name = req.body.name;
    let Password= await bcrypt.hash(req.body.Password, 12)
    if (!user_id || !name||!Password) {
    return res.status(400).send({ error: user_id, message: 'Please provide user and user_id' });
    }
    conn.query("UPDATE user SET name=?,Password=? WHERE user_id = ?", [name,Password,user_id], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'user has been updated successfully.' });
    });
    });

    //  Delete user
app.post('/userdelete', function (req, res) {
    let user_id = req.body.user_id;
    if (!user_id) {
    return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    conn.query('DELETE FROM user WHERE User_id = ?', [user_id], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'User has been deleted successfully.' });
    });
    }); 



////
// Add a Material
app.post('/materialadd', function (req, res) {
        const theToken = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
       if(!decoded.role) {
       return res.status(401).send({error:true,message:'the user is not admin'});
       }
    
    let name = req.body.name ;
    let isService = req.body.isService ;
    let description=req.body.description;
            conn.query("INSERT INTO material(`name`,`isService`,`description`) VALUES(?,?,?) ", [name,isService,description], function (error, results, fields) {
                if (error) return res.send({error:true,message:error.message});;
                return res.send({ error: false, data: results, message: 'New material has been created successfully.' });
                });
                });
     //  Update Material
app.post('/materialedit', async function (req, res) {
    let id = req.body.id;
    let name = req.body.name;
    let isService = req.body.isService ;
    let description=req.body.description;
    if (!id || !name||!isService) {
    return res.status(400).send({ error: id, message: 'Please provide material and id' });
    }
    conn.query("UPDATE material SET name=?,isService=?,description=? WHERE id = ?", [name,isService,description,id], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Material has been updated successfully.' });
    });
    });
    // get Material
    app.get('/material', function (req, res) {
        conn.query('SELECT * FROM material', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'material list.' });
        });
        });
// Add a OutlayType
app.post('/outlaytypeadd', function (req, res) {
    const theToken = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(theToken, 'the-super-strong-secrect');
   if(!decoded.role) {
   return res.status(401).send({error:true,message:'the user is not admin'});
   }

let name = req.body.name ;
let description=req.body.description;
        conn.query("INSERT INTO outlaytype(`name`,`description`) VALUES(?,?) ", [name,description], function (error, results, fields) {
            if (error) return res.send({error:true,message:error.message});;
            return res.send({ error: false, data: results, message: 'New Outlay Type has been created successfully.' });
            });
            });
 //  Update OutlayType
app.post('/outlaytypeedit', async function (req, res) {
let id = req.body.id;
let name = req.body.name;
let description=req.body.description;
if (!id || !name) {
return res.status(400).send({ error: id, message: 'Please provide material and id' });
}
conn.query("UPDATE outlaytype SET name=?,description=? WHERE id = ?", [name,description,id], function (error, results, fields) {
if (error) throw error;
return res.send({ error: false, data: results, message: 'Outlay Type has been updated successfully.' });
});
});

//get outlay type
app.get('/outlaytype',function(req,res){
    conn.query('select * from outlaytype ',function(error,results,fields){
        if (error)throw error;
        return res.send({error:false,data:results,message:'Outlay List.'});
    });
});

// Add a Outlay
app.post('/outlayadd', function (req, res) {
    let Material_id = req.body.Material_id ;
    let OutlayType_Id = req.body.OutlayType_Id ;
    let User_id = req.body.User_id ;
    let price = req.body.price ;
    let date =req.body.date ;
    let description = req.body.description ;
        conn.query("INSERT INTO outlay(`Material_id`,`OutlayType_Id`,`User_id`,`price`,`date`,`description`) VALUES(?,?,?,?,?,?) ", [Material_id,OutlayType_Id,User_id,price,date,description], function (error, results, fields) {
            if (error) return res.send({error:true,message:error.message});;
            return res.send({ error: false, data: results, message: 'New Outlay has been created successfully.' });
            });
            });
 //  Update Outlay
app.post('/outlayedit', async function (req, res) {
let id = req.body.id;
let Material_id = req.body.Material_id ;
let OutlayType_id = req.body.OutlayType_id ;
let User_id = req.body.User_id ;
let price = req.body.price ;
let date = req.body.date ;
let description = req.body.description ;
if (!id || !Material_id||!OutlayType_id) {
return res.status(400).send({ error: id, message: 'Please provide outlay and id' });
}
conn.query("UPDATE outlay SET Material_id=?,OutlayType_id=?,User_id=?,price=?,date=?,description=? WHERE id = ?", [Material_id,OutlayType_id,User_id,price,date,description,id], function (error, results, fields) {
if (error) throw error;
return res.send({ error: false, data: results, message: 'Outlay has been updated successfully.' });
});
});

app.get('/outlay/:id', function (req, res) {
    let id = req.params.id;
    conn.query('Select outlay.id,material.name as material_name,outlaytype.name as outlay_name,outlay.price,outlay.description,outlay.date as date from outlay  join material on material.id=outlay.Material_id  join outlaytype on outlaytype.id=outlay.OutlayType_id where outlay.User_id=?',[id], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'outlay list.' });
    });
    });



app.post('/outlaydelete', function (req, res) {
    let id = req.body.id;
    
    conn.query('DELETE FROM outlay WHERE id = ?', [id], function (error, results, fields) {
    if (error) throw error;
    return res.send({ error: false, data: results, message: 'Outlay has been deleted successfully.' });
    });
    }); 

    app.get('/report1', function (req, res) {
        conn.query('Select material.name as material_name,outlaytype.name as outlay_name,outlay.price,STR_TO_DATE(outlay.date, "%d-%m-%Y")as date from familyexpenses.outlay  join familyexpenses.material on material.id=outlay.Material_id  join familyexpenses.outlaytype on outlaytype.id=outlay.OutlayType_id', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: '' });
        });
        });
        app.get('/report2', function (req, res) {
            conn.query('Select material.name as material_name,outlaytype.name as outlay_name,user.name as user_name ,outlay.price from familyexpenses.outlay  join familyexpenses.material on material.id=outlay.Material_id join familyexpenses.outlaytype on outlaytype.id=outlay.OutlayType_id join familyexpenses.user on user.User_id=outlay.User_id  order by user_name', function (error, results, fields) {
            if (error) throw error;
            return res.send({ error: false, data: results, message: '' });
            });
            });

app.listen(3000,() => console.log('Server is running on port 3000'));
