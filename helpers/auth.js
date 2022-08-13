const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.render('401')
};

const authUser = (req, res, next) => {
    if (req.user.id == req.params.id) {
        return next()
    }
    // return res.status(403).json("You do not have permission")
    return res.render('403')
};

const authRole = (role) => {
    return (req, res, next) => {
        const userRole = req.user.roleId
        if (role.includes(userRole)) {
            return next()
        }
        // return res.status(403).json("You do not have permission")
        return res.render('403')
    }
}

const authActive = (req, res, next) => {
    const accountStatus = req.user.active
    if (accountStatus == 1) {
        return next()
    }

    return res.render('./user/deactivated')
}


module.exports = { ensureAuthenticated, authRole, authUser, authActive };