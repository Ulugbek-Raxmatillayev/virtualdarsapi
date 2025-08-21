function auth(req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer", "").trim();
    if (!token) return res.status(401).json({ msg: 'Token mavjud emas', success: false });

    try {
        const decoded = jwt.verify(token, secretkeys.user) || jwt.verify(token, secretkeys.admin);
        req.user = decoded; // { id: user._id, role: user.role }
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Token noto‘g‘ri yoki muddati tugagan' });
    }
}

module.exports = auth