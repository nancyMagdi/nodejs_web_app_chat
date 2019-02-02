//const helper = require('./helper');
// TODo the helper will act as the controller functions so they need to be replaced in this file
const userController = require('../controller/userController');
const contactListController = require('../controller/contactListController');
const messagesController = require('../controller/messagesController');
class Socket {

    constructor(socket) {
        this.io = socket;
    }

    socketEvents() {

        this.io.on('connection', (socket) => {
            /**
            * send the messages to the user
            */
            socket.on('Message-sent', async (data) => {
                if (data.messageText === '') {
                    this.io.to(socket.id).emit(`add-message-response`, `Message cant be empty`);
                } else if (data.FromUserId === '') {
                    this.io.to(socket.id).emit(`add-message-response`, `Unexpected error, Login again.`);
                } else if (data.ToUserId === '') {
                    this.io.to(socket.id).emit(`add-message-response`, `Select a user to chat.`);
                } else {
                    console.log(data);
                    // save message to db
                    var created = new Date();
                    var savedData = {
                        FromUserId: data.FromUserId,
                        ToUserId: data.ToUserId,
                        MessageText: data.MessageText,
                        CreationDateTime: created,
                        ChatThreadId: null,
                        AttachementLocation:data.AttachementLocation,
                        IsRead: 0
                    }
                    const userThread = await messagesController.insertThread(savedData);
                    // check if the user is online 
                    
                    if (userThread && userThread[0] !== null) {
                        var userThreadData = userThread[0].get({ plain: true });
                        savedData.ChatThreadId = userThreadData.Id
                        // get the user data 
                        const userData = await userController.getUSerStatus(data.ToUserId);
                        if (userData && userData != null) {
                            // save the message 
                            savedData.IsRead = userData.Status;
                            messagesController.insertMessages(savedData);
                            // send the message to the socket for the user 
                            if (userData.Status == 1) {
                                let toSocketId = userData.SocketId;
                                this.io.to(toSocketId).emit('message-received', savedData);
                            }

                        }

                    }
                }
            });


            /**
            * Logout the user
           */
            socket.on('logout', (data) => {
                userController.signout(data.id);
                socket.broadcast.emit('logout', {
                    error: false,
                    userDisconnected: true,
                    loggedinUserId: data.id
                });
            });
        });

    }

    socketConfig() {

        this.io.use(async (socket, next) => {
            let userId = socket.request._query['userId'];
            let userSocketId = socket.id;
            const response = await userController.addSocketId(userId, userSocketId);
            if (response && response !== null) {
                // emit that user has loged in
                socket.broadcast.emit('user-logged-in', {
                    error: false,
                    userDisconnected: false,
                    loggedinUserId: userId,
                });
                next();
            } else {
                console.error(`Socket connection failed, for  user Id ${userId}.`);
            }
        });

        this.socketEvents();
    }
}
module.exports = Socket;