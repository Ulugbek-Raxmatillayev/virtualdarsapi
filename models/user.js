const { required } = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5 || 3,
        maxlength: 100,
        validate: {
            validator: function (v) {
                //Bosh harfi katta bolishga teksirish
                return /^[A-Z]/.test(v);
            },
            message: props => `${props.value} - nom bosh harfi katta harf bolishi shart.`
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (email) {
                //emailda @gmail.com borligini teksiramz
                return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email) || /^[a-zA-Z0-9._%+-]+@mail\.ru$/.test(email)
            },
            message: 'Bu email to\'gri emas, email oxiri @gmail.com yoki @mail.ru bilan tugashi shart'
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (pass) {
                return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(pass)
            },
            message: 'Parol strong password emas. Iltimos parolni kamida 8 ta belgi yozib yarating.'
        }
    },
    role: {
        type: String,
        enum: ['role_user', 'role_admin'],
        default: 'role_user'
    }
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, role: this.role }, config.get('jwtPrivateKey'));
    return token;
}


userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

const Users = mongoose.model('Users', userSchema);

exports.Users = Users;