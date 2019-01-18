const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');

module.exports = function(app) {

    const userController = require('../controller/userController');
    const contactListController = require('../controller/contactListController');
	app.post('/api/auth/signup', [verifySignUp.checkDuplicateUserNameOrEmail], userController.signup);
	
	app.post('/api/auth/signin', userController.signin);
	
    app.get('/api/user/me/:userId', [authJwt.verifyToken], userController.userContent);
    app.get('/api/contactList/getContactList/:userId', [authJwt.verifyToken], contactListController.getUserContactList);
    app.post('/api/contactList/addToContactList', [authJwt.verifyToken], contactListController.addToUserContactList);
}