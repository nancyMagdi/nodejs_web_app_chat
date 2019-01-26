const db = require('../config/db.config.js');
const User = db.user;
const ChatThread = db.chatThread;
const ChatHistory = db.chatHistory;
const Op = db.Sequelize.Op;

exports.getUserContactListChatHistory = (req, res) => {
    db.sequelize.query("SELECT a.* FROM chats_history a INNER JOIN ( SELECT ChatThreadId, MAX(CreationDateTime) mxdate FROM chats_history WHERE (`chats_history`.`FromUserId` = :userId OR `chats_history`.`ToUserId` =:userId  ) GROUP BY ChatThreadId ) b ON a.ChatThreadId = b.ChatThreadId AND a.CreationDateTime = b.mxdate",
        { replacements: { userId: req.params.userId }, type: db.Sequelize.QueryTypes.SELECT })
        .then(usersTherad => {
            var usersWithMessage = {};
            //console.log(usersTherad.length);
            var resultArray = [];
            usersTherad.forEach(item => {
                if (item.ToUserId == req.params.userId) {
                    usersWithMessage[item.FromUserId] = {
                        "message": item.messageText,
                        "date": item.CreationDateTime
                    }
                    resultArray.push(item.FromUserId);
                } else {
                    usersWithMessage[item.ToUserId] = {
                        "message": item.messageText,
                        "date": item.CreationDateTime
                    }
                    resultArray.push(item.ToUserId);
                }
            });
            User.findAll({
                attributes: { exclude: ["Password", "Username"] },
                where: {
                    Id: {
                        [Op.in]: resultArray
                    }
                },
                raw: true
            }).then(users => {
                users.forEach(function (user, index) {
                    this[index]["message"] = usersWithMessage[user.Id];
                }, users)

                res.status(200).json({
                    Success: true,
                    data: users
                });
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
        include: [ChatHistory],
        order: [[ChatHistory, 'CreationDateTime', 'DESC']],
        //  raw: true
    }).then(thread => {
        var resultArray = [] ;
        thread.forEach(item => {
            resultArray = item.chats_histories;
        });
        res.status(200).json({
            Success: true,
            data: resultArray
        });
    }).catch(err => {
        res.status(500).json({
            Success: false,
            data: err
        });
    });
}