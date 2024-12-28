const jwt = require("jsonwebtoken");

module.exports.checkNotAuthenticated = async (req, res, next)=> {
    const token = req.cookies.UserToken;
  if (token) {
    try {
        jwt.verify(token, 'LOGIN_KEY');
      return res.redirect("/dashboard");
    } catch (err) {
     res.redirect('/login')
    }
  }
  next();
}
