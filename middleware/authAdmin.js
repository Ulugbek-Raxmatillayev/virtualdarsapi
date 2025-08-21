//admin uchun register yani admin qushish dasturchi uchun 
const authAdmin = (req, res, next) => {
    try {
        const decoded = jwt.verify(token, secretkeys.admin);
        if (decoded.role !== "role_admin")
            return res.status(403).json({ msg: 'Faqat admin uchun', success: false })
        req.user = decoded
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'token error' })
    }
}

module.exports = authAdmin