const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/login');
};

const authRole = (role) => {
    return (req, res, next) => {
        const userRole = req.user.roleId
        console.log(userRole)
        if (role.includes(userRole)) {
            next()
        } else {
            return res.status(403).json("You do not have access")
            // return res.render('403')
        }
    }
}


module.exports = { ensureAuthenticated, authRole };