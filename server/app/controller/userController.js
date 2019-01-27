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
        res.status(200).send({ Success: true, accessToken: token });
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
        attributes: ["Id", 'FullName', 'Username', 'Status', 'Image', 'SocketId'],
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

exports.signout = (id) => {
    console.log("Sign-out");
    User.findOne({
        where: {
            Id: id
        }
    }).then(user => {     
        user.update({
            Status: 0,
            SocketId: null
        }).then(() => {
           return true
        });
    }).catch(err => {
        console.log(err)
    });
}

exports.addSocketId = (userId, userSocketId) => {
    return User.update(
        { SocketId: userSocketId, Status: 1 },
        { where: { Id: userId } }
    );
}

exports.getUSerStatus = (userId) => {
    return User.findOne({
        where: { Id: userId },
        attributes: ['Status', 'SocketId'],
        raw: true
    });
}