const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/login');
};


const authUser = (req, res, next) => {
    if (req.user.id == req.params.id) {
        next()
    } else {
        return res.status(403).json("You do not have permission")
        // return res.render('403')
    }
}


const authRole = (role) => {
    return (req, res, next) => {
        const userRole = req.user.roleId
        console.log(userRole)
        if (role.includes(userRole)) {
            next()
        } else {
            return res.status(401).json("You are not authorized")
            // return res.render('403')
        }
    }
}

module.exports = { ensureAuthenticated, authRole, authUser };