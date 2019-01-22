const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');

module.exports = function (app) {

    const userController = require('../controller/userController');
    const contactListController = require('../controller/contactListController');
    const messagesController = require('../controller/messagesController');
    app.post('/api/auth/signup', [verifySignUp.checkDuplicateUserName], userController.signup);
    //ToDo add the logout, search for user and updateUserImage routes 
    app.post('/api/auth/signin', userController.signin);
    app.get('/api/user/me/:userName', [authJwt.verifyToken], userController.userContent);
    // contact list api
    app.get('/api/contactList/getContactList/:userId', [authJwt.verifyToken], contactListController.getUserContactList);
    app.post('/api/contactList/addToContactList', [authJwt.verifyToken], contactListController.addToUserContactList);
    //Messages history 
    app.get('/api/messages/getContactChatHistory/:userId', [authJwt.verifyToken], messagesController.getUserContactListChatHistory);
    app.get('/api/messages/getUsersChatHistory/:loggedin/:secondUserId', [authJwt.verifyToken], messagesController.getUsersChatHistory);
    // need speacial handling for sockets
   // app.post('/api/messages/saveMessage', [authJwt.verifyToken], messagesController.addToUserContactList);

}