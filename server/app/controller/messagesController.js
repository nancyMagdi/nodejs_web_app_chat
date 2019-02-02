const db = require('../config/db.config.js');
const config = require('../config/config.js');
var fs = require('fs');
const User = db.user;
const ChatThread = db.chatThread;
const ChatHistory = db.chatHistory;
const Op = db.Sequelize.Op;


exports.getUserContactListChatHistory = (req, res) => {
    db.sequelize.query("SELECT a.*,(select count(Id) from chats_history c where c.ChatThreadId = a.ChatThreadId and c.ToUserId = :userIdInner and c.IsRead=0 group by `ChatThreadId`) as unreadCount FROM chats_history a INNER JOIN ( SELECT ChatThreadId, MAX(CreationDateTime) mxdate FROM chats_history WHERE (`chats_history`.`FromUserId` = :userId OR `chats_history`.`ToUserId` =:userId  ) GROUP BY ChatThreadId ) b ON a.ChatThreadId = b.ChatThreadId AND a.CreationDateTime = b.mxdate",
        { replacements: { userId: req.params.userId, userIdInner: req.params.userId }, type: db.Sequelize.QueryTypes.SELECT })
        .then(usersTherad => {
            var usersWithMessage = {};
            //console.log(usersTherad.length);
            var resultArray = [];
            usersTherad.forEach(item => {
                if (item.ToUserId == req.params.userId) {
                    usersWithMessage[item.FromUserId] = {
                        "message": item.MessageText,
                        "date": item.CreationDateTime,
                        "unreadCount": item.unreadCount
                    };
                    resultArray.push(item.FromUserId);
                } else {
                    usersWithMessage[item.ToUserId] = {
                        "message": item.MessageText,
                        "date": item.CreationDateTime,
                        "unreadCount": item.unreadCount
                    };
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
            }).catch(err => {
                res.status(500).json({
                    Success: false,
                    data: err
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
        var resultArray = [];
        var threadId = 0;
        thread.forEach(item => {
            resultArray = item.chats_histories;
            threadId = item.Id
        });;
        db.sequelize.query("UPDATE chats_history SET IsRead=1 WHERE ChatThreadId = :threadId and ToUserId = :userId", { replacements: { userId: req.params.loggedin, threadId: threadId }, type: db.Sequelize.QueryTypes.UPDATE })
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

exports.insertThread = (data) => {
    // 1) get the thread Id for thr users or create if dont exist 
    return ChatThread.findOrCreate({
        where: {
            [Op.or]: [
                {
                    [Op.and]: [
                        { FirstUserId: data.FromUserId, },
                        { SecondUserId: data.ToUserId }]
                },
                {
                    [Op.and]: [
                        { SecondUserId: data.FromUserId, },
                        { FirstUserId: data.ToUserId }]
                }
            ]
        },
        defaults: { FirstUserId: data.FromUserId, SecondUserId: data.ToUserId, }
    })
}

exports.insertMessages = (data) => {
    ChatHistory.create(data).then(message => {
        return true;
    }).catch(err => {
        console.log("Fail! Error -> " + err)
    })
}

exports.getFileForDownload = (req, res) => {
    let fileLocation = config.filesLocation + req.params.threadId + "/" + req.params.fileName;
    res.download(fileLocation);
}

exports.uploadFile = (req, res) => {
    if (Object.keys(req.files).length == 0) {
        res.status(500).json({
            Success: false,
            data: "No files were uploaded."
        });
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    var selectedFile = req.files.selectedFile;
    //console.log(selectedFile);
    var dir = config.filesLocation + req.body.threadId;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    // Use the mv() method to place the file somewhere on your server  
    selectedFile.mv(config.filesLocation + req.body.threadId + "/" + req.files.selectedFile.name, function (err) {
        if (err) {
            res.status(500).json({
                Success: false,
                data: err
            });
        } else {
            res.status(200).json({
                Success: true,
                data: "file Uploaded"
            });
        }

    });
}