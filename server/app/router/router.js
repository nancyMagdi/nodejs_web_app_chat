const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');
class Routes {

    constructor(app) {

        this.app = app;
    }


    appRoutes() {
        const userController = require('../controller/userController');
        const contactListController = require('../controller/contactListController');
        const messagesController = require('../controller/messagesController');

        this.app.post('/api/auth/signup', [verifySignUp.checkDuplicateUserName], userController.signup);
        //ToDo add the search for user and updateUserImage routes 
        this.app.post('/api/auth/signin', userController.signin);
        this.app.get('/api/user/me/:userName', [authJwt.verifyToken], userController.userContent);
        // contact list api
        this.app.get('/api/contactList/getContactList/:userId', [authJwt.verifyToken], contactListController.getUserContactList);
        this.app.post('/api/contactList/addToContactList', [authJwt.verifyToken], contactListController.addToUserContactList);
        //Messages history 
        this.app.get('/api/messages/getContactChatHistory/:userId', [authJwt.verifyToken], messagesController.getUserContactListChatHistory);
        this.app.get('/api/messages/getUsersChatHistory/:loggedin/:secondUserId', [authJwt.verifyToken], messagesController.getUsersChatHistory);
        //Messages files handling
        this.app.get('/api/messages/downloadFile/:threadId/:fileName', [authJwt.verifyToken], messagesController.getFileForDownload);
        this.app.post('/api/messages/saveFile',[authJwt.verifyToken],   messagesController.uploadFile);
        this.app.get('/api/contactList/searchUsers/:userId/:searchValue',[authJwt.verifyToken],  contactListController.searchForContact);
    }
    routesConfig() {
        this.appRoutes();
    }
}
module.exports = Routes;