const db = require('../config/db.config.js');
const User = db.user;
const UserContactList = db.contactList;
const Op = db.Sequelize.Op;


exports.getUserContactList = (req, res) => {
    UserContactList.findAll({
        where: {
            [Op.or]: [{ FirstUserId: req.params.userId, }, { SecondUserId: req.params.userId, }]
        },
        include: [User],
     //   raw: true
    }).then(users => {
        res.status(200).json({
            Success: true,
            data: users
        });
    }).catch(err => {
        res.status(500).json({
            Success: false,
            Messge: "Fail! Error -> " + err
        });
    });
}

exports.addToUserContactList = (req, res) => {
    // Save User to Database
    console.log(req.body.userId);
    UserContactList.findOrCreate({
        where: {
            [Op.or]: [
                {
                    [Op.and]: [
                        { FirstUserId: req.body.userId, },
                        { SecondUserId: req.body.connectToUserId }]
                },
                {
                    [Op.and]: [
                        { SecondUserId: req.body.userId, },
                        { FirstUserId: req.body.connectToUserId }]
                }
            ]
        },
        defaults: { FirstUserId: req.body.userId, SecondUserId: req.body.connectToUserId,isConnected:1 }
    }).spread((user, created) => {
        console.log(user.get({
            plain: true
        }))
        console.log(created)
        res.status(200).json({
            Success: true,
            Messge: "User is added to contact list successfully!"
        });
    }).catch(err => {
        res.status(500).json({
            Success: "false",
            Messge: "Fail! Error -> " + err
        });
    })
}
