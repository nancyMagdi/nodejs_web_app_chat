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
        raw: true
    }).then(users => {
        res.status(200).json({
            "description": "User Content Page",
            "users": users
        });
    }).catch(err => {
        res.status(500).json({
            "description": "Can not access user contact list",
            "error": err
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
        res.send("User is added to contact list successfully!");
    }).catch(err => {
        res.status(500).send("Fail! Error -> " + err);
    })
}
