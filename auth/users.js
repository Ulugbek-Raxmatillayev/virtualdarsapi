const mongoose = require('mongoose')
const express = require('express')
const { Users } = require('../models/user');
const jwt = require('jsonwebtoken');
const { secretkeys } = require('../helpers/secretkeys');
const router = express.Router()
const bcrypt = require('bcrypt');
const authAdmin = require('../middleware/authAdmin');
const auth = require('../middleware/auth')

//admin uchun userlarni get qilish 
router.get('/users', authAdmin, async (req, res) => {
    const users = await Users.find().sort('name')
    if (!users) {
        res.status(404).send('Users not found')
    }
    res.send(users)
});

//user o'zini malumotini oladi

router.get('/users/getMe', auth, async (req, res) => {
    try {
        const userMe = await Users.findById(req.user.id).select("-password"); // parolni olib tashladik
        if (!userMe) return res.status(404).json({ msg: "User topilmadi" });

        res.json({ success: true, user: userMe });
    } catch (err) {
        res.status(500).json({ msg: "Server xatosi" });
    }
});

//userlar uchun register qilish
router.post('/users', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        //bazada user mavjudligini tekshiramz
        let user = await Users.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User alredy exists' })

        //user yaratmz 
        user = new Users({ name, email, password });
        await user.save();

        const payload = { id: user._id, role: user.role };
        const token = jwt.sign(payload, secretkeys.user, { expiresIn: "1d" });

        res.status(201).json({ success: true, user, token })
    } catch (err) {
        if (err.name === 'ValidationError') {
            // Har bir field bo'yicha xabarni olish
            const errors = {};
            for (let field in err.errors) {
                errors[field] = err.errors[field].message;
            }
            return res.status(400).json({ success: false, errors });
        }
        console.error(err);
        res.status(500).json({ msg: "Server xatosi" });
    }

})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await Users.findOne({ email })
        if (!user) return res.status(400).json({ msg: 'Email yoki parol xato', success: false });

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ msg: 'Email yoki parol xato', success: false })

        const payload = { id: user._id, role: user.role };
        const secretKey = user.role === 'role_admin' ? secretkeys.admin : secretkeys.user

        const token = jwt.sign(payload, secretKey, { expiresIn: "1d" });
        res.status(200).json({ success: true, token: token, role: user.role });

    } catch (err) {
        res.status(500).json({ msg: err })
    }
})

//admin add qilish 
router.post('/add-admin', authAdmin, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let user = await Users.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        user = new Users({ name, email, password, role: "role_admin" });
        await user.save();

        const payload = { id: user._id, role: user.role };
        const token = jwt.sign(payload, secretkeys.user, { expiresIn: "1d" });

        res.status(201).json({ success: true, msg: "Admin qo'shildi", data: user, token: token });
    } catch (err) {
        res.status(500).send(err)
    }
})

module.exports = router