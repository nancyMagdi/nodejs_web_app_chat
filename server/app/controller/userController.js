const db = require('../config/db.config.js');
const config = require('../config/config.js');

const User = db.user;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');

exports.signup = (req, res) => {
    // Save User to Database
    console.log("Processing func -> SignUp");
    User.create({
        FullName: req.body.name,
        Username: req.body.username,
        Password: bcrypt.hashSync(req.body.password, 8),
        Status: 1,
        LastLoginTime: new Date()
    }).then(user => {
        res.status(200).json({
            Success: true,
            data: "User registered successfully!"
        });
    }).catch(err => {
        res.status(500).json({
            Success: false,
            Messge: "Fail! Error -> " + err
        });
    })
}

exports.signin = (req, res) => {
    console.log("Sign-In");
    User.findOne({
        where: {
            Username: req.body.username
        }
    }).then(user => {
        if (!user) {
            return res.status(404).json({
                Success: false,
                data: "User Not Found"
            });
        }
        var passwordIsValid = bcrypt.compareSync(req.body.password, user.Password);
        if (!passwordIsValid) {
            return res.status(401).send({ Success: false, accessToken: null, data: "Invalid Password!" });
        }
        var token = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        user.update({
            Status: 0
        }).then(() => {
            res.status(200).send({ Success: true, accessToken: token });
        });

    }).catch(err => {
        res.status(500).json({
            Success: false,
            data: 'Error -> ' + err
        });
    });
}

exports.userContent = (req, res) => {
    User.findOne({
        where: { Username: req.params.userName },
        attributes: ["Id",'FullName', 'Username', 'Status', 'Image'],
    }).then(user => {
        res.status(200).json({
            Success: true,
            "data": user
        });
    }).catch(err => {
        res.status(500).json({
            Success: false,
            "data": err
        });
    })
}

exports.signout = (req, res) => {
    console.log("Sign-In");
    User.findOne({
        where: {
            Username: req.body.username
        }
    }).then(user => {
        if (!user) {
            return res.status(404).json({
                Success: false,
                data: "User Not Found"
            });
        }
        user.update({
            Status: 0
        }).then(() => {
            res.status(200).send({ Success: false, accessToken: "" });
        });
    }).catch(err => {
        res.status(500).json({
            Success: false,
            "data": 'Error -> ' + err
        });
    });
}