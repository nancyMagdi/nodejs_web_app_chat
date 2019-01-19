const db = require('../config/db.config.js');
const User = db.user;
const ChatThread = db.chatThread;
const ChatHistory = db.chatHistory;
const Op = db.Sequelize.Op;

exports.getUserContactListChatHistory = (req, res) => {
    ChatThread.findAll({
        where: {
            [Op.or]: [{ FirstUserId: req.params.userId, }, { SecondUserId: req.params.userId, }]
        },
        include: [{
            model: User,
            attributes: { exclude: ["Password","Username"]}
        } ],      
        raw: true
    }).then(users => {
        res.status(200).json({
            Success: true,
            data: users
        });
    }).catch(err => {
        res.status(500).json({
            Success: false,
            data: err
        });
    });
}

exports.getUsersChatHistory = (req, res) => {
    ChatThread.findAll({
        where: {
            [Op.or]: [
                {
                    [Op.and]: [
                        { FirstUserId: req.params.loggedin, },
                        { SecondUserId: req.params.secondUserId }]
                },
                {
                    [Op.and]: [
                        { SecondUserId: req.params.loggedin, },
                        { FirstUserId: req.params.secondUserId }]
                }
            ]
        },
        include: [ ChatHistory ],
        order: [ [ChatHistory, 'CreationDateTime' ,'DESC'] ] ,      
        raw: true
    }).then(users => {
        res.status(200).json({
            Success: true,
            data: users
        });
    }).catch(err => {
        res.status(500).json({
            Success: false,
            data: err
        });
    });
}