const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const saltRounds = 10;

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body || {};

        let isCorrect = false;
        let userData;
        try {
            const filePath = path.join(__dirname, '..', '..', '..',  `user_${username}.json`); 
            const user = fs.readFileSync(filePath, 'utf-8');
            userData = JSON.parse(user);
            const comparePassword = await bcrypt.compare(password, userData.passwordHash);
            isCorrect = comparePassword;
        } catch (error) {
            console.error('Lỗi đọc file người dùng:', error);
            isCorrect = false;
        }

        if (isCorrect) {
            res.send({ ok: true, user: userData });
        } else {
            res.send({ ok: false });
        }
    } catch (error) {
        next(error);
    }
};

const register = async (req, res, next) => {
    try {
        const { username, password, name } = req.body || {};

        const passwordHash = await bcrypt.hash(password, saltRounds);
        const filePath = path.join(__dirname, '..', '..', '..', '..', `user_${username}.json`); 
        fs.writeFileSync(filePath, JSON.stringify({
            username,
            name,
            passwordHash,
        }));

        res.json({
            username,
            name,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    register,
};