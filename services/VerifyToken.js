// middlewares/IsLoggedIn.js
const jwt = require('jsonwebtoken');
const userModel = require('../models/users-model'); 

module.exports.verifyToken =async (token) => {
    try {
            const decoded = jwt.verify(token, 'LOGIN_KEY'); 

        const user = await userModel.findById(decoded.userid).select('-password');
     

        if (!user) {
            return false;
        }
    return user;
    } catch (err) {
        return false;
    }
};
