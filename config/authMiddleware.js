const isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    return res.status(401).json({message: "Unauthorised! Kindly login"});
}

module.exports = isAuthenticated;