const { decoding } = require('../util/jwt')

const menuChange = (req, res, next) => {
    const { AccessToken } = req.cookies
    if (AccessToken !== undefined) {
        const currentUser = decoding(AccessToken)
        if (currentUser != undefined) {
            res.locals.checkLogin = 1
            next()
        } else {
            res.locals.checkLogin = 0
            next()
        }
    }
    else { next() }
}

module.exports = menuChange