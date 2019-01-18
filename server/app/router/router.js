const verifySignUp = require('./verifySignUp');
const authJwt = require('./verifyJwtToken');

module.exports = function(app) {

    const userController = require('../controller/userController');
 
	app.post('/api/auth/signup', [verifySignUp.checkDuplicateUserNameOrEmail], userController.signup);
	
	app.post('/api/auth/signin', userController.signin);
	
	app.get('/api/test/user', [authJwt.verifyToken], userController.userContent);
}