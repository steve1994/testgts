var express = require('express');
var router = express.Router();
var md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const verySecretSalt = "very s3cr3t salt";

module.exports = (connection) => {

    router.post('/signup', function(req, res) {
        let username = req.body.username;
        let email = req.body.email;
        let encryptedPass = req.body.encrypted_password;
        let phone = req.body.phone;
        let address = req.body.address;
        let city = req.body.city;
        let country = req.body.country;
        let name = req.body.name;
        let postcode = req.body.postcode;
        connection.query('INSERT INTO user (address,city,country,email,name,password,phone,postcode,username) VALUES (?,?,?,?,?,?,?,?,?)',
                          [address,city,country,email,name,encryptedPass,phone,postcode,username],
                          function (error, rows, fields) {
                                if (error) {
                                    res.status(400).json({status:'failed',error});
                                } else {
                                    let encryptedToken = email + encryptedPass + verySecretSalt;
                                    let hash = md5(encryptedToken);
                                    res.status(201).json({email,token:hash,username})
                                }
                          })
    });

    router.post('/signin', function (req,res) {
        let email = req.body.email;
        let password = req.body.password;
        connection.query('SELECT * FROM user WHERE email=? AND password=?',[email,password],function (error,rows,field) {
            if (error) {
                res.status(400).json({status:'failed',error});
            } else {
                if (rows.length > 0) {
                    let encryptedToken = email + password + verySecretSalt;
                    let hash = md5(encryptedToken);
                    res.status(201).json({email,token:hash,username:rows[0]['username']})
                } else {
                    res.status(400).json({status:'failed',error:'user does not exist'});
                }
            }
        })
    })

    router.get('/', function (req,res) {
        let token = req.headers.authorization.replace("Bearer ","");
        connection.query('SELECT * FROM user',function (error,rows,field) {
            if (error) {
                res.status(400).json({status:'failed',error});
            } else {
                let tokenValid;
                for (let i=0;i<rows.length;i++) {
                    let email = rows[i].email;
                    let password = rows[i].password;
                    let encryptedToken = email + password + verySecretSalt;
                    let hash = md5(encryptedToken);
                    if (hash == token) {
                        tokenValid = true;
                    } else {
                        tokenValid = false;
                    }
                }
                if (tokenValid) {
                    res.status(200).json(rows);
                } else {
                    res.status(400).json({status:'failed',error:'token not valid'});
                }
            }
        })
    })

    return router;
}




// module.exports = router;
