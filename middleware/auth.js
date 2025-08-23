const jwt = require("jsonwebtoken");
const { secretkeys } = require("../helpers/secretkeys");

function auth(req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "").trim();
    if (!token) return res.status(401).json({ msg: "Token mavjud emas", success: false });

    try {
        let decoded;
        try {
            decoded = jwt.verify(token, secretkeys.user); // oddiy user uchun
        } catch (err) {
            decoded = jwt.verify(token, secretkeys.admin); // admin uchun
        }

        req.user = decoded; // { id, role }
        next();
    } catch (err) {
        return res.status(401).json({ msg: "Token noto‘g‘ri yoki muddati tugagan" });
    }
}

module.exports = auth;