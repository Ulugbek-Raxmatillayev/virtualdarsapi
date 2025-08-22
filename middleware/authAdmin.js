const jwt = require('jsonwebtoken');
const secretkeys = require('../helpers/secretkeys')

const authAdmin = (req, res, next) => {
    try {
        // Authorization header: "Bearer <token>"
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ msg: 'Token topilmadi' });

        const token = authHeader.split(' ')[1]; // "Bearer" dan keyingi qismni olish
        if (!token) return res.status(401).json({ msg: 'Token berilmagan' });

        const decoded = jwt.verify(token, secretkeys.secretkeys.admin);

        if (decoded.role !== "role_admin")
            return res.status(403).json({ msg: 'Faqat admin uchun', success: false });

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Token xato yoki eskirgan', error: err.message });
    }
}

module.exports = authAdmin;
