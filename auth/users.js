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
// #swagger.tags = ["Auth"]
// #swagger.description = 'Barcha userlarni olish'
router.get('/users', authAdmin, async (req, res) => {
    const users = await Users.find().sort('name')
    if (!users) {
        res.status(404).send('Users not found')
    }
    res.send(users)
});

//user o'zini malumotini oladi
// #swagger.tags = ["Auth"]
// #swagger.description = 'o'zini olish'
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
// #swagger.tags = ["Auth"]
// #swagger.description = 'register qilish'
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

// user o'z malumotlarini update qiladi
// #swagger.tags = ["Auth"]
// #swagger.description = 'Update user'
router.put('/users/me', auth, async (req, res) => {
    try {
        const { name, email, currentPassword, newPassword, repeatedPassword } = req.body
        let user = await Users.findById(req.user.id)
        if (!user) return res.status(404).json({ msg: 'User not found', success: false })

        if (name) user.name = name
        if (email) user.email = email

        if (currentPassword || newPassword || repeatedPassword) {
            if (!currentPassword || !repeatedPassword || !newPassword) {
                res.status(400).json({ msg: 'Plese enter all inputs to password' })
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password)

            if (!isMatch) {
                res.status(400).json({ msg: 'Current password noto\'g\'ri' })
            }

            if (newPassword !== repeatedPassword) {
                res.status(400).json({ msg: 'Iltimos yangi parol va takroriy parol bir xil ekaniga ishonch hosil qilng' })
            }

            const salt = bcrypt.genSalt(10)

            user.password = await bcrypt.hash(newPassword, salt)
        }

        await user.save();
        res.status(200).json({data: user, success: true, status: 200})
    } catch (err) {
        res.status(500).json({ msg: err.message, success: false })
    }
});


// #swagger.tags = ["Auth"]
// #swagger.description = 'Login qilish'
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
        console.error(err);
        console.log(secretkeys.secretkeys.admin)
        res.status(500).json({ msg: err })
    }
})

//admin add qilish 
// #swagger.tags = ["Auth"]
// #swagger.description = 'Admin qo'shish'
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