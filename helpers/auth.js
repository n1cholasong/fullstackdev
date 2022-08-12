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
        console.log(userRole)
        if (role.includes(userRole)) {
            return next()
        }
        // return res.status(403).json("You do not have permission")
        return res.render('403')
    }
}

module.exports = { ensureAuthenticated, authRole, authUser };