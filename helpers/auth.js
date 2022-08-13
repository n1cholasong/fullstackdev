const ensureAuthenticated = (req, res, next) => {
    let title = "Unauthorized"
    if (req.isAuthenticated()) {
        return next();
    }
    return res.render('401', { title })
};

const authUser = (req, res, next) => {
    let title = "Forbidden"
    if (req.user.id == req.params.id) {
        return next()
    }
    // return res.status(403).json("You do not have permission")
    return res.render('403', { title })
};

const authRole = (role) => {
    return (req, res, next) => {
        let title = "Forbidden"
        const userRole = req.user.roleId
        if (role.includes(userRole)) {
            return next()
        }
        // return res.status(403).json("You do not have permission")
        return res.render('403', { title })
    }
}

const authActive = (req, res, next) => {
    let title = "Account Deactivated"
    const accountStatus = req.user.active
    if (accountStatus == 1) {
        return next()
    }

    return res.render('./user/deactivated', { title })
}

const authValid = (req, res, next) => {
    let title = "Page not Found"
    const verified = req.user.verified
    if (verified == 0) {
        return next()
    }

    return res.render('404', { title })
}

module.exports = { ensureAuthenticated, authRole, authUser, authActive, authValid };